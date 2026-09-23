/**
 * The one place that talks to the model server: an Ollama instance, normally
 * running on-prem on a Mac mini. Everything else in the app goes through the
 * three functions here, so switching host or model is configuration, not code.
 *
 * Uses Ollama's native API (/api/embed, /api/chat) rather than its OpenAI shim:
 * the native API exposes `options.num_ctx`, which this app cannot do without —
 * see NUM_CTX below.
 */

import { CHAT_MODEL, EMBEDDING_MODEL } from "./models";

export type LlmMessage = { role: "system" | "user" | "assistant"; content: string };

const BASE_URL = (process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434").replace(/\/+$/, "");

/** How long Ollama keeps a model in memory after a request. A cold load costs seconds. */
const KEEP_ALIVE = process.env.OLLAMA_KEEP_ALIVE || "30m";

/**
 * Context window. Ollama's default (2–4k tokens) is far too small here: the
 * system instruction plus eight retrieved case-study chunks runs to ~8k tokens,
 * and Ollama truncates overflow *from the front* — silently dropping the system
 * instruction, guardrails included. 16k leaves headroom for conversation history.
 */
const NUM_CTX = Number.parseInt(process.env.OLLAMA_NUM_CTX ?? "", 10) || 16384;

/**
 * Time allowed for the server to start responding. Generous because the first
 * request after the model is unloaded has to read it back into memory.
 */
const RESPONSE_TIMEOUT_MS = Number.parseInt(process.env.OLLAMA_TIMEOUT_MS ?? "", 10) || 45_000;

/**
 * Ollama has no authentication of its own. When it's reached over the internet
 * (a Cloudflare Tunnel from the hosted site to the Mac mini), the tunnel must
 * sit behind something that checks credentials. Both common shapes are
 * supported: a bearer token for a reverse proxy, or a Cloudflare Access
 * service token.
 */
function headers(): HeadersInit {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.OLLAMA_API_KEY) h.Authorization = `Bearer ${process.env.OLLAMA_API_KEY}`;
    if (process.env.CF_ACCESS_CLIENT_ID && process.env.CF_ACCESS_CLIENT_SECRET) {
        h["CF-Access-Client-Id"] = process.env.CF_ACCESS_CLIENT_ID;
        h["CF-Access-Client-Secret"] = process.env.CF_ACCESS_CLIENT_SECRET;
    }
    return h;
}

/**
 * Optional reasoning switch for models that think by default (qwen3 and
 * similar). Unset means "don't send the field", which is the only safe default
 * across model families.
 */
function thinkField(): { think?: boolean } {
    const raw = process.env.OLLAMA_THINK?.toLowerCase();
    if (raw === "true") return { think: true };
    if (raw === "false") return { think: false };
    return {};
}

export class LlmUnavailableError extends Error {}

/**
 * POST with a timeout that covers only the wait for response headers, so a
 * long streamed answer isn't cut off once it has started.
 */
async function post(path: string, body: unknown, signal?: AbortSignal): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), RESPONSE_TIMEOUT_MS);
    signal?.addEventListener("abort", () => controller.abort(), { once: true });

    let response: Response;
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method: "POST",
            headers: headers(),
            body: JSON.stringify(body),
            signal: controller.signal,
            cache: "no-store",
        });
    } catch (error) {
        throw new LlmUnavailableError(
            `Model server unreachable at ${BASE_URL}${path}: ${error instanceof Error ? error.message : error}`
        );
    } finally {
        clearTimeout(timer);
    }

    if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new LlmUnavailableError(`Model server returned ${response.status} for ${path}: ${detail.slice(0, 300)}`);
    }
    return response;
}

/**
 * Retrieval embedding models are trained with different instruction prefixes
 * for queries and documents; using them measurably improves ranking, which the
 * topic gate depends on. Unknown models get no prefix.
 */
function withPrefix(text: string, kind: "query" | "document"): string {
    const model = EMBEDDING_MODEL.toLowerCase();
    if (model.startsWith("nomic-embed-text")) {
        return `${kind === "query" ? "search_query" : "search_document"}: ${text}`;
    }
    if (model.startsWith("embeddinggemma")) {
        return kind === "query" ? `task: search result | query: ${text}` : `title: none | text: ${text}`;
    }
    if (model.startsWith("mxbai-embed-large") && kind === "query") {
        return `Represent this sentence for searching relevant passages: ${text}`;
    }
    return text;
}

export async function embed(texts: string[], kind: "query" | "document"): Promise<number[][]> {
    const response = await post("/api/embed", {
        model: EMBEDDING_MODEL,
        input: texts.map((text) => withPrefix(text, kind)),
        truncate: true,
        keep_alive: KEEP_ALIVE,
    });
    const data = (await response.json()) as { embeddings?: number[][] };
    if (!Array.isArray(data.embeddings) || data.embeddings.length !== texts.length) {
        throw new LlmUnavailableError("Model server returned no embeddings");
    }
    return data.embeddings;
}

interface GenerateOptions {
    temperature: number;
    maxTokens: number;
    signal?: AbortSignal;
}

/** Streams the answer as text deltas. Ollama streams newline-delimited JSON. */
export async function* chatStream(messages: LlmMessage[], options: GenerateOptions): AsyncGenerator<string> {
    const response = await post(
        "/api/chat",
        {
            model: CHAT_MODEL,
            messages,
            stream: true,
            keep_alive: KEEP_ALIVE,
            options: { temperature: options.temperature, num_predict: options.maxTokens, num_ctx: NUM_CTX },
            ...thinkField(),
        },
        options.signal
    );
    if (!response.body) throw new LlmUnavailableError("Model server returned an empty stream");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffered = "";

    const parse = function* (line: string): Generator<string> {
        if (!line.trim()) return;
        const event = JSON.parse(line) as { message?: { content?: string }; error?: string };
        if (event.error) throw new Error(event.error);
        // Thinking models put their reasoning in message.thinking; only the
        // answer itself is ever shown.
        if (event.message?.content) yield event.message.content;
    };

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffered += decoder.decode(value, { stream: true });
        let newline: number;
        while ((newline = buffered.indexOf("\n")) !== -1) {
            const line = buffered.slice(0, newline);
            buffered = buffered.slice(newline + 1);
            yield* parse(line);
        }
    }
    yield* parse(buffered + decoder.decode());
}

/**
 * One-shot completion constrained to a JSON schema (Ollama structured outputs),
 * so the caller gets parseable JSON rather than JSON-shaped prose.
 */
export async function chatJson(
    messages: LlmMessage[],
    schema: Record<string, unknown>,
    options: GenerateOptions
): Promise<string> {
    const response = await post(
        "/api/chat",
        {
            model: CHAT_MODEL,
            messages,
            stream: false,
            format: schema,
            keep_alive: KEEP_ALIVE,
            options: { temperature: options.temperature, num_predict: options.maxTokens, num_ctx: NUM_CTX },
            ...thinkField(),
        },
        options.signal
    );
    const data = (await response.json()) as { message?: { content?: string } };
    return data.message?.content ?? "";
}
