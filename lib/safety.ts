/**
 * Deterministic guardrails around the assistant. The model's instructions are
 * the first line of defense; these are the checks that don't depend on the
 * model behaving, and they cost nothing, so they run before any API call:
 *
 * 1. Screening: prompt-injection / jailbreak attempts, and requests for
 *    Daehan's private personal details, get a fixed reply with no model call.
 * 2. Redaction: personal data a visitor pastes (emails, phone numbers, card
 *    and social security numbers) is removed before it reaches the model or
 *    the transcript log.
 * 3. Output guard: the streamed answer is checked as it goes out, so it can't
 *    leak the system instructions or emit personal data.
 *
 * These are pattern-based on purpose: predictable and auditable. They will not
 * catch every paraphrase; the system instruction covers what they miss.
 */

import { profile } from "@/data/site";

/* ------------------------------------------------------------------ *
 * 1. Screening                                                        *
 * ------------------------------------------------------------------ */

export type ScreenVerdict = "injection" | "personal_info" | null;

/**
 * Attempts to override, extract, or escape the assistant's instructions.
 * Written to match the attack phrasing, not ordinary questions: "could he act
 * as a tech lead?" must still get through.
 */
const INJECTION_PATTERNS: RegExp[] = [
    /\b(ignore|disregard|forget|override|bypass)\b.{0,30}\b(previous|prior|above|earlier|all|any|your|the|these|system)\b.{0,20}\b(instructions?|prompts?|rules|directions|guidelines|constraints|context)\b/i,
    /\b(reveal|show|print|repeat|output|display|leak|dump|expose|spell out|copy)\b.{0,30}\b(your|system|hidden|initial|original|secret|internal)\s+(prompt|instructions|guidelines|configuration|rules)\b/i,
    /\b(what|tell me)\b.{0,15}\b(is|are|were)\b.{0,10}\byour\b.{0,20}\b(instructions|system prompt|rules|guidelines)\b/i,
    /\b(system prompt|developer mode|dev mode|debug mode|dan mode|do anything now|jailbreak|god mode|sudo mode|unfiltered mode)\b/i,
    /\byou are (now|no longer)\b/i,
    /\bfrom now on,? (you|your|act|respond|answer)\b/i,
    /\b(pretend|roleplay|role-play)\b.{0,20}\b(you are|to be|as)\b/i,
    /\bnew (instructions|persona)\b/i,
    // Spoofed delimiters: the site reference is wrapped in <site>/<document>
    // tags, and chat templates use these markers to fake a system turn.
    /<\/?\s*(site|document|system|instructions?|assistant|user)\b/i,
    /\[\/?(INST|SYS)\]|<<\/?SYS>>|<\|(im_start|im_end|system|endoftext|assistant|user)\|>/i,
    /^\s*(system|assistant|developer)\s*:/im,
    // Long encoded blobs are a common way to smuggle instructions past filters.
    /[A-Za-z0-9+/]{120,}={0,2}/,
];

/**
 * Requests for private details about Daehan: things a stranger has no need
 * for and the site deliberately doesn't hold. The public contact channels
 * (email, LinkedIn) are on the site and stay available.
 */
