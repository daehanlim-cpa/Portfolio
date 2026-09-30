/**
 * The Claude model behind the assistant, in one place because both API routes
 * use it.
 *
 * Claude Haiku 4.5 by default: the assistant answers from site content it is
 * handed in full, which a small fast model does well, at about $0.004 per
 * question. Set RESUME_CHAT_MODEL to e.g. claude-sonnet-5 or claude-opus-5 for
 * stronger reasoning on role-fit questions, at higher cost.
 */
export const CHAT_MODEL = process.env.RESUME_CHAT_MODEL || "claude-haiku-4-5";
