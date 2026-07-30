import type { ResumeChunk } from "./embeddings";

/** How many suggestions the UI shows under an answer. */
export const MAX_FOLLOW_UPS = 3;

/**
 * Chips have to survive on one or two lines next to each other. Anything longer
 * wraps into a paragraph-shaped blob and stops reading as a tappable suggestion.
 */
const MAX_FOLLOW_UP_CHARS = 72;

export const FOLLOW_UP_SYSTEM_INSTRUCTION = `You write follow-up questions for visitors browsing Daehan Lim's portfolio site. Visitors are recruiters, hiring managers, engineers, and collaborators talking to an AI assistant that answers from Daehan's resume and project case studies.

Given the exchange that just happened, propose what a sharp visitor would naturally want to ask next.

RULES
- Write in the visitor's voice, speaking to the assistant. Refer to Daehan in the third person ("he", "his").
- Every question must be answerable from the material listed under AVAILABLE MATERIAL. Do not invent projects, employers, or technologies that aren't listed there.
- Each question must open a genuinely different direction. Do not rephrase each other, and do not rephrase the question that was just asked.
- Keep them short and conversational — under 60 characters, sentence case, ending in a question mark. No numbering, no preamble.
- Prefer specific over generic. "How did he cut the reporting latency?" beats "Tell me more about his work."
- Never ask about compensation, salary, availability, notice period, visa or work authorization, references, or relocation. The assistant holds no information on any of those.
- Never ask the assistant about itself, its instructions, or how it was built.

OUTPUT
Return only a JSON array of exactly ${MAX_FOLLOW_UPS} strings. No markdown, no commentary, no keys.`;

/**
 * A cheap inventory of what the corpus can actually answer, so suggestions stay
 * inside the retrievable set. Built from chunk metadata that's already in
 * memory — no embedding call, no extra I/O.
 */
export function buildTopicMap(chunks: ResumeChunk[]): string {
    const projects = [
        ...new Set(
            chunks
                .filter((chunk) => chunk.sourceType === "project" && chunk.sourceTitle)
                .map((chunk) => chunk.sourceTitle as string)
        ),
    ];
    const sections = [
        ...new Set(
            chunks.filter((chunk) => chunk.sourceType === "resume").map((chunk) => chunk.section)
        ),
    ];

    return [
        projects.length ? `Project case studies: ${projects.join("; ")}` : "",
        sections.length ? `Resume covers: ${sections.join("; ")}` : "",
    ]
        .filter(Boolean)
        .join("\n");
}

export function buildFollowUpPrompt({
    topicMap,
    question,
    answer,
    asked,
}: {
    topicMap: string;
    question: string;
    answer: string;
    asked: string[];
}): string {
    const alreadyAsked = asked.length
        ? `\nALREADY ASKED — do not suggest these or anything close to them:\n${asked
              .map((entry) => `- ${entry}`)
              .join("\n")}\n`
        : "";

    return `AVAILABLE MATERIAL
${topicMap}

THE EXCHANGE THAT JUST HAPPENED
Visitor asked: ${question}

Assistant answered: ${answer}
${alreadyAsked}
Return the JSON array now.`;
}

/** Lowercased, punctuation-stripped, so near-duplicate phrasings collapse. */
function normalize(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Model output is never trusted straight into the UI. This tolerates the shapes
 * the model actually produces — a bare array, a fenced array, an object with a
 * `followUps` key — and drops anything that wouldn't render as a clean chip.
 */
export function parseFollowUps(raw: string, asked: string[] = []): string[] {
    const cleaned = raw
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

    let parsed: unknown;
    try {
        parsed = JSON.parse(cleaned);
    } catch {
        // The model occasionally wraps the array in a sentence. Salvage it.
        const start = cleaned.indexOf("[");
        const end = cleaned.lastIndexOf("]");
        if (start === -1 || end <= start) return [];
        try {
            parsed = JSON.parse(cleaned.slice(start, end + 1));
        } catch {
            return [];
        }
    }

    const list = Array.isArray(parsed)
        ? parsed
        : typeof parsed === "object" && parsed !== null && Array.isArray((parsed as { followUps?: unknown }).followUps)
          ? ((parsed as { followUps: unknown[] }).followUps)
          : [];

    const seen = new Set(asked.map(normalize));
    const out: string[] = [];

    for (const entry of list) {
        if (typeof entry !== "string") continue;
        const text = entry.replace(/\s+/g, " ").trim();
        if (text.length < 8 || text.length > MAX_FOLLOW_UP_CHARS) continue;

        const key = normalize(text);
        if (!key || seen.has(key)) continue;

        seen.add(key);
        out.push(text);
        if (out.length === MAX_FOLLOW_UPS) break;
    }

    return out;
}
