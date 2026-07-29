"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

interface Source {
    title: string;
    href: string;
}

interface Message {
    role: "user" | "assistant";
    content: string;
    sources?: Source[];
    /** Rate-limit / refusal notices render quieter than real answers. */
    notice?: boolean;
}

export type ChatVariant = "page" | "compact" | "landing";

const STARTER_PROMPTS = [
    "What kind of work is he strongest at?",
    "Walk me through his most complex project",
    "How does his AI work hold up in production?",
    "I'm hiring a Senior Data Engineer — is he a fit?",
];

/** Shown under the composer once a conversation is going, to keep it moving. */
const FOLLOW_UPS = [
    "What would he be bad at?",
    "How does he approach a messy data problem?",
    "Where has he led rather than built?",
    "What's the through-line in his career?",
];

const EMAIL = "daehanlim1@gmail.com";

/** Minimal, injection-safe inline formatter: **bold** and *italic* only. */
function inline(text: string, keyPrefix: string) {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
    return parts.map((part, i) => {
        const key = `${keyPrefix}-${i}`;
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={key} className="font-medium">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
            return <em key={key}>{part.slice(1, -1)}</em>;
        }
        return <span key={key}>{part}</span>;
    });
}

/**
 * Renders model output without dangerouslySetInnerHTML — model text is never
 * treated as markup.
 */
