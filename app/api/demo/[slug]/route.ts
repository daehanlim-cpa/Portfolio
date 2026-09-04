import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CHAT_MODEL } from "@/lib/models";
import { clientIp, isAllowedOrigin } from "@/lib/guardrails";
import { checkDemoLimits } from "@/lib/ratelimit";
import { getDemo } from "@/lib/demos/registry";
import type { DemoEvent } from "@/lib/demos/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

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

/**
 * Gemini honours responseMimeType, but a model asked for JSON still occasionally
 * wraps it in a fence. Recovering from that is cheaper than failing the run, and
 * a parse failure is not fatal either — `toVerdict` applies domain defaults to
 * whatever it receives, so the deterministic findings still reach the visitor.
 */
function parseJsonLoosely(raw: string): unknown {
    const cleaned = raw
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```$/, "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start !== -1 && end > start) {
            try {
                return JSON.parse(cleaned.slice(start, end + 1));
            } catch {
                return null;
            }
        }
        return null;
    }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    if (!isAllowedOrigin(request)) {
        return refuse(403, "Requests must originate from the site.");
    }

    const { slug } = await params;
    const demo = getDemo(slug);
    if (!demo) return refuse(404, "Unknown demo.");

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return refuse(400, "Malformed request.");
    }

    /*
     * The only accepted input is the id of a curated fixture. No free text ever
     * reaches a prompt from this route, which means there is no injection surface
     * and no way to inflate the token cost of a run. It also means nobody can
     * paste real customer or patient data into a public demo.
     */
    const caseId = typeof (body as { caseId?: unknown })?.caseId === "string"
        ? (body as { caseId: string }).caseId
        : null;
    if (!caseId || !demo.cases.some((c) => c.id === caseId)) {
        return refuse(400, "Unknown case.");
    }

    const limits = await checkDemoLimits(clientIp(request));
    if (!limits.ok) {
        return refuse(
            429,
            "Demo runs are limited to keep this affordable to host. Try again shortly.",
            limits.retryAfterSeconds
        );
    }

    const result = demo.prepare(caseId);
    if (!result) return refuse(400, "Unknown case.");

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: DemoEvent) => {
                controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
            };

            try {
                // The deterministic layer. Milliseconds, and it runs whether or
                // not a model is reachable — which is the point of doing it first.
                for (const stage of result.stages) {
                    send({ type: "stage", stage });
                }
                send({ type: "audit", entries: result.modelInputs });

                if (!process.env.GOOGLE_API_KEY) {
                    console.error("[demo] GOOGLE_API_KEY is not configured");
                    send({
                        type: "error",
                        message:
                            "The model layer isn't configured on this deployment, so the reasoning and drafting stages were skipped. Every finding above is the deterministic pipeline, which runs without it.",
                    });
                    send({ type: "done" });
                    return;
                }

                // Stage 5 — reasoning, constrained to JSON.
                const reasoningModel = genAI.getGenerativeModel({
                    model: CHAT_MODEL,
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 900,
                        responseMimeType: "application/json",
                    },
                });

                const reasoning = await reasoningModel.generateContent(
                    demo.buildReasoningPrompt(result)
                );
                const verdict = demo.toVerdict(parseJsonLoosely(reasoning.response.text()), result);

                send({
                    type: "stage",
                    stage: {
                        id: "reason",
                        label: "Disposition reasoning",
                        kind: "model",
                        detail: `${verdict.decision} — ${(verdict.confidence * 100).toFixed(0)}% stated confidence.`,
                        facts: verdict.rationale,
                    },
                });
                send({ type: "verdict", verdict });

                // Stage 6 — drafting, streamed so the page fills as it writes.
                const draftModel = genAI.getGenerativeModel({
                    model: CHAT_MODEL,
                    generationConfig: { temperature: 0.4, maxOutputTokens: 1200 },
                });

                send({ type: "draft_start", title: demo.draftTitle(verdict) });

                const draft = await draftModel.generateContentStream(
                    demo.buildDraftPrompt(result, verdict)
                );

                let drafted = "";
                for await (const chunk of draft.stream) {
                    const text = chunk.text();
                    if (!text) continue;
                    drafted += text;
                    send({ type: "draft_delta", text });
                }

                send({
                    type: "stage",
                    stage: {
                        id: "draft",
                        label: "Document drafting",
                        kind: "model",
                        detail: `${drafted.trim().split(/\s+/).length} words generated.`,
                    },
                });

                send({ type: "done" });
            } catch (error) {
                console.error("[demo] run failed:", error);
                send({
                    type: "error",
                    message: "The model call failed partway through. The deterministic findings above still stand.",
                });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        status: 200,
        headers: {
            "Content-Type": "application/x-ndjson; charset=utf-8",
            "Cache-Control": "no-store",
        },
    });
}
