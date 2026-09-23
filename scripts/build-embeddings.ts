/**
 * Builds data/embeddings.json from content/resume.md and data/projects.ts using
 * the Ollama embedding model, then measures the topic-gate thresholds against
 * the new index and stores them alongside it.
 *
 * Run on the machine that runs Ollama (or anywhere OLLAMA_BASE_URL points):
 *   npm run build:embeddings
 */
import fs from "fs";
import path from "path";
import { chunkText, type EmbeddingIndex } from "../lib/embeddings";
import { embed } from "../lib/llm";
import { EMBEDDING_MODEL } from "../lib/models";
import { TOPIC_PROBES, calibrate } from "../lib/topic-probes";
import { projects } from "../data/projects";

/** Keeps the committed JSON to a sane size without hurting cosine similarity. */
const FLOAT_PRECISION = 6;

/** Chunks per request. Ollama embeds a batch in one pass. */
const BATCH_SIZE = 16;

interface PendingChunk {
    text: string;
    section: string;
    sourceType: "resume" | "project";
    sourceId?: string;
    sourceTitle?: string;
}

function loadResumeContent(): string {
    return fs.readFileSync(path.join(process.cwd(), "content", "resume.md"), "utf-8");
}

function extractSection(text: string): string {
    for (const line of text.split("\n")) {
        if (line.startsWith("#")) {
            return line.replace(/^#+\s*/, "").trim();
        }
    }
    return "General";
}

/**
 * Flattens a project case study into prose. Recruiters ask role-shaped questions
 * ("does he have streaming experience?"), so the tech stack, categories and
 * headline metrics are inlined rather than left as metadata the embedding can't see.
 */
function projectToText(project: (typeof projects)[number]): string {
    const parts: string[] = [
        `Project: ${project.title} (${project.code})`,
        `Type: ${project.type}`,
        `Focus areas: ${project.categories.join(", ")}`,
        `Technologies: ${project.techStack.join(", ")}`,
        project.shortDescription,
    ];

    if (project.metrics.length)
        parts.push(`Key figures:\n- ${project.metrics.map((m) => `${m.value}: ${m.label}`).join("\n- ")}`);
    if (project.metricsNote) parts.push(`Note on figures: ${project.metricsNote}`);
    if (project.overview) parts.push(`Overview: ${project.overview}`);
    if (project.problem?.length) parts.push(`Problem:\n- ${project.problem.join("\n- ")}`);
    if (project.solution) parts.push(`Solution: ${project.solution}`);
    if (project.keyCapabilities?.length)
        parts.push(`Key capabilities:\n- ${project.keyCapabilities.join("\n- ")}`);
    if (project.approach?.length) parts.push(`Approach:\n- ${project.approach.join("\n- ")}`);
    if (project.impact?.length) parts.push(`Impact:\n- ${project.impact.join("\n- ")}`);
    if (project.governance?.length) parts.push(`Governance:\n- ${project.governance.join("\n- ")}`);

    return parts.filter(Boolean).join("\n\n");
}

function collectChunks(): PendingChunk[] {
    const pending: PendingChunk[] = [];

    for (const chunk of chunkText(loadResumeContent(), 500)) {
        pending.push({ text: chunk, section: extractSection(chunk), sourceType: "resume" });
    }

    for (const project of projects) {
        pending.push({
            text: projectToText(project),
            section: project.title,
            sourceType: "project",
            sourceId: project.id,
            sourceTitle: project.title,
        });
    }

    return pending;
}

function round(values: number[]): number[] {
    const factor = 10 ** FLOAT_PRECISION;
    return values.map((v) => Math.round(v * factor) / factor);
}

async function main() {
    const pending = collectChunks();
    const resumeCount = pending.filter((c) => c.sourceType === "resume").length;
    console.log(
        `Embedding ${pending.length} chunks (${resumeCount} resume, ${pending.length - resumeCount} project) with ${EMBEDDING_MODEL}`
    );

    const vectors: number[][] = [];
    for (let i = 0; i < pending.length; i += BATCH_SIZE) {
        const batch = pending.slice(i, i + BATCH_SIZE);
        vectors.push(...(await embed(batch.map((c) => c.text), "document")));
        process.stdout.write(`  ${Math.min(i + BATCH_SIZE, pending.length)}/${pending.length}\r`);
    }

    const chunks = pending.map((chunk, i) => ({ ...chunk, embedding: round(vectors[i]) }));

    // Measure the gate against exactly this index, with the same query-side
    // embedding the chat route will use.
    const probeVectors = await embed(TOPIC_PROBES.map(([, q]) => q), "query");
    const calibration = calibrate(probeVectors, chunks);

    const index: EmbeddingIndex = {
        model: EMBEDDING_MODEL,
        dimensions: chunks[0]?.embedding.length ?? 0,
        createdAt: new Date().toISOString(),
        thresholds: calibration.thresholds,
        chunks,
    };

    const outputPath = path.join(process.cwd(), "data", "embeddings.json");
    fs.writeFileSync(outputPath, JSON.stringify(index));

    const sizeKb = (fs.statSync(outputPath).size / 1024).toFixed(0);
    console.log(`\nSaved ${chunks.length} chunks (${index.dimensions}d) to data/embeddings.json (${sizeKb} KB)`);
    console.log("\nTopic gate, measured on this index:");
    for (const [label, band] of Object.entries(calibration.bands)) {
        console.log(`  ${label.padEnd(10)} ${band.min.toFixed(3)} – ${band.max.toFixed(3)}`);
    }
    console.log(
        `  → confident ≥ ${calibration.thresholds.confident}, refused < ${calibration.thresholds.floor}`
    );
    const leaking = calibration.scores.filter((s) => s.label === "unrelated" && s.score >= calibration.thresholds.floor);
    if (leaking.length) {
        console.log(`  ${leaking.length} unrelated probe(s) reach the model; the system instruction handles those.`);
    }
    console.log("\nCommit data/embeddings.json to deploy it.");
}

main().catch((error) => {
    console.error("\nFailed to build embeddings:", error instanceof Error ? error.message : error);
    console.error("Is Ollama running, and have you pulled the model? See SETUP_OLLAMA.md.");
    process.exit(1);
});
