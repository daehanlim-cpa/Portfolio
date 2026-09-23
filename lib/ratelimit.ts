import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { redact } from "./safety";

export type LimitReason = "conversation" | "ip_hourly" | "ip_daily" | "global_daily";

export interface LimitResult {
    ok: boolean;
    reason?: LimitReason;
    /** Messages left in the current conversation, for the "N questions left" microcopy. */
    conversationRemaining: number;
    retryAfterSeconds?: number;
}

export const CONVERSATION_LIMIT = 30;
const IP_HOURLY_LIMIT = 45;
const IP_DAILY_LIMIT = 90;
/**
 * Follow-up suggestions fire roughly once per answered turn, so this only needs
 * to sit above the chat's own hourly ceiling to never be the binding constraint.
 */
const FOLLOWUP_IP_HOURLY_LIMIT = 60;

function globalDailyLimit(): number {
    const parsed = Number.parseInt(process.env.CHAT_DAILY_GLOBAL_LIMIT ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 500;
}

const hasUpstash = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

const redis = hasUpstash ? Redis.fromEnv() : null;

if (!hasUpstash) {
    console.warn(
        "[ratelimit] Upstash credentials not set - falling back to in-memory limits. " +
            "These reset on cold start and are NOT safe for production."
    );
}

/* ------------------------------------------------------------------ *
 * In-memory fallback: same shape as Ratelimit, fixed-window counters. *
 * ------------------------------------------------------------------ */

const memoryCounters = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const existing = memoryCounters.get(key);

    if (!existing || now >= existing.resetAt) {
        memoryCounters.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true, remaining: limit - 1, reset: now + windowMs };
    }

    existing.count += 1;
    return {
        success: existing.count <= limit,
        remaining: Math.max(0, limit - existing.count),
        reset: existing.resetAt,
    };
}

/* ------------------------------------------------------------------ */

const WINDOWS = {
    conversation: { limit: CONVERSATION_LIMIT, ms: 24 * 60 * 60 * 1000, window: "1 d" },
    ip_hourly: { limit: IP_HOURLY_LIMIT, ms: 60 * 60 * 1000, window: "1 h" },
    ip_daily: { limit: IP_DAILY_LIMIT, ms: 24 * 60 * 60 * 1000, window: "1 d" },
    followup_ip_hourly: { limit: FOLLOWUP_IP_HOURLY_LIMIT, ms: 60 * 60 * 1000, window: "1 h" },
} as const;

function makeLimiter(name: keyof typeof WINDOWS) {
    if (!redis) return null;
    const { limit, window } = WINDOWS[name];
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, window),
        prefix: `chat:${name}`,
        analytics: false,
    });
}

const limiters = {
    conversation: makeLimiter("conversation"),
    ip_hourly: makeLimiter("ip_hourly"),
    ip_daily: makeLimiter("ip_daily"),
    followup_ip_hourly: makeLimiter("followup_ip_hourly"),
};

const globalLimiter = redis
    ? new Ratelimit({
          redis,
          limiter: Ratelimit.fixedWindow(globalDailyLimit(), "1 d"),
          prefix: "chat:global_daily",
          analytics: false,
      })
    : null;

/**
 * Deliberately a separate budget from the chat's. Suggestions are decorative;
 * they must never be able to eat the day's answer capacity, so they get their
 * own bucket of the same size rather than drawing from the shared one.
 */
const followupGlobalLimiter = redis
    ? new Ratelimit({
          redis,
          limiter: Ratelimit.fixedWindow(globalDailyLimit(), "1 d"),
          prefix: "chat:followup_global_daily",
          analytics: false,
      })
    : null;

async function consume(name: keyof typeof WINDOWS, identifier: string) {
    const limiter = limiters[name];
    if (limiter) return limiter.limit(identifier);
    const { limit, ms } = WINDOWS[name];
    return memoryLimit(`${name}:${identifier}`, limit, ms);
}

async function consumeGlobal() {
    if (globalLimiter) return globalLimiter.limit("all");
    return memoryLimit("global_daily", globalDailyLimit(), 24 * 60 * 60 * 1000);
}

async function consumeFollowupGlobal() {
    if (followupGlobalLimiter) return followupGlobalLimiter.limit("all");
    return memoryLimit("followup_global_daily", globalDailyLimit(), 24 * 60 * 60 * 1000);
}

/**
 * Quota for follow-up suggestions. Intentionally does NOT touch the
 * per-conversation counter: a visitor should never lose a question they could
 * have asked because the UI generated chips on their behalf.
 */
