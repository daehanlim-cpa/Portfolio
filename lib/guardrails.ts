
import { LEAK_MARKERS, redact, screen } from "./safety";

export const MAX_MESSAGE_CHARS = 1000;
/** Assistant turns come back from the browser, so they are capped too. */
export const MAX_ASSISTANT_CHARS = 8000;
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
 *
 * Same-origin is the primary test, and it needs no configuration: the browser
 * reports both where the page was loaded from (Origin) and the host it asked for
 * (X-Forwarded-Host on Vercel, Host elsewhere). If those agree, the request came
 * from this site, whatever domain that happens to be — custom domain, Vercel
 * alias, preview deployment, or localhost.
 *
 * The static list below only exists to cover cross-domain cases, e.g. an apex
 * domain fetching through a www canonical host. It deliberately does NOT rely on
 * VERCEL_URL for the visitor-facing domain: that variable holds the immutable
 * per-deployment hostname (portfolio-a1b2c3-xyz.vercel.app), never the alias a
 * visitor actually browses, so matching against it fails on every real visit.
 */
export function isAllowedOrigin(request: Request): boolean {
    const candidate = request.headers.get("origin") ?? request.headers.get("referer");
    if (!candidate) return false;

    let origin: URL;
    try {
        origin = new URL(candidate);
    } catch {
        return false;
    }

    const servedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (servedHost && origin.host === servedHost) return true;

    const allowed = [
        process.env.NEXT_PUBLIC_SITE_URL,
        process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : undefined,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
        "https://daehanlim.com",
        "https://www.daehanlim.com",
        process.env.NODE_ENV !== "production" ? "http://localhost:3000" : undefined,
    ].filter(Boolean) as string[];

    return allowed.some((entry) => {
        try {
            return new URL(entry).origin === origin.origin;
        } catch {
            return false;
        }
    });
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
        const { role, content } = message as ChatMessage;
        const cap = role === "user" ? MAX_MESSAGE_CHARS : MAX_ASSISTANT_CHARS;
        if (content.length > cap) {
            return { ok: false, status: 400, message: "A message in this conversation is too long." };
        }
        parsed.push({ role, content });
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

export function limitMessage(reason: string): string {
    switch (reason) {
        case "conversation":
            return (
                "That's as far as this conversation goes. If you want to keep going, " +
                "Daehan himself is the better next step — daehanlim1@gmail.com."
            );
        case "blocked":
            return (
                "The assistant isn't available from your connection right now. You can " +
                "still reach Daehan directly at daehanlim1@gmail.com."
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

/**
 * Prior turns are sent back by the browser, so they can't be trusted: a
 * visitor can edit them, including forging "assistant" replies to steer the
 * model. Before replaying them this drops any user turn the screen would have
 * refused (with the reply that followed it), any assistant turn that quotes
 * the instructions or carries injection markup, and removes personal data from
 * what remains.
 */
export function sanitizeHistory(history: ChatMessage[]): ChatMessage[] {
    const out: ChatMessage[] = [];
    let skipReply = false;
    for (const message of history) {
        if (message.role === "user") {
            skipReply = screen(message.content) !== null;
            if (!skipReply) out.push({ role: "user", content: redact(message.content) });
            continue;
        }
        const forged =
            screen(message.content) === "injection" ||
            LEAK_MARKERS.some((marker) => message.content.includes(marker));
        if (!skipReply && !forged) out.push({ role: "assistant", content: redact(message.content) });
        skipReply = false;
    }
    return out;
}
