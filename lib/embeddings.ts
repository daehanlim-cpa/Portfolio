import fs from "fs";
import path from "path";

export interface ResumeChunk {
    text: string;
    embedding: number[];
    section: string;
}

export function loadResumeContent(): string {
    const resumePath = path.join(process.cwd(), "content", "resume.md");
    return fs.readFileSync(resumePath, "utf-8");
}

export function chunkText(text: string, maxTokens: number = 500): string[] {
    // Simple chunking by paragraphs and sections
    const sections = text.split(/\n#{1,3}\s+/);
    const chunks: string[] = [];

    for (const section of sections) {
        const paragraphs = section.split(/\n\n+/);
        let currentChunk = "";

        for (const paragraph of paragraphs) {
            const estimatedTokens = (currentChunk + paragraph).split(/\s+/).length;

            if (estimatedTokens > maxTokens && currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = paragraph;
            } else {
                currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }
    }

    return chunks.filter((chunk) => chunk.length > 50);
}

export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        magnitudeA += a[i] * a[i];
        magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    return dotProduct / (magnitudeA * magnitudeB);
}

export function searchChunks(
    query: number[],
    chunks: ResumeChunk[],
    topK: number = 5
): ResumeChunk[] {
    const scored = chunks.map((chunk) => ({
        chunk,
        score: cosineSimilarity(query, chunk.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map((item) => item.chunk);
}

export function loadEmbeddings(): ResumeChunk[] {
    try {
        const embeddingsPath = path.join(process.cwd(), "data", "embeddings.json");
        const data = fs.readFileSync(embeddingsPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to load embeddings:", error);
        return [];
    }
}
