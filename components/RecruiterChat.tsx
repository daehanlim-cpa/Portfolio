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

const STARTER_PROMPTS = [
    "I'm hiring for a Senior Data Engineer — is he a fit?",
    "How does his Snowflake work map to a Solutions Architect role?",
    "What's his experience leading client-facing delivery?",
    "Where has he shipped AI or GenAI into production?",
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
                    className="h-[6px] w-[6px] rounded-full bg-black/25"
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

export default function RecruiterChat({ compact = false }: { compact?: boolean }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [closed, setClosed] = useState(false);

    const reduce = useReducedMotion();
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const sessionRef = useRef<string>("");

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
    const showEmailCta = exchanges >= 3 || closed;
    const isEmpty = messages.length === 0;

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/70 px-6 py-4 backdrop-blur-xl backdrop-saturate-150">
                <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[13px] font-medium tracking-tight">Ask about Daehan</h2>
                        <p className="mt-0.5 text-[11px] text-gray-500">
                            Tell me the role you&rsquo;re hiring for
                        </p>
                    </div>
                    {remaining !== null && !closed && (
                        <span className="shrink-0 text-[11px] tabular-nums text-gray-400">
                            {remaining} {remaining === 1 ? "question" : "questions"} left
                        </span>
                    )}
                </div>
            </header>

            {/* Conversation */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6">
                <div className={`mx-auto max-w-2xl ${compact ? "py-6" : "py-10"}`}>
                    {isEmpty && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <p className="text-[15px] leading-relaxed text-gray-500">
                                I&rsquo;m Daehan&rsquo;s AI assistant. Ask how his experience maps to
                                the role you&rsquo;re hiring for — I&rsquo;ll answer from his resume
                                and project work.
                            </p>
                            <div className="mt-7 space-y-2">
                                {STARTER_PROMPTS.map((prompt, i) => (
                                    <motion.button
                                        key={prompt}
                                        onClick={() => send(prompt)}
                                        initial={reduce ? false : { opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: reduce ? 0 : 0.08 + i * 0.05,
                                            duration: 0.4,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-left text-[14px] text-gray-700 transition-colors duration-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100"
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
                                                ? "rounded-[22px] bg-black px-4 py-2.5 text-white"
                                                : message.notice
                                                  ? "rounded-[22px] border border-gray-200 bg-white px-4 py-3 text-gray-500"
                                                  : "rounded-[22px] bg-gray-100 px-4 py-3 text-gray-900"
                                        }`}
                                    >
                                        {message.content ? (
                                            <FormattedText text={message.content} />
                                        ) : (
                                            <TypingIndicator />
                                        )}

                                        {message.sources && message.sources.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5 border-t border-black/5 pt-3">
                                                {message.sources.map((source) => (
                                                    <Link
                                                        key={source.href}
                                                        href={source.href}
                                                        className="rounded-full bg-white px-2.5 py-1 text-[11px] text-gray-600 transition-colors hover:text-black"
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

                    {showEmailCta && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="mt-8 text-center text-[13px] text-gray-500"
                        >
                            Want to talk to Daehan directly?{" "}
                            <a
                                href={`mailto:${EMAIL}`}
                                className="text-black underline underline-offset-4 transition-opacity hover:opacity-60"
                            >
                                {EMAIL}
                            </a>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Composer */}
            <div className="border-t border-gray-200/80 bg-white/70 px-6 py-4 backdrop-blur-xl backdrop-saturate-150">
                <div className="mx-auto max-w-2xl">
                    <div className="flex items-end gap-2 rounded-[24px] border border-gray-200 bg-white px-4 py-2.5 transition-colors duration-200 focus-within:border-gray-400">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            disabled={closed}
                            onChange={(e) => {
                                setInput(e.target.value.slice(0, 500));
                                autosize();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    send(input);
                                }
                            }}
                            placeholder={
                                closed ? "This conversation has ended" : "Ask about a role…"
                            }
                            aria-label="Ask a question about Daehan"
                            className="max-h-[132px] flex-1 resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
                        />
                        <button
                            onClick={() => send(input)}
                            disabled={isStreaming || closed || !input.trim()}
                            aria-label="Send message"
                            className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white transition-all duration-200 hover:bg-gray-800 disabled:opacity-20"
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
                    <p className="mt-2.5 text-center text-[11px] leading-relaxed text-gray-400">
                        Answers come from Daehan&rsquo;s resume and project work. Verify details
                        before relying on them.
                    </p>
                </div>
            </div>
        </div>
    );
}
