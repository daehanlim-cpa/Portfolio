import { NextResponse } from "next/server";
import { loadIndex, searchChunks } from "@/lib/embeddings";
import { LlmUnavailableError, chatStream, embed, type LlmMessage } from "@/lib/llm";
import { EMBEDDING_MODEL } from "@/lib/models";
import { SYSTEM_INSTRUCTION, buildContextBlock, buildTurnPrompt } from "@/lib/prompt";
import { checkLimits, logTranscript, CONVERSATION_LIMIT } from "@/lib/ratelimit";
import {
    GREETING_REPLY,
    MAX_REPLAYED_TURNS,
    OFF_TOPIC_REPLY,
    clientIp,
    isAllowedOrigin,
    isGreeting,
    limitMessage,
    topicVerdict,
    validateBody,
    type ChatMessage,
} from "@/lib/guardrails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/**
 * Headroom for a local model: the first request after it's been unloaded pays
 * a cold load before the first token, and a long answer streams for a while.
 */
export const maxDuration = 60;

const UNAVAILABLE = "The assistant isn't available right now. You can reach Daehan directly at daehanlim1@gmail.com.";

type ChatStatus = "ok" | "greeting" | "off_topic";

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

    // Vectors from a different embedding model would still produce scores —
    // just meaningless ones. Refuse rather than answer from the wrong context.
    const index = loadIndex();
    if (index.chunks.length === 0 || index.model !== EMBEDDING_MODEL) {
        console.error(
            `[chat] embeddings.json was built with "${index.model}" but "${EMBEDDING_MODEL}" is configured - run \`npm run build:embeddings\``
        );
        return refuse(503, UNAVAILABLE);
    }
    const chunks = index.chunks;

    try {
        // 5. One embedding call. This is all an off-topic question ever costs.
        const [queryVector] = await embed([question], "query");
        const results = searchChunks(queryVector, chunks, 8);
        const verdict = topicVerdict(results);

        if (verdict === "off_topic") {
            console.log(
                `[chat] off-topic (top score ${results[0]?.score.toFixed(3) ?? "n/a"}) - no generation call`
            );
            await logTranscript(sessionId, {
                question,
                answer: OFF_TOPIC_REPLY,
                blocked: "off_topic",
            });
            return textStream(OFF_TOPIC_REPLY, "off_topic", limits.conversationRemaining);
        }

        // 6. Only now do we spend a generation call. The generator connects
        // lazily, so pull the first delta here: an unreachable model server
        // then becomes a clean 503 instead of a broken half-open stream.
        const deltas = chatStream(
            [
                { role: "system", content: SYSTEM_INSTRUCTION },
                ...buildHistory(messages),
                {
                    role: "user",
                    content: buildTurnPrompt(buildContextBlock(results), question, verdict === "thin"),
                },
            ],
            // Low enough to stay factual, high enough to converse rather than recite.
            { temperature: 0.45, maxTokens: 1536, signal: request.signal }
        );
        const first = await deltas.next();

        const sources = results
            .filter(({ chunk }) => chunk.sourceType === "project" && chunk.sourceId)
            .slice(0, 3)
            .map(({ chunk }) => ({
                title: chunk.sourceTitle ?? chunk.section,
                href: `/project/${chunk.sourceId}`,
            }));

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
            console.error("[chat] model server unavailable:", error.message);
            return refuse(503, UNAVAILABLE);
        }
        console.error("[chat] error:", error);
        return refuse(500, "Sorry — something went wrong. Please try again.");
    }
}

export async function GET() {
    return NextResponse.json({ conversationLimit: CONVERSATION_LIMIT });
}
