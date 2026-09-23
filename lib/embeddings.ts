import embeddingsData from "@/data/embeddings.json";

export interface ResumeChunk {
    text: string;
    embedding: number[];
    section: string;
    /** Where this chunk came from, so answers can cite and deep-link. */
    sourceType: "resume" | "project";
    /** Project id, used to build a /project/[id] link. Absent for resume chunks. */
    sourceId?: string;
    sourceTitle?: string;
}

export interface ScoredChunk {
    chunk: ResumeChunk;
    score: number;
}

/**
 * The committed retrieval index. It records which embedding model produced it,
 * because vectors from different models are not comparable — and a mismatch
 * doesn't fail loudly, it just returns meaningless similarity scores. It also
 * carries the topic-gate thresholds measured against this exact index.
 */
export interface EmbeddingIndex {
    model: string;
    dimensions: number;
    createdAt: string;
    thresholds?: { confident: number; floor: number };
    chunks: ResumeChunk[];
}

/**
 * Splits markdown into chunks that stay under roughly `maxTokens` words.
 * Pure — the build script owns reading the file off disk.
 */
export function chunkText(text: string, maxTokens: number = 500): string[] {
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

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Returns the top matches with their similarity scores. The scores matter as
 * much as the chunks — the topic gate uses the best score to decide whether a
 * question is about Daehan at all, before we spend anything on generation.
 */
export function searchChunks(
    query: number[],
    chunks: ResumeChunk[],
    topK: number = 6
): ScoredChunk[] {
    const scored = chunks.map((chunk) => ({
        chunk,
        score: cosineSimilarity(query, chunk.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
}

/**
 * Statically imported so the bundler always traces it into the serverless
 * function. `data/embeddings.json` is committed, so production never needs to
 * reach the embedding model to load it — only to embed each question.
 *
 * Indexes written before the switch to Ollama were a bare array of Gemini
 * vectors; they load as such so the model check can reject them by name.
 */
export function loadIndex(): EmbeddingIndex {
    // Cast through unknown: TS widens the JSON module's literal types (e.g.
    // sourceType to string), which wouldn't otherwise overlap with ResumeChunk.
    const raw = embeddingsData as unknown;
    if (Array.isArray(raw)) {
        const chunks = raw as ResumeChunk[];
        return {
            model: "gemini-embedding-001",
            dimensions: chunks[0]?.embedding.length ?? 0,
            createdAt: "",
            chunks,
        };
    }
    return raw as EmbeddingIndex;
}

export function loadEmbeddings(): ResumeChunk[] {
    return loadIndex().chunks;
}
