import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { chunkText, type ResumeChunk } from "../lib/embeddings";
import { projects } from "../data/projects";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const EMBEDDING_MODEL = process.env.RESUME_EMBEDDING_MODEL || "text-embedding-004";

/** Keeps the committed JSON to a sane size without hurting cosine similarity. */
const FLOAT_PRECISION = 6;

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
 * ("does he have streaming experience?"), so the tech stack and categories are
 * inlined rather than left as bare metadata the embedding can't see.
 */
function projectToText(project: (typeof projects)[number]): string {
    const parts: string[] = [
        `Project: ${project.title} (${project.code})`,
        `Type: ${project.type}`,
        `Focus areas: ${project.categories.join(", ")}`,
        `Technologies: ${project.techStack.join(", ")}`,
        project.shortDescription,
    ];

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
        pending.push({
            text: chunk,
            section: extractSection(chunk),
            sourceType: "resume",
        });
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

async function generateEmbeddings() {
    if (!process.env.GOOGLE_API_KEY) {
        console.error("GOOGLE_API_KEY is not set. See SETUP_API_KEY.md.");
        process.exit(1);
    }

    const pending = collectChunks();
    const resumeCount = pending.filter((c) => c.sourceType === "resume").length;
    const projectCount = pending.filter((c) => c.sourceType === "project").length;
    console.log(`Collected ${pending.length} chunks (${resumeCount} resume, ${projectCount} project)`);

    const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
    const out: ResumeChunk[] = [];

    for (let i = 0; i < pending.length; i++) {
        const chunk = pending[i];
        process.stdout.write(`Embedding ${i + 1}/${pending.length} (${chunk.section})\r`);

        const result = await model.embedContent(chunk.text);

        out.push({
            ...chunk,
            embedding: round(Array.from(result.embedding.values)),
        });

        // Stay well inside the free-tier request rate.
        if (i < pending.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
    }

    const outputPath = path.join(process.cwd(), "data", "embeddings.json");
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(out));

    const sizeKb = (fs.statSync(outputPath).size / 1024).toFixed(0);
    console.log(`\nSaved ${out.length} embeddings to ${outputPath} (${sizeKb} KB)`);
}

generateEmbeddings().catch((error) => {
    console.error("\nFailed to build embeddings:", error);
    process.exit(1);
});