function FormattedText({ text }: { text: string }) {
    const blocks = useMemo(() => {
        const lines = text.split("\n");
        const out: Array<{ type: "p" | "ul"; items: string[] }> = [];

        for (const line of lines) {
            const trimmed = line.trim();
            const bullet = /^[-*•]\s+/.test(trimmed);
            const last = out[out.length - 1];

            if (bullet) {
                const item = trimmed.replace(/^[-*•]\s+/, "");
                if (last?.type === "ul") last.items.push(item);
                else out.push({ type: "ul", items: [item] });
            } else if (trimmed) {
                if (last?.type === "p") last.items.push(trimmed);
                else out.push({ type: "p", items: [trimmed] });
            } else {
                out.push({ type: "p", items: [] });
            }
        }

        return out.filter((b) => b.items.length > 0);
    }, [text]);

    return (
        <div className="space-y-2">
            {blocks.map((block, i) =>
                block.type === "ul" ? (
                    <ul key={i} className="space-y-1.5 pl-1">
                        {block.items.map((item, j) => (
                            <li key={j} className="flex gap-2.5">
                                <span aria-hidden className="mt-[0.55em] h-[3px] w-[3px] shrink-0 rounded-full bg-current opacity-40" />
                                <span>{inline(item, `${i}-${j}`)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p key={i}>{inline(block.items.join(" "), `${i}`)}</p>
                )
            )}
        </div>
    );
}

function TypingIndicator() {
    const reduce = useReducedMotion();
    return (
        <div className="flex items-center gap-1.5 px-1 py-1" aria-label="Assistant is typing">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="h-[6px] w-[6px] rounded-full bg-ink/25"
                    animate={reduce ? undefined : { opacity: [0.2, 0.9, 0.2] }}
                    transition={
                        reduce
                            ? undefined
                            : { duration: 1.1, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }
                    }
                />
            ))}
        </div>
    );
}

export default function RecruiterChat({ variant = "page" }: { variant?: ChatVariant }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [closed, setClosed] = useState(false);

    const reduce = useReducedMotion();
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const sessionRef = useRef<string>("");

    const isLanding = variant === "landing";
    const isCompact = variant === "compact";

    if (!sessionRef.current && typeof window !== "undefined") {
        const existing = window.sessionStorage.getItem("chat-session");
        const id = existing ?? (crypto.randomUUID?.() ?? String(Math.random()).slice(2));
        window.sessionStorage.setItem("chat-session", id);
        sessionRef.current = id;
    }

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: reduce ? "auto" : "smooth",
        });
    }, [messages, isStreaming, reduce]);

    const autosize = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
    };

    const send = async (text: string) => {
        const question = text.trim();
        if (!question || isStreaming || closed) return;

        const history = [...messages, { role: "user" as const, content: question }];
        setMessages(history);
        setInput("");
        setIsStreaming(true);
        requestAnimationFrame(autosize);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-chat-session": sessionRef.current,
                },
                body: JSON.stringify({
                    messages: history
                        .filter((m) => !m.notice)
                        .map(({ role, content }) => ({ role, content })),
                }),
            });

            const headerRemaining = response.headers.get("X-Conversation-Remaining");
            if (headerRemaining !== null) setRemaining(Number(headerRemaining));

            if (!response.ok) {
                const data = await response.json().catch(() => ({
                    message: "Something went wrong. Please try again.",
                }));
                // 409 = conversation exhausted, 429 = rate limited: both end the session.
                if (response.status === 409 || response.status === 429) setClosed(true);
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.message, notice: true },
                ]);
                return;
            }

            let sources: Source[] = [];
            const raw = response.headers.get("X-Chat-Sources");
            if (raw) {
                try {
                    sources = JSON.parse(decodeURIComponent(raw));
                } catch {
                    sources = [];
                }
            }

            const notice = response.headers.get("X-Chat-Status") === "off_topic";

            setMessages((prev) => [...prev, { role: "assistant", content: "", notice }]);

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                for (;;) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const text = decoder.decode(value, { stream: true });
                    setMessages((prev) => {
                        const next = [...prev];
                        next[next.length - 1] = {
                            ...next[next.length - 1],
                            content: next[next.length - 1].content + text,
                        };
                        return next;
                    });
                }
            }

            if (sources.length) {
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = { ...next[next.length - 1], sources };
                    return next;
                });
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "I couldn't reach the server. Please try again.",
                    notice: true,
                },
            ]);
        } finally {
            setIsStreaming(false);
        }
    };

    const exchanges = messages.filter((m) => m.role === "user").length;
    const showEmailCta = exchanges >= 5 || closed;
    const isEmpty = messages.length === 0;
    // Only surface the counter near the end — a running tally from message one
    // makes an open conversation feel metered.
    const showCounter = remaining !== null && remaining <= 5 && !closed;
    const showFollowUps = !isEmpty && !isStreaming && !closed && exchanges < 5;

    return (
        <div className="flex h-full flex-col bg-surface">
            {/* The landing variant leans on the site nav for context, so it
                omits this bar entirely and lets the empty state carry the page. */}
            {!isLanding && (
                <header
                    className={`sticky top-0 z-10 border-b border-line-soft bg-white/80 py-4 pl-6 backdrop-blur-xl backdrop-saturate-150 ${
                        isCompact ? "pr-14" : "pr-6"
                    }`}
                >
                    <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
                        <div>
                            <h2 className="text-[13px] font-medium tracking-tight">Ask about Daehan</h2>
                            <p className="mt-0.5 text-[11px] text-ink-tertiary">
                                His work, his projects, how he thinks
                            </p>
                        </div>
                        {showCounter && (
                            <span className="shrink-0 text-[11px] tabular-nums text-ink-quaternary">
                                {remaining} left
                            </span>
                        )}
                    </div>
                </header>
            )}

            {/* Conversation */}
            <div
                ref={scrollRef}
                className={`flex-1 overflow-y-auto ${isLanding ? "px-5 sm:px-6" : "px-6"}`}
            >
                <div
                    className={`mx-auto ${isLanding ? "max-w-2xl" : "max-w-2xl"} ${
                        isCompact ? "py-6" : isLanding ? "" : "py-10"
                    } ${isLanding && isEmpty ? "flex min-h-full flex-col justify-center py-10" : ""} ${
                        isLanding && !isEmpty ? "py-10" : ""
                    }`}
                >
                    {isEmpty && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {isLanding ? (
                                <>
                                    <h1 className="text-title font-light text-ink sm:text-display-sm">
                                        Ask me about Daehan.
                                    </h1>
                                    <p className="mt-4 max-w-md text-body font-light leading-relaxed text-ink-tertiary sm:text-body-lg">
                                        I know his projects, his background, and how he works.
                                        Ask anything — whether you&rsquo;re hiring, collaborating,
                                        or just curious.
                                    </p>
                                </>
                            ) : (
                                <p className="text-[15px] leading-relaxed text-ink-tertiary">
                                    I&rsquo;m Daehan&rsquo;s AI assistant. Ask about his work, his
                                    projects, or how his experience fits what you&rsquo;re looking
                                    for.
                                </p>
                            )}

                            <div
                                className={
                                    isLanding
                                        ? "mt-9 grid gap-2.5 sm:grid-cols-2"
                                        : "mt-7 space-y-2"
                                }
                            >
                                {STARTER_PROMPTS.map((prompt, i) => (
                                    <motion.button
                                        key={prompt}
                                        onClick={() => send(prompt)}
                                        initial={reduce ? false : { opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: reduce ? 0 : 0.12 + i * 0.06,
                                            duration: 0.45,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="w-full rounded-2xl border border-line-soft bg-surface px-4 py-3 text-left text-[14px] leading-snug text-ink-secondary transition-all duration-200 hover:border-line hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.99] active:bg-surface-muted"
                                    >
                                        {prompt}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <AnimatePresence initial={false}>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={
                                        reduce
                                            ? { duration: 0 }
                                            : { type: "spring", stiffness: 500, damping: 40, mass: 0.8 }
                                    }
                                    className={`flex ${
                                        message.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[86%] text-[15px] leading-relaxed ${
                                            message.role === "user"
                                                ? "rounded-[22px] bg-ink px-4 py-2.5 text-white"
                                                : message.notice
                                                  ? "rounded-[22px] border border-line-soft bg-surface px-4 py-3 text-ink-tertiary"
                                                  : "rounded-[22px] bg-surface-muted px-4 py-3 text-ink"
                                        }`}
                                    >
                                        {message.content ? (
                                            <FormattedText text={message.content} />
                                        ) : (
                                            <TypingIndicator />
                                        )}

                                        {message.sources && message.sources.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line-soft pt-3">
                                                {message.sources.map((source) => (
                                                    <Link
                                                        key={source.href}
                                                        href={source.href}
                                                        className="rounded-full bg-surface px-2.5 py-1 text-[11px] text-ink-secondary transition-colors hover:text-ink"
                                                    >
                                                        {source.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Keeps the conversation moving without another model call. */}
                    {showFollowUps && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            className="mt-5 flex flex-wrap gap-2"
                        >
                            {FOLLOW_UPS.slice(0, 3).map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => send(prompt)}
                                    className="rounded-full border border-line-soft px-3.5 py-1.5 text-[12.5px] text-ink-secondary transition-colors duration-200 hover:border-line hover:bg-surface-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {showEmailCta && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mt-8 text-center text-[13px] text-ink-tertiary"
                        >
                            Want to talk to Daehan directly?{" "}
                            <a
                                href={`mailto:${EMAIL}`}
                                className="text-ink underline underline-offset-4 transition-opacity hover:opacity-60"
                            >
                                {EMAIL}
                            </a>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Composer */}
            <div
                className={`bg-white/80 backdrop-blur-xl backdrop-saturate-150 ${
                    isLanding
                        ? "px-5 pb-6 pt-2 sm:px-6"
                        : "border-t border-line-soft px-6 py-4"
                }`}
            >
                <div className="mx-auto max-w-2xl">
                    <div
                        className={`flex items-end gap-2 border border-line-soft bg-surface transition-colors duration-200 focus-within:border-ink-quaternary ${
                            isLanding
                                ? "rounded-[26px] px-5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]"
                                : "rounded-[24px] px-4 py-2.5"
                        }`}
                    >
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            disabled={closed}
                            onChange={(e) => {
                                setInput(e.target.value.slice(0, 1000));
                                autosize();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    send(input);
                                }
                            }}
                            placeholder={
                                closed
                                    ? "This conversation has ended"
                                    : isLanding
                                      ? "Ask anything about Daehan…"
                                      : "Ask a question…"
                            }
                            aria-label="Ask a question about Daehan"
                            className="max-h-[132px] flex-1 resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-ink-quaternary disabled:cursor-not-allowed"
                        />
                        {/* transition-colors rather than transition-all, so the focus
                            ring appears instantly instead of fading in over 200ms. */}
                        <button
                            onClick={() => send(input)}
                            disabled={isStreaming || closed || !input.trim()}
                            aria-label="Send message"
                            className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-200 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-20"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path
                                    d="M12 19V5M12 5L5 12M12 5L19 12"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-2.5 flex items-center justify-center gap-3 text-[11px] leading-relaxed text-ink-quaternary">
                        <span>Answers come from Daehan&rsquo;s resume and project work.</span>
                        {showCounter && isLanding && (
                            <span className="tabular-nums">{remaining} left</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