export async function checkFollowupLimits(ip: string): Promise<boolean> {
    const perIp = await consume("followup_ip_hourly", ip);
    if (!perIp.success) return false;

    const global = await consumeFollowupGlobal();
    return global.success;
}

/**
 * Consumes quota in cheapest-to-most-precious order and short-circuits on the
 * first failure. Ordering is deliberate: a spammer who trips the per-conversation
 * cap never gets to consume from the global daily budget.
 */
export async function checkLimits(sessionId: string, ip: string): Promise<LimitResult> {
    const conversation = await consume("conversation", sessionId);
    if (!conversation.success) {
        return {
            ok: false,
            reason: "conversation",
            conversationRemaining: 0,
        };
    }

    const conversationRemaining = conversation.remaining;

    const hourly = await consume("ip_hourly", ip);
    if (!hourly.success) {
        return {
            ok: false,
            reason: "ip_hourly",
            conversationRemaining,
            retryAfterSeconds: Math.max(1, Math.ceil((hourly.reset - Date.now()) / 1000)),
        };
    }

    const daily = await consume("ip_daily", ip);
    if (!daily.success) {
        return {
            ok: false,
            reason: "ip_daily",
            conversationRemaining,
            retryAfterSeconds: Math.max(1, Math.ceil((daily.reset - Date.now()) / 1000)),
        };
    }

    const global = await consumeGlobal();
    if (!global.success) {
        return {
            ok: false,
            reason: "global_daily",
            conversationRemaining,
            retryAfterSeconds: Math.max(1, Math.ceil((global.reset - Date.now()) / 1000)),
        };
    }

    return { ok: true, conversationRemaining };
}

/* ------------------------------------------------------------------ *
 * Strikes: repeated malicious attempts block the IP for a day.        *
 * ------------------------------------------------------------------ */

/** Blocked attempts allowed per hour before the IP is shut out. */
const STRIKE_LIMIT = 3;
const STRIKE_WINDOW_S = 60 * 60;
const BLOCK_S = 24 * 60 * 60;

const memoryBlocks = new Map<string, number>();

/**
 * Records a screened-out attempt. One can be an accident (a curious visitor
 * asking what the instructions are); three in an hour is probing, and the IP
 * is refused outright for a day, before any other work is done.
 */
export async function recordStrike(ip: string): Promise<void> {
    try {
        if (redis) {
            const key = `chat:strikes:${ip}`;
            const count = await redis.incr(key);
            if (count === 1) await redis.expire(key, STRIKE_WINDOW_S);
            if (count >= STRIKE_LIMIT) {
                await redis.set(`chat:blocked:${ip}`, "1", { ex: BLOCK_S });
                console.warn(`[safety] blocked ${ip} for ${BLOCK_S / 3600}h after ${count} attempts`);
            }
            return;
        }
        const strikes = memoryLimit(`strikes:${ip}`, STRIKE_LIMIT - 1, STRIKE_WINDOW_S * 1000);
        if (!strikes.success) memoryBlocks.set(ip, Date.now() + BLOCK_S * 1000);
    } catch (error) {
        console.error("[safety] recording strike failed:", error);
    }
}

export async function isBlocked(ip: string): Promise<boolean> {
    try {
        if (redis) return (await redis.exists(`chat:blocked:${ip}`)) === 1;
        const until = memoryBlocks.get(ip);
        return until !== undefined && until > Date.now();
    } catch {
        // Fail open: a Redis outage shouldn't take the assistant down for everyone.
        return false;
    }
}

/** Transcript logging. Best-effort: a logging failure must never break a reply. */
export async function logTranscript(
    sessionId: string,
    entry: { question: string; answer: string; blocked?: LimitReason | "injection" | "personal_info" | "ip_blocked" }
): Promise<void> {
    if (!redis) return;
    try {
        const key = `chat:log:${sessionId}`;
        // Visitors sometimes paste their own contact details; those never
        // reach storage.
        const safe = { ...entry, question: redact(entry.question), answer: redact(entry.answer) };
        await redis.rpush(key, JSON.stringify({ ...safe, at: new Date().toISOString() }));
        await redis.expire(key, 60 * 60 * 24 * 30);
        await redis.lpush("chat:recent", `${sessionId}|${safe.question.slice(0, 120)}`);
        await redis.ltrim("chat:recent", 0, 499);
    } catch (error) {
        console.error("[ratelimit] transcript logging failed:", error);
    }
}
