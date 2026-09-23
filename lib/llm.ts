/**
 * The one place that talks to the model: Claude, through the Anthropic API.
 * Both API routes go through the two functions here, so switching models is
 * configuration (RESUME_CHAT_MODEL), not code.
 */

import Anthropic from "@anthropic-ai/sdk";
import { CHAT_MODEL } from "./models";

export type LlmMessage = Anthropic.MessageParam;

/**
 * Any reason the model can't answer right now: no key configured, the key was
 * rejected, the account's spend limit was reached, rate limiting, or a network
 * failure. The routes turn all of these into the same polite "unavailable"
 * message rather than surfacing API details to visitors.
 */
export class LlmUnavailableError extends Error {}

let client: Anthropic | null = null;

function getClient(): Anthropic {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new LlmUnavailableError("ANTHROPIC_API_KEY is not configured");
    }
    // Two retries covers transient 429/5xx; the timeout bounds the wait for a
    // response so a hung request can't hold a serverless function open.
    client ??= new Anthropic({ maxRetries: 2, timeout: 30_000 });
    return client;
}

function unavailable(error: unknown): LlmUnavailableError {
    if (error instanceof LlmUnavailableError) return error;
    if (error instanceof Anthropic.APIError) {
        return new LlmUnavailableError(`Claude API ${error.status ?? "connection"} error: ${error.message}`);
    }
    return new LlmUnavailableError(error instanceof Error ? error.message : String(error));
}

/**
 * System prompt as two cached blocks: the site content first, then this
 * route's instructions. Caching is a prefix match, so putting the (identical)
 * site content first lets the chat and follow-up routes share one cached copy
 * of it; each route's instructions get their own breakpoint after it. After
 * the first request, both are read from cache at a tenth of the input price.
 */
export function cachedSystem(instructions: string, reference: string): Anthropic.TextBlockParam[] {
    return [
        { type: "text", text: reference, cache_control: { type: "ephemeral" } },
        { type: "text", text: instructions, cache_control: { type: "ephemeral" } },
    ];
}

interface GenerateOptions {
    /** A cost ceiling for one answer, not a target. */
    maxTokens: number;
    signal?: AbortSignal;
}

/** Streams the answer as text deltas. */
export async function* chatStream(
    system: Anthropic.TextBlockParam[],
    messages: LlmMessage[],
    options: GenerateOptions
): AsyncGenerator<string> {
    try {
        const stream = getClient().messages.stream(
            { model: CHAT_MODEL, max_tokens: options.maxTokens, system, messages },
            { signal: options.signal }
        );

        for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
                yield event.delta.text;
            }
        }

        // One line per answer, so cache effectiveness and cost are visible in
        // the deployment logs.
        const { usage, stop_reason } = await stream.finalMessage();
        console.log(
            `[llm] ${CHAT_MODEL} stop=${stop_reason} in=${usage.input_tokens} cache_read=${usage.cache_read_input_tokens ?? 0} cache_write=${usage.cache_creation_input_tokens ?? 0} out=${usage.output_tokens}`
        );
    } catch (error) {
        if (options.signal?.aborted) return; // The visitor left; nothing to report.
        throw unavailable(error);
    }
}

/**
 * One-shot completion constrained to a JSON schema (structured outputs), so the
 * caller gets parseable JSON rather than JSON-shaped prose.
 */
export async function chatJson(
    system: Anthropic.TextBlockParam[],
    messages: LlmMessage[],
    schema: Record<string, unknown>,
    options: GenerateOptions
): Promise<string> {
    try {
        const response = await getClient().messages.create(
            {
                model: CHAT_MODEL,
                max_tokens: options.maxTokens,
                system,
                messages,
                output_config: { format: { type: "json_schema", schema } },
            },
            { signal: options.signal }
        );
        return response.content.map((block) => (block.type === "text" ? block.text : "")).join("");
    } catch (error) {
        throw unavailable(error);
    }
}
