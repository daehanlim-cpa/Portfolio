import type { ScoredChunk } from "./embeddings";

export const MAX_MESSAGE_CHARS = 1000;
export const MAX_HISTORY_MESSAGES = 40;
/** How many prior turns get replayed to the model. Caps token growth per turn. */
export const MAX_REPLAYED_TURNS = 14;

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export type ValidationFailure = { ok: false; status: number; message: string };
export type ValidationSuccess = { ok: true; messages: ChatMessage[]; question: string };

/**
 * Rejects requests that didn't come from the site. This is the cheapest possible
 * filter — it runs before any Redis or model call — and stops casual scripted abuse.
 */
export function isAllowedOrigin(request: Request): boolean {
    const allowed = new Set(
        [
            process.env.NEXT_PUBLIC_SITE_URL,
            "https://daehanlim.com",
            "https://www.daehanlim.com",
            process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
            process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined,
        ].filter(Boolean) as string[]
    );

    const candidate = request.headers.get("origin") ?? request.headers.get("referer");
    if (!candidate) return false;

    try {
        const url = new URL(candidate);
        return [...allowed].some((entry) => new URL(entry).origin === url.origin);
    } catch {
        return false;
    }
}

export function validateBody(body: unknown): ValidationFailure | ValidationSuccess {
    if (typeof body !== "object" || body === null || !("messages" in body)) {
        return { ok: false, status: 400, message: "Malformed request." };
    }

    const { messages } = body as { messages: unknown };

    if (!Array.isArray(messages) || messages.length === 0) {
        return { ok: false, status: 400, message: "No messages provided." };
    }

    if (messages.length > MAX_HISTORY_MESSAGES) {
        return {
            ok: false,
            status: 400,
            message: "This conversation is too long. Please start a new one.",
        };
    }

    const parsed: ChatMessage[] = [];
    for (const message of messages) {
        if (
            typeof message !== "object" ||
            message === null ||
            typeof (message as ChatMessage).content !== "string" ||
            ((message as ChatMessage).role !== "user" &&
                (message as ChatMessage).role !== "assistant")
        ) {
            return { ok: false, status: 400, message: "Malformed message." };
        }
        parsed.push(message as ChatMessage);
    }

    const question = parsed.filter((m) => m.role === "user").pop()?.content.trim() ?? "";

    if (!question) {
        return { ok: false, status: 400, message: "Please enter a question." };
    }

    if (question.length > MAX_MESSAGE_CHARS) {
        return {
            ok: false,
            status: 400,
            message: `Please keep questions under ${MAX_MESSAGE_CHARS} characters.`,
        };
    }

    return { ok: true, messages: parsed, question };
}

const GREETING =
    /^(hi|hey|hello|yo|sup|hiya|howdy|good (morning|afternoon|evening)|what'?s up)( there| again)?[\s!.?]*$/i;

export function isGreeting(question: string): boolean {
    return GREETING.test(question.trim());
}

export const GREETING_REPLY =
    "Hey — I'm Daehan's AI assistant. I know his background, the projects he's " +
    "shipped, and how he works, so ask me whatever's useful.\n\n" +
    "If you're hiring, tell me the role and I'll give you a straight read on fit. " +
    "If you're just curious about the work, that's good too.";

/**
 * Only reached now by questions with essentially no relation to Daehan or his
 * field. Deliberately soft — it invites rather than scolds.
 */
export const OFF_TOPIC_REPLY =
    "That one's outside what I can speak to — I'm here for Daehan's work and " +
    "background.\n\n" +
    "Happy to get into his projects, how he approaches data and AI problems, or " +
    "how his experience lines up with a role you have in mind. For things I don't " +
    "hold, like compensation or availability, he's at daehanlim1@gmail.com.";

export type TopicVerdict = "ok" | "thin" | "off_topic";

/**
 * Three-way relevance judgement from retrieval scores, which we already have.
 *
 * The previous single cutoff at 0.60 refused anything it didn't recognise,
 * which made the assistant feel interrogative — a visitor asking a reasonable
 * adjacent question ("how does dbt fit into that stack?") got stonewalled.
 * Now only the genuinely unrelated is refused outright; the middle band is
 * answered with the retrieved context plus a note that it may be loose, and
 * the model decides how far it can honestly go.
 */
export function topicVerdict(results: ScoredChunk[]): TopicVerdict {
    if (results.length === 0) return "off_topic";
    const top = results[0].score;
    if (top >= confidentThreshold()) return "ok";
    if (top >= floorThreshold()) return "thin";
    return "off_topic";
}

/**
 * Calibrated against the real corpus with gemini-embedding-001 (768d,
 * RETRIEVAL_QUERY) — re-run `npx tsx --env-file=.env.local
 * scripts/calibrate-topic.ts` if the corpus changes materially. Measured bands:
 *
 *   core questions       0.620 - 0.700
 *   adjacent questions   0.572 - 0.688   ("what would he be bad at?" = 0.572)
 *   unrelated + probes   0.509 - 0.593   ("capital of France?" = 0.527)
 *
 * The adjacent and unrelated bands overlap, so no single cutoff separates them
 * cleanly — which is exactly why the middle band exists rather than a hard
 * yes/no. The floor sits at the bottom of the adjacent band: everything below
 * it is refused outright, everything above reaches the model with context.
 *
 * Note this means the old single 0.60 cutoff was refusing genuine questions —
 * "what would he be bad at?" scored 0.572 and never reached the model at all.
 *
 * Injection attempts land near the floor (0.564 for a system-prompt probe) and
 * some will pass it. The system instruction, not the score, is the real defense
 * there; the gate exists to keep unrelated traffic off the generation budget.
 */
const DEFAULT_CONFIDENT_THRESHOLD = 0.62;
const DEFAULT_FLOOR_THRESHOLD = 0.57;

function envNumber(name: string, fallback: number): number {
    const parsed = Number.parseFloat(process.env[name] ?? "");
    return Number.isFinite(parsed) ? parsed : fallback;
}

function confidentThreshold(): number {
    return envNumber("CHAT_TOPIC_THRESHOLD", DEFAULT_CONFIDENT_THRESHOLD);
}

function floorThreshold(): number {
    return envNumber("CHAT_TOPIC_FLOOR", DEFAULT_FLOOR_THRESHOLD);
}

export function limitMessage(reason: string): string {
    switch (reason) {
        case "conversation":
            return (
                "That's as far as this conversation goes. If you want to keep going, " +
                "Daehan himself is the better next step — daehanlim1@gmail.com."
            );
        case "global_daily":
            return (
                "The assistant is at capacity for today. Daehan would still love to hear " +
                "from you — email him at daehanlim1@gmail.com."
            );
        default:
            return (
                "You've sent quite a few questions in a short window. Please try again " +
                "later, or email Daehan directly at daehanlim1@gmail.com."
            );
    }
}

/** Best-effort client IP behind Vercel's proxy. */
export function clientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return request.headers.get("x-real-ip") ?? "unknown";
}
