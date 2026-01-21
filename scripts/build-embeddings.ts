import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { chunkText, loadResumeContent } from "../lib/embeddings";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

interface ResumeChunk {
    text: string;
    embedding: number[];
    section: string;
}

async function extractSection(text: string): Promise<string> {
    const lines = text.split("\n");
    for (const line of lines) {
        if (line.startsWith("#")) {
            return line.replace(/^#+\s*/, "").trim();
        }
    }
    return "General";
}

async function generateEmbeddings() {
    console.log("Loading resume content...");
    const resumeContent = loadResumeContent();

    console.log("Chunking text...");
    const chunks = chunkText(resumeContent, 500);
    console.log(`Created ${chunks.length} chunks`);

    const resumeChunks: ResumeChunk[] = [];
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`Processing chunk ${i + 1}/${chunks.length}...`);

        const section = await extractSection(chunk);

        // Generate embedding with Gemini
        const result = await model.embedContent(chunk);
        const embedding = result.embedding.values;

        resumeChunks.push({
            text: chunk,
            embedding: Array.from(embedding),
            section,
        });

        // Rate limiting - wait a bit between requests
        if (i < chunks.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
    }

    // Save embeddings
    const outputPath = path.join(process.cwd(), "data", "embeddings.json");
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(resumeChunks, null, 2));
    console.log(`Saved ${resumeChunks.length} embeddings to ${outputPath}`);
}

generateEmbeddings().catch(console.error);