const PERSONAL_INFO_PATTERNS: RegExp[] = [
    /\b(home|street|mailing|residential|house)\s+address\b/i,
    /\bwhere (does|do|did) (he|daehan|you)\b.{0,10}\b(live|stay|reside)\b/i,
    /\b(phone|cell|mobile|telephone|whatsapp)\s*(number|no\.?|#)\b/i,
    /\b(ssn|social security|date of birth|birth ?date|birthday|passport|driver'?s licen[cs]e|national id)\b/i,
    /\bhow old is (he|daehan)\b|\b(his|daehan'?s) age\b/i,
    /\b(his|daehan'?s)\s+(wife|husband|spouse|girlfriend|boyfriend|kids|children|son|daughter|parents|mother|father)\b/i,
    /\bis (he|daehan) (married|single|dating)\b/i,
    /\b(his|daehan'?s)\s+(religion|religious|political (views|affiliation)|net worth|credit score|bank account)\b/i,
];

export function screen(text: string): ScreenVerdict {
    if (INJECTION_PATTERNS.some((pattern) => pattern.test(text))) return "injection";
    if (PERSONAL_INFO_PATTERNS.some((pattern) => pattern.test(text))) return "personal_info";
    return null;
}

export const INJECTION_REPLY =
    "I can't help with that. I'm here to answer questions about Daehan's work, projects and background.";

export const PERSONAL_INFO_REPLY =
    `I don't share personal details beyond what's on this site. For anything else, Daehan is best reached directly at ${profile.email} or on LinkedIn.`;

/* ------------------------------------------------------------------ *
 * 2. Redaction                                                        *
 * ------------------------------------------------------------------ */

/** Passes the Luhn checksum, so ordinary long numbers aren't taken for cards. */
function luhn(digits: string): boolean {
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
        let d = Number(digits[digits.length - 1 - i]);
        if (i % 2 === 1) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
    }
    return sum % 10 === 0;
}

/** Contact details the site publishes itself. These are never redacted. */
const PUBLIC_EMAILS = new Set([profile.email.toLowerCase()]);

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const SSN = /\b\d{3}-\d{2}-\d{4}\b/g;
const CARD = /\b(?:\d[ -]?){13,19}\b/g;
const PHONE = /(?<![\w-])(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}(?![\w-])/g;

/**
 * Removes personal data. Order matters: cards before phones, since a card
 * number contains phone-shaped runs.
 */
export function redact(text: string): string {
    return text
        .replace(EMAIL, (match) => (PUBLIC_EMAILS.has(match.toLowerCase()) ? match : "[email removed]"))
        .replace(SSN, "[number removed]")
        .replace(CARD, (match) => {
            const digits = match.replace(/\D/g, "");
            return digits.length >= 13 && luhn(digits) ? "[card number removed]" : match;
        })
        .replace(PHONE, "[phone number removed]");
}

/* ------------------------------------------------------------------ *
 * 3. Output guard                                                     *
 * ------------------------------------------------------------------ */

/**
 * Phrases that only appear in the system instructions or the reference
 * wrapper. If one shows up in an answer, the model is reciting its prompt.
 */
export const LEAK_MARKERS = [
    "YOUR PURPOSE",
    "CONVERSATIONAL RANGE",
    "GROUNDING RULES",
    "SECURITY\n",
    "PRIVACY\n",
    "<site>",
    "</site>",
    "<document title=",
    "THE EXCHANGE THAT JUST HAPPENED",
];

/** Characters held back so a pattern split across two deltas is still caught. */
const HOLDBACK = 48;

export const LEAK_REPLY = "I can't share that. Ask me about Daehan's work, projects or background instead.";

/**
 * Wraps a stream of text deltas. `push` returns the text that is safe to send
 * now; `end` returns whatever was held back. Once a leak is detected,
 * `tripped` is set, the rest of the answer is dropped, and the caller should
 * stop generating.
 */
export function createOutputGuard() {
    let pending = "";
    /** The end of what was already released, so a marker straddling the cut is still seen. */
    let released = "";
    let tripped = false;

    const leaks = (text: string) => LEAK_MARKERS.some((marker) => text.includes(marker));

    return {
        get tripped() {
            return tripped;
        },
        push(delta: string): string {
            if (tripped) return "";
            pending += delta;
            if (leaks(released + pending)) {
                tripped = true;
                pending = "";
                return "";
            }
            if (pending.length <= HOLDBACK) return "";
            // Release up to the last whitespace before the holdback window, so
            // an email or number is never split across the boundary.
            const cut = pending.lastIndexOf(" ", pending.length - HOLDBACK);
            if (cut <= 0) return "";
            const ready = redact(pending.slice(0, cut));
            released = (released + pending.slice(0, cut)).slice(-HOLDBACK);
            pending = pending.slice(cut);
            return ready;
        },
        end(): string {
            if (tripped) return "";
            const rest = redact(pending);
            pending = "";
            return rest;
        },
    };
}
