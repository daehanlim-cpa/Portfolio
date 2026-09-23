import { NextResponse } from "next/server";
import { siteCorpus } from "@/lib/corpus";
import { LlmUnavailableError, cachedSystem, chatStream, type LlmMessage } from "@/lib/llm";
import { SYSTEM_INSTRUCTION, buildReference } from "@/lib/prompt";
import { pickSources } from "@/lib/sources";
import { checkLimits, logTranscript, CONVERSATION_LIMIT } from "@/lib/ratelimit";
import {
    GREETING_REPLY,
    MAX_REPLAYED_TURNS,
    clientIp,
    isAllowedOrigin,
    isGreeting,
    limitMessage,
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

type ChatStatus = "ok" | "greeting";

function textStream(body: string, status: ChatStatus, remaining: number) {
    return new Response(body, {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Chat-Status": status,
            "X-Conversation-Remaining": String(Math.max(0, remaining)),
        },
    });
}

function refuse(status: number, message: string, retryAfterSeconds?: number) {
    return NextResponse.json(
        { message },
        {
            status,
            headers: retryAfterSeconds
                ? { "Retry-After": String(retryAfterSeconds), "Cache-Control": "no-store" }
                : { "Cache-Control": "no-store" },
        }
    );
}

/** Replayed turns, starting on a user turn so the exchange reads coherently. */
function buildHistory(messages: ChatMessage[]): LlmMessage[] {
    const prior = messages.slice(0, -1).slice(-MAX_REPLAYED_TURNS);
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

    const sessionId =
        request.headers.get("x-chat-session")?.slice(0, 64) || `anon-${clientIp(request)}`;

    // 3. Quota. Short-circuits before the global budget is touched.
    const limits = await checkLimits(sessionId, clientIp(request));
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

    // 4. Greetings get a canned welcome — no model call at all.
    if (isGreeting(question)) {
        return textStream(GREETING_REPLY, "greeting", limits.conversationRemaining);
    }

    try {
        // 5. One generation call, with the whole site as cached reference. There
        // is no relevance gate: the site is small enough to send in full, and the
        // system instruction handles questions that stray off topic.
        const deltas = chatStream(
            cachedSystem(SYSTEM_INSTRUCTION, buildReference(siteCorpus())),
            [...buildHistory(messages), { role: "user", content: question }],
            { maxTokens: MAX_ANSWER_TOKENS, signal: request.signal }
        );
        // The stream connects lazily; pull the first delta here so a missing
        // key or unreachable API becomes a clean 503, not a half-open stream.
        const first = await deltas.next();

        const sources = pickSources(question);

        const encoder = new TextEncoder();
        let full = "";

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    if (!first.done && first.value) {
                        full += first.value;
                        controller.enqueue(encoder.encode(first.value));
                    }
                    for await (const text of deltas) {
                        full += text;
                        controller.enqueue(encoder.encode(text));
                    }
                    // A declined or empty answer would otherwise render as a
                    // blank bubble.
                    if (!full.trim()) {
                        controller.enqueue(encoder.encode(EMPTY_ANSWER));
                    }
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
            console.error("[chat] Claude unavailable:", error.message);
            return refuse(503, UNAVAILABLE);
        }
        console.error("[chat] error:", error);
        return refuse(500, "Sorry — something went wrong. Please try again.");
    }
}

export async function GET() {
    return NextResponse.json({ conversationLimit: CONVERSATION_LIMIT });
}
