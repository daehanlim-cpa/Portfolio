import { NextResponse } from "next/server";
import { siteCorpus } from "@/lib/corpus";
import { LlmUnavailableError, cachedSystem, chatStream, type LlmMessage } from "@/lib/llm";
import { SYSTEM_INSTRUCTION, buildReference } from "@/lib/prompt";
import { pickSources } from "@/lib/sources";
import { INJECTION_REPLY, LEAK_REPLY, PERSONAL_INFO_REPLY, createOutputGuard, redact, screen } from "@/lib/safety";
import { checkLimits, isBlocked, logTranscript, recordStrike, CONVERSATION_LIMIT } from "@/lib/ratelimit";
import {
    GREETING_REPLY,
    MAX_REPLAYED_TURNS,
    clientIp,
    isAllowedOrigin,
    isGreeting,
    limitMessage,
    sanitizeHistory,
    validateBody,
    type ChatMessage,
} from "@/lib/guardrails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Headroom for a long streamed answer. */
export const maxDuration = 60;

/** Cost ceiling for a single answer. Typical answers use a few hundred tokens. */
const MAX_ANSWER_TOKENS = 2048;

const EMPTY_ANSWER =
    "I can't help with that one. Ask me about Daehan's work, projects or background, or reach him at daehanlim1@gmail.com.";

const UNAVAILABLE = "The assistant isn't available right now. You can reach Daehan directly at daehanlim1@gmail.com.";

/** "blocked" renders as a quiet notice and is left out of replayed history. */
type ChatStatus = "ok" | "greeting" | "guarded" | "blocked";

/** `remaining` is omitted for replies that didn't consume quota; the client keeps its count. */
function textStream(body: string, status: ChatStatus, remaining?: number) {
    const headers: Record<string, string> = {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Chat-Status": status,
    };
    if (remaining !== undefined) headers["X-Conversation-Remaining"] = String(Math.max(0, remaining));
    return new Response(body, { status: 200, headers });
}

function refuse(status: number, message: string, retryAfterSeconds?: number, code?: string) {
    return NextResponse.json(
        code ? { message, code } : { message },
        {
            status,
            headers: retryAfterSeconds
                ? { "Retry-After": String(retryAfterSeconds), "Cache-Control": "no-store" }
                : { "Cache-Control": "no-store" },
        }
    );
}

/**
 * Replayed turns: sanitized (see sanitizeHistory), trimmed to the most recent,
 * and starting on a user turn so the exchange reads coherently.
 */
function buildHistory(messages: ChatMessage[]): LlmMessage[] {
    const prior = sanitizeHistory(messages.slice(0, -1)).slice(-MAX_REPLAYED_TURNS);
    while (prior.length && prior[0].role !== "user") prior.shift();
    return prior.map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));
}

export async function POST(request: Request) {
    // 1. Cheapest check first: did this even come from the site?
    if (!isAllowedOrigin(request)) {
        return refuse(403, "Requests must originate from the site.");
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return refuse(400, "Malformed request.");
    }

    // 2. Shape and size caps, before anything costs money.
    const validated = validateBody(body);
    if (!validated.ok) {
        return refuse(validated.status, validated.message);
    }
    const { messages, question } = validated;

    const ip = clientIp(request);
    const sessionId = request.headers.get("x-chat-session")?.slice(0, 64) || `anon-${ip}`;

    // 3. Repeat offenders are refused before anything else is done for them.
    if (await isBlocked(ip)) {
        await logTranscript(sessionId, { question, answer: "", blocked: "ip_blocked" });
        return refuse(429, limitMessage("blocked"));
    }

    // 4. Screening: injection attempts and requests for private details get a
    // fixed reply with no model call. Only injection counts toward a block;
    // asking for a phone number is nosy, not hostile.
    const verdict = screen(question);
    if (verdict) {
        const reply = verdict === "injection" ? INJECTION_REPLY : PERSONAL_INFO_REPLY;
        if (verdict === "injection") await recordStrike(ip);
        console.warn(`[safety] ${verdict} screened from ${ip}`);
        await logTranscript(sessionId, { question, answer: reply, blocked: verdict });
        return textStream(reply, verdict === "injection" ? "blocked" : "guarded");
    }

    // 5. Quota. Short-circuits before the global budget is touched.
    const limits = await checkLimits(sessionId, ip);
    if (!limits.ok) {
        await logTranscript(sessionId, {
            question,
            answer: "",
            blocked: limits.reason,
        });
        return refuse(
            limits.reason === "conversation" ? 409 : 429,
            limitMessage(limits.reason ?? ""),
            limits.retryAfterSeconds
        );
    }

    // 6. Greetings get a canned welcome — no model call at all.
    if (isGreeting(question)) {
        return textStream(GREETING_REPLY, "greeting", limits.conversationRemaining);
    }

    try {
        // 7. One generation call, with the whole site as cached reference. There
        // is no relevance gate: the site is small enough to send in full, and the
        // system instruction handles questions that stray off topic. Personal
        // data the visitor typed is removed before it leaves the server.
        const generation = new AbortController();
        request.signal.addEventListener("abort", () => generation.abort(), { once: true });
        const deltas = chatStream(
            cachedSystem(SYSTEM_INSTRUCTION, buildReference(siteCorpus())),
            [...buildHistory(messages), { role: "user", content: redact(question) }],
            { maxTokens: MAX_ANSWER_TOKENS, signal: generation.signal }
        );
        // The stream connects lazily; pull the first delta here so a missing
        // key or unreachable API becomes a clean 503, not a half-open stream.
        const first = await deltas.next();

        const sources = pickSources(question);

        const encoder = new TextEncoder();
        // Every delta passes the output guard: it redacts personal data and
        // stops the answer if the model starts reciting its instructions.
        const guard = createOutputGuard();
        let full = "";
        const emit = (controller: ReadableStreamDefaultController, text: string) => {
            if (!text) return;
            full += text;
            controller.enqueue(encoder.encode(text));
        };

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    if (!first.done && first.value) emit(controller, guard.push(first.value));
                    for await (const text of deltas) {
                        emit(controller, guard.push(text));
                        if (guard.tripped) break;
                    }
                    if (guard.tripped) {
                        generation.abort();
                        void recordStrike(ip);
                        console.warn(`[safety] output guard stopped a prompt leak for ${ip}`);
                        emit(controller, (full ? "\n\n" : "") + LEAK_REPLY);
                    } else {
                        emit(controller, guard.end());
                    }
                    // A declined or empty answer would otherwise render as a
                    // blank bubble.
                    if (!full.trim()) emit(controller, EMPTY_ANSWER);
                } catch (error) {
                    console.error("[chat] stream error:", error);
                    if (!full) {
                        controller.enqueue(
                            encoder.encode("Sorry — something went wrong. Please try again.")
                        );
                    }
                } finally {
                    controller.close();
                    void logTranscript(sessionId, { question, answer: full });
                }
            },
        });

        return new Response(stream, {
            status: 200,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-store",
                "X-Chat-Status": "ok",
                "X-Conversation-Remaining": String(Math.max(0, limits.conversationRemaining)),
                "X-Chat-Sources": encodeURIComponent(JSON.stringify(sources)),
            },
        });
    } catch (error) {
        if (error instanceof LlmUnavailableError) {
            console.error(`[chat] Claude unavailable (${error.code}):`, error.message);
            return refuse(503, UNAVAILABLE, undefined, error.code);
        }
        console.error("[chat] error:", error);
        return refuse(500, "Sorry — something went wrong. Please try again.");
    }
}

export async function GET() {
    return NextResponse.json({ conversationLimit: CONVERSATION_LIMIT });
}
