import type { ScoredChunk } from "./embeddings";

export const MAX_MESSAGE_CHARS = 500;
export const MAX_HISTORY_MESSAGES = 12;
/** How many prior turns get replayed to the model. Caps token growth per turn. */
export const MAX_REPLAYED_TURNS = 6;

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

const GREETING = /^(hi|hey|hello|yo|sup|good (morning|afternoon|evening)|howdy)[\s!.?]*$/i;

export function isGreeting(question: string): boolean {
    return GREETING.test(question.trim());
}

export const GREETING_REPLY =
    "Hi — I'm Daehan's AI assistant. I can answer questions about his background, " +
    "projects, and how his experience maps to a role you're hiring for.\n\n" +
    "What role are you recruiting for?";

export const OFF_TOPIC_REPLY =
    "I can only answer questions about Daehan Lim's professional background — his " +
    "experience, projects, skills, and how they fit a role you're hiring for.\n\n" +
    "Try asking something like *\"How does his experience map to a Senior Data Engineer role?\"*";

/**
 * The primary off-topic stop, and the main reason this endpoint is cheap to run.
 *
 * Relevance is judged from retrieval scores, which we already have — so an
 * off-topic question costs one embedding call and never reaches the chat model.
 * A prompt instruction alone can't make that guarantee.
 */
export function isOnTopic(results: ScoredChunk[]): boolean {
    if (results.length === 0) return false;
    const threshold = Number.parseFloat(process.env.CHAT_TOPIC_THRESHOLD ?? "");
    const cutoff = Number.isFinite(threshold) ? threshold : 0.55;
    return results[0].score >= cutoff;
}

export function limitMessage(reason: string): string {
    switch (reason) {
        case "conversation":
            return (
                "We've reached the end of this conversation. If you'd like to go deeper, " +
                "reach Daehan directly at daehanlim1@gmail.com."
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
