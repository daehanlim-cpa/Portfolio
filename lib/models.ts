/**
 * Model ids, in one place because two routes now depend on them — `/api/chat`
 * and `/api/followups`. When these were inline constants there was nothing
 * stopping the two from drifting onto different models.
 */

/**
 * Verified against the live API. Two traps informed this choice:
 * - gemini-2.5-flash still appears in ListModels but is closed to new keys.
 * - The full 3.x Flash models think by default and thought tokens count against
 *   maxOutputTokens; gemini-3.6-flash burned ~380 of a 400 budget on thinking
 *   and truncated every answer mid-sentence. Thinking cannot be disabled there.
 * This model emits zero thought tokens, which suits grounded extractive answers
 * and keeps cost low. Raise maxOutputTokens if you switch to a thinking model.
 */
export const CHAT_MODEL = process.env.RESUME_CHAT_MODEL || "gemini-3.5-flash-lite";

export const EMBEDDING_MODEL = process.env.RESUME_EMBEDDING_MODEL || "gemini-embedding-001";

/** Must match EMBEDDING_DIMENSIONS in scripts/build-embeddings.ts. */
export const EMBEDDING_DIMENSIONS = 768;
