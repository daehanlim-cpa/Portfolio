import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadEmbeddings } from "@/lib/embeddings";
import { CHAT_MODEL } from "@/lib/models";
import {
    FOLLOW_UP_SYSTEM_INSTRUCTION,
    MAX_FOLLOW_UPS,
    buildFollowUpPrompt,
    buildTopicMap,
    parseFollowUps,
} from "@/lib/followups";
import { checkFollowupLimits } from "@/lib/ratelimit";
import { clientIp, isAllowedOrigin, validateBody } from "@/lib/guardrails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** How much of the answer the suggester needs. Enough for topic, not the essay. */
const ANSWER_EXCERPT_CHARS = 1200;
/** Only the most recent questions matter for avoiding repeats. */
const MAX_ASKED_REPLAYED = 8;

/**
 * These suggestions are decorative: the chat works perfectly well without them
 * and the client falls back to a static list. So every failure path here is a
 * quiet empty array rather than an error the UI has to reason about.
 */
function none() {
    return NextResponse.json({ followUps: [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
    if (!isAllowedOrigin(request)) {
        return NextResponse.json(
            { followUps: [] },
            { status: 403, headers: { "Cache-Control": "no-store" } }
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return none();
    }

    const validated = validateBody(body);
    if (!validated.ok) return none();

    const { messages, question } = validated;

    // Suggestions only make sense once there's an answer to follow on from.
    const last = messages[messages.length - 1];
    if (last?.role !== "assistant" || !last.content.trim()) return none();

    if (!process.env.GOOGLE_API_KEY) return none();

    const withinQuota = await checkFollowupLimits(clientIp(request));
    if (!withinQuota) return none();

    const asked = messages
        .filter((message) => message.role === "user")
        .map((message) => message.content.trim())
        .slice(-MAX_ASKED_REPLAYED);

    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({
            model: CHAT_MODEL,
            systemInstruction: FOLLOW_UP_SYSTEM_INSTRUCTION,
        });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: buildFollowUpPrompt({
                                topicMap: buildTopicMap(loadEmbeddings()),
                                question,
                                answer: last.content.slice(0, ANSWER_EXCERPT_CHARS),
                                asked,
                            }),
                        },
                    ],
                },
            ],
            generationConfig: {
                // Higher than the chat's 0.45 on purpose: identical suggestions
                // turn after turn defeat the point of generating them at all.
                temperature: 0.9,
                maxOutputTokens: 256,
                responseMimeType: "application/json",
            },
        });

        const followUps = parseFollowUps(result.response.text(), asked);
        return NextResponse.json(
            { followUps: followUps.slice(0, MAX_FOLLOW_UPS) },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("[followups] error:", error);
        return none();
    }
}
