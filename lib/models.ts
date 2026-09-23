/**
 * Model names, in one place because both API routes and both scripts depend on
 * them. These are Ollama model tags: pull each on the model server first
 * (`ollama pull <tag>`). See SETUP_OLLAMA.md for sizing by machine memory.
 */

/**
 * Chat model. qwen2.5:7b is the default because it follows long system
 * instructions and JSON schemas reliably, and runs comfortably on a 16 GB Mac
 * mini. With more memory, a larger model (e.g. gemma3:12b) answers better.
 */
export const CHAT_MODEL = process.env.RESUME_CHAT_MODEL || "qwen2.5:7b";

/**
 * Embedding model. nomic-embed-text is small, fast, and trained with separate
 * query/document prefixes (applied in lib/llm.ts). Changing it invalidates
 * data/embeddings.json — rebuild with `npm run build:embeddings`.
 */
export const EMBEDDING_MODEL = process.env.RESUME_EMBEDDING_MODEL || "nomic-embed-text";
