import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadEmbeddings, searchChunks } from "@/lib/embeddings";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const SYSTEM_PROMPT = `You are a helpful assistant that answers questions about Daehan Lim's resume and professional background.

CRITICAL RULES:
1. ONLY use information from the provided resume context
2. DO NOT invent or hallucinate facts
3. If the answer is not in the resume, say "I don't see that information in the resume"
4. Keep answers concise and bullet-pointed unless asked to expand
5. When discussing experience, cite specific companies and roles
6. Be professional and factual

You have access to Daehan's resume content. Answer questions accurately based only on what's provided.`;

interface Message {
    role: "user" | "assistant";
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        const { messages }: { messages: Message[] } = await request.json();

        if (!messages || messages.length === 0) {
            return NextResponse.json({ error: "No messages provided" }, { status: 400 });
        }

        const lastUserMessage = messages.filter((m) => m.role === "user").pop();
        if (!lastUserMessage) {
            return NextResponse.json({ error: "No user message found" }, { status: 400 });
        }

        // Load pre-computed embeddings
        const resumeChunks = loadEmbeddings();

        if (resumeChunks.length === 0) {
            return NextResponse.json(
                {
                    reply:
                        "I'm sorry, but the resume data isn't available right now. Please make sure the embeddings are generated.",
                },
                { status: 200 }
            );
        }

        // Generate embedding for the user's question using Gemini
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const embeddingResult = await embeddingModel.embedContent(lastUserMessage.content);
        const queryEmbedding = embeddingResult.embedding.values;

        // Search for relevant chunks
        const relevantChunks = searchChunks(queryEmbedding, resumeChunks, 6);

        // Build context from relevant chunks
        const context = relevantChunks.map((chunk) => chunk.text).join("\n\n");

        // Create chat with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        // Build conversation history
        const conversationHistory = messages.slice(0, -1).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }],
        }));

        const chat = model.startChat({
            history: conversationHistory,
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 500,
            },
        });

        const prompt = `${SYSTEM_PROMPT}

Resume Context:
${context}

User Question: ${lastUserMessage.content}`;

        const result = await chat.sendMessage(prompt);
        const reply = result.response.text() || "I couldn't generate a response.";

        return NextResponse.json({
            reply,
            sources: relevantChunks.map((chunk) => ({
                text: chunk.text.substring(0, 150) + "...",
                section: chunk.section,
            })),
        });
    } catch (error: any) {
        console.error("Resume chat error:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred" },
            { status: 500 }
        );
    }
}
