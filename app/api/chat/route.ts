import { NextResponse } from "next/server";
import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import {
    loadEmbeddings,
    searchChunks,
    type EmbedRequestWithDimensions,
} from "@/lib/embeddings";
import { CHAT_MODEL, EMBEDDING_DIMENSIONS, EMBEDDING_MODEL } from "@/lib/models";
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

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

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

/** Gemini requires history to begin with a user turn. */
function buildHistory(messages: ChatMessage[]) {
    const prior = messages.slice(0, -1).slice(-MAX_REPLAYED_TURNS);
    while (prior.length && prior[0].role !== "user") prior.shift();
    return prior.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
    }));
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

    if (!process.env.GOOGLE_API_KEY) {
        console.error("[chat] GOOGLE_API_KEY is not configured");
        return refuse(
            503,
            "The assistant isn't available right now. You can reach Daehan directly at daehanlim1@gmail.com."
        );
    }

    const chunks = loadEmbeddings();
    if (chunks.length === 0) {
        console.error("[chat] embeddings.json is empty - run `npm run build:embeddings`");
        return refuse(
            503,
            "The assistant isn't available right now. You can reach Daehan directly at daehanlim1@gmail.com."
        );
    }

    try {
        // 5. One embedding call. This is all an off-topic question ever costs.
        const embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
        const embedded = await embeddingModel.embedContent({
            content: { role: "user", parts: [{ text: question }] },
            taskType: TaskType.RETRIEVAL_QUERY,
            outputDimensionality: EMBEDDING_DIMENSIONS,
        } satisfies EmbedRequestWithDimensions as unknown as Parameters<
            typeof embeddingModel.embedContent
        >[0]);
        const results = searchChunks(embedded.embedding.values, chunks, 8);
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

        // 6. Only now do we spend a generation call.
        const model = genAI.getGenerativeModel({
            model: CHAT_MODEL,
            systemInstruction: SYSTEM_INSTRUCTION,
        });

        const result = await model.generateContentStream({
            contents: [
                ...buildHistory(messages),
                {
                    role: "user",
                    parts: [
                        {
                            text: buildTurnPrompt(
                                buildContextBlock(results),
                                question,
                                verdict === "thin"
                            ),
                        },
                    ],
                },
            ],
            generationConfig: {
                // Raised from 0.2: the assistant is meant to converse now, not
                // just extract. Still low enough to keep it factual.
                temperature: 0.45,
                maxOutputTokens: 1536,
            },
        });

        const sources = results
            .filter(
                ({ chunk }) =>
                    (chunk.sourceType === "project" || chunk.sourceType === "ai-app") && chunk.sourceId
            )
            .slice(0, 3)
            .map(({ chunk }) => ({
                title: chunk.sourceTitle ?? chunk.section,
                href:
                    chunk.sourceType === "ai-app"
                        ? `/ai/${chunk.sourceId}`
                        : `/project/${chunk.sourceId}`,
            }));

        const encoder = new TextEncoder();
        let full = "";

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        if (!text) continue;
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
        console.error("[chat] error:", error);
        return refuse(500, "Sorry — something went wrong. Please try again.");
    }
}

export async function GET() {
    return NextResponse.json({ conversationLimit: CONVERSATION_LIMIT });
}
