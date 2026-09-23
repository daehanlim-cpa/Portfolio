import { NextResponse } from "next/server";
import { cachedSystem, chatJson } from "@/lib/llm";
import { siteCorpus } from "@/lib/corpus";
import { buildReference } from "@/lib/prompt";
import {
    FOLLOW_UP_SCHEMA,
    FOLLOW_UP_SYSTEM_INSTRUCTION,
    MAX_FOLLOW_UPS,
    buildFollowUpPrompt,
    parseFollowUps,
} from "@/lib/followups";
import { checkFollowupLimits, isBlocked } from "@/lib/ratelimit";
import { clientIp, isAllowedOrigin, sanitizeHistory, validateBody } from "@/lib/guardrails";
import { LEAK_MARKERS, redact, screen } from "@/lib/safety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

    // Everything below goes into a prompt, and all of it came from the browser.
    // Suggestions are decorative, so anything suspicious just gets none.
    const ip = clientIp(request);
    if (await isBlocked(ip)) return none();
    if (screen(question) || screen(last.content) === "injection") return none();
    if (LEAK_MARKERS.some((marker) => last.content.includes(marker))) return none();

    const withinQuota = await checkFollowupLimits(ip);
    if (!withinQuota) return none();

    const asked = sanitizeHistory(messages)
        .filter((message) => message.role === "user")
        .map((message) => message.content.trim())
        .slice(-MAX_ASKED_REPLAYED);

    try {
        // Same cached site content as the chat, so suggestions stay answerable
        // and the reference is read from cache rather than paid for again.
        const raw = await chatJson(
            cachedSystem(FOLLOW_UP_SYSTEM_INSTRUCTION, buildReference(siteCorpus())),
            [
                {
                    role: "user",
                    content: buildFollowUpPrompt({
                        question: redact(question),
                        answer: redact(last.content.slice(0, ANSWER_EXCERPT_CHARS)),
                        asked,
                    }),
                },
            ],
            FOLLOW_UP_SCHEMA,
            { maxTokens: 512, signal: request.signal }
        );

        const followUps = parseFollowUps(raw, asked);
        return NextResponse.json(
            { followUps: followUps.slice(0, MAX_FOLLOW_UPS) },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (error) {
        console.error("[followups] error:", error);
        return none();
    }
}
