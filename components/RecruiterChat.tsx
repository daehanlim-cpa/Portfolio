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

/** What actually goes over the wire — the UI-only fields are stripped. */
interface WireMessage {
    role: "user" | "assistant";
    content: string;
}

export type ChatVariant = "page" | "compact" | "landing";

/**
 * Starter chips carry a short label but send a fuller question: the label has
 * to read at a glance inside a pill, while retrieval needs enough words to
 * match against.
 */
const STARTER_PROMPTS: Array<{ label: string; prompt: string }> = [
    { label: "What's he strongest at?", prompt: "What kind of work is he strongest at?" },
    { label: "His most complex project", prompt: "Walk me through his most complex project" },
    { label: "AI in production", prompt: "How does his AI work hold up in production?" },
    {
        label: "Hiring a data engineer",
        prompt: "I'm hiring a Senior Data Engineer — is he a fit?",
    },
];

/**
 * Shown when /api/followups is unreachable or returns nothing, and on the
 * compact sheet, which doesn't spend a call on suggestions.
 */
const FALLBACK_FOLLOW_UPS = [
    "What would he be bad at?",
    "How does he approach a messy data problem?",
    "Where has he led rather than built?",
];

/** Past this, the conversation is better continued by email than by chip. */
const FOLLOW_UP_EXCHANGE_LIMIT = 5;

/**
 * Swaps the pending assistant turn for the real one. Returns the list untouched
 * when it's empty, which is what "New chat" mid-flight leaves behind.
 */
function resolvePending(messages: Message[], resolved: Message): Message[] {
    if (!messages.length) return messages;
    return [...messages.slice(0, -1), resolved];
}

/**
 * The generated set is filtered against prior questions server-side. The static
 * set needs the same treatment or a visitor who clicked "What would he be bad
 * at?" can be offered it again on the next turn.
 */
function staticFollowUps(history: WireMessage[]): string[] {
    const asked = new Set(
        history
            .filter((message) => message.role === "user")
            .map((message) => message.content.trim().toLowerCase())
    );
    return FALLBACK_FOLLOW_UPS.filter((prompt) => !asked.has(prompt.toLowerCase()));
}

const MAX_INPUT_CHARS = 1000;
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

/**
 * Escalating copy, because a label that never changes reads as frozen too. The
 * wait before the first token covers a rate-limit check, an embedding call and
 * the model's time-to-first-token, so it can run to a few seconds on a cold
 * function — and under prefers-reduced-motion the dots hold still, leaving the
 * wording as the only sign of life.
 */
const THINKING_STAGES = [
    { afterMs: 0, label: "Thinking" },
    { afterMs: 6000, label: "Still thinking" },
    { afterMs: 15000, label: "Still working on it" },
] as const;

function ThinkingIndicator() {
    const reduce = useReducedMotion();
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const timers = THINKING_STAGES.slice(1).map((next, i) =>
            setTimeout(() => setStage(i + 1), next.afterMs)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        // role=status so the label, and each escalation, is announced rather
        // than leaving screen-reader users with silence.
        <div role="status" aria-live="polite" className="flex items-center gap-2 text-ink-tertiary">
            <span>{THINKING_STAGES[stage].label}</span>
            <span className="flex items-center gap-1" aria-hidden>
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="h-[4px] w-[4px] rounded-full bg-current"
                        animate={reduce ? undefined : { opacity: [0.2, 0.9, 0.2] }}
                        transition={
                            reduce
                                ? undefined
                                : { duration: 1.1, repeat: Infinity, delay: i * 0.16, ease: "easeInOut" }
                        }
                    />
                ))}
            </span>
        </div>
    );
}

/** Shared shape for starter chips and follow-up chips alike. */
function SuggestionChip({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="rounded-full border border-line-soft px-3.5 py-1.5 text-[12.5px] text-ink-secondary transition-colors duration-200 hover:border-line hover:bg-surface-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
            {label}
        </button>
    );
}

/**
 * The way back to the empty state. On the landing chat this is the only one:
 * the nav's "Ask" link points at the route the chat already occupies, so
 * clicking it never remounts the component.
 */
function NewChatButton({ onClick, iconOnly = false }: { onClick: () => void; iconOnly?: boolean }) {
    return (
        <button
            onClick={onClick}
            aria-label="New chat"
            title="New chat"
            className={`flex shrink-0 items-center justify-center rounded-full border border-line-soft text-ink-tertiary transition-colors duration-200 hover:border-line hover:bg-surface-sunken hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                iconOnly ? "h-7 w-7" : "gap-1.5 px-3 py-1.5 text-[12px]"
            }`}
        >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            {!iconOnly && "New chat"}
        </button>
    );
}

function SendButton({
    onClick,
    disabled,
    className = "",
}: {
    onClick: () => void;
    disabled: boolean;
    className?: string;
}) {
    return (
        // transition-colors rather than transition-all, so the focus ring appears
        // instantly instead of fading in over 200ms.
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label="Send message"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-colors duration-200 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-20 ${className}`}
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
    );
}

interface ComposerProps {
    value: string;
    onValueChange: (value: string) => void;
    onSubmit: () => void;
    closed: boolean;
    isStreaming: boolean;
    placeholder: string;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    autosize: () => void;
    /**
     * `hero` is the tall standalone box that carries the empty landing screen —
     * text top-left, send button bottom-right. `bar` is the compact single-row
     * form the conversation view docks at the bottom.
     */
    tone: "hero" | "bar";
}

function Composer({
    value,
    onValueChange,
    onSubmit,
    closed,
    isStreaming,
    placeholder,
    textareaRef,
    autosize,
    tone,
}: ComposerProps) {
    const hero = tone === "hero";
    const sendDisabled = isStreaming || closed || !value.trim();

    const textarea = (
        <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            disabled={closed}
            onChange={(e) => {
                onValueChange(e.target.value.slice(0, MAX_INPUT_CHARS));
                autosize();
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSubmit();
                }
            }}
            placeholder={placeholder}
            aria-label="Ask a question about Daehan"
            /* focus-visible:outline-none, not just outline-none: the global rule
               in globals.css is a bare `:focus-visible` and wins on source order
               against a plain utility, which drew a blue box inside the box. The
               wrapper carries the ring instead — see below. */
            className={`max-h-[132px] resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-ink-quaternary focus-visible:outline-none disabled:cursor-not-allowed ${
                hero ? "min-h-[46px] w-full" : "flex-1"
            }`}
        />
    );

    /*
     * focus-within, not has-[:focus-visible]: a focused text field always matches
     * :focus-visible per spec, so the two are equivalent here and this is plainer.
     *
     * The halo replaces the global 2px accent outline, which drew a hard blue box
     * *inside* the composer. Same accent, same wash as ::selection, hugging the
     * radius — visible enough to serve as the focus indicator without shouting.
     */
    const focusRing =
        "focus-within:border-ink-quaternary focus-within:ring-4 focus-within:ring-[rgba(0,102,204,0.11)]";

    if (hero) {
        return (
            <div
                className={`rounded-[26px] border border-line-soft bg-surface px-5 pb-2.5 pt-4 shadow-raised transition-colors duration-200 ${focusRing}`}
            >
                {textarea}
                <div className="flex justify-end">
                    <SendButton onClick={onSubmit} disabled={sendDisabled} />
                </div>
            </div>
        );
    }

    return (
        <div
            className={`flex items-end gap-2 rounded-[24px] border border-line-soft bg-surface px-4 py-2.5 transition-colors duration-200 ${focusRing}`}
        >
            {textarea}
            <SendButton onClick={onSubmit} disabled={sendDisabled} className="mb-0.5" />
        </div>
    );
}

export default function RecruiterChat({ variant = "page" }: { variant?: ChatVariant }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [closed, setClosed] = useState(false);
    /**
     * `null` means "not resolved yet" — no chips render, so they appear once
     * rather than flashing the static list and then swapping to the generated
     * one a beat later.
     */
    const [followUps, setFollowUps] = useState<string[] | null>(null);

    const reduce = useReducedMotion();
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const sessionRef = useRef<string>("");
    const followUpAbort = useRef<AbortController | null>(null);
    const chatAbort = useRef<AbortController | null>(null);

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
    }, [messages, isStreaming, followUps, reduce]);

    // Requests in flight when the component unmounts have nothing left to
    // update, and on the compact sheet that happens on every close.
    useEffect(
        () => () => {
            followUpAbort.current?.abort();
            chatAbort.current?.abort();
        },
        []
    );

    /**
     * Clears the transcript but deliberately keeps the session id: the
     * per-conversation quota is keyed on it, so minting a fresh one here would
     * turn this button into an unlimited-questions exploit. `remaining` and
     * `closed` survive for the same reason — they describe server state that a
     * local reset can't undo.
     */
    const startNewChat = () => {
        chatAbort.current?.abort();
        followUpAbort.current?.abort();
        setMessages([]);
        setInput("");
        setFollowUps(null);
        setIsStreaming(false);
        requestAnimationFrame(autosize);
    };

    const autosize = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
    };

    /**
     * Suggestions are a nicety, so this never surfaces a failure — every path
     * that doesn't produce generated questions lands on the static list.
     */
    const loadFollowUps = async (history: WireMessage[], fallback: string[]) => {
        if (!isLanding) {
            setFollowUps(fallback);
            return;
        }

        const controller = new AbortController();
        followUpAbort.current = controller;

        try {
            const response = await fetch("/api/followups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-chat-session": sessionRef.current,
                },
                body: JSON.stringify({ messages: history }),
                signal: controller.signal,
            });

            const data = response.ok ? await response.json() : null;
            const generated: string[] = Array.isArray(data?.followUps)
                ? data.followUps.filter(
                      (entry: unknown): entry is string =>
                          typeof entry === "string" && entry.trim().length > 0
                  )
                : [];

            setFollowUps(generated.length ? generated : fallback);
        } catch {
            // An abort means a newer question is already streaming; leaving
            // followUps as-is keeps stale chips from reappearing under it.
            if (controller.signal.aborted) return;
            setFollowUps(fallback);
        }
    };

    const send = async (text: string) => {
        const question = text.trim();
        if (!question || isStreaming || closed) return;

        const history = [...messages, { role: "user" as const, content: question }];
        const outbound: WireMessage[] = history
            .filter((m) => !m.notice)
            .map(({ role, content }) => ({ role, content }));
        const fallback = staticFollowUps(outbound);

        followUpAbort.current?.abort();
        const controller = new AbortController();
        chatAbort.current = controller;

        setFollowUps(null);
        // The assistant's turn is created now rather than when the response
        // lands, so the thinking indicator covers the whole round trip. Pushing
        // it on arrival meant the visitor watched an unchanged screen through
        // the rate-limit check, the embedding call and the model's TTFT.
        setMessages([...history, { role: "assistant", content: "" }]);
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
                body: JSON.stringify({ messages: outbound }),
                signal: controller.signal,
            });

            const headerRemaining = response.headers.get("X-Conversation-Remaining");
            if (headerRemaining !== null) setRemaining(Number(headerRemaining));

            if (!response.ok) {
                const data = await response.json().catch(() => ({
                    message: "Something went wrong. Please try again.",
                }));
                // 409 = conversation exhausted, 429 = rate limited: both end the session.
                if (response.status === 409 || response.status === 429) setClosed(true);
                setMessages((prev) =>
                    resolvePending(prev, {
                        role: "assistant",
                        content: data.message,
                        notice: true,
                    })
                );
                setFollowUps(fallback);
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

            // The pending turn already exists; this only tags it as a notice so
            // canned replies render in the quieter style.
            if (notice) {
                setMessages((prev) =>
                    resolvePending(prev, { role: "assistant", content: "", notice: true })
                );
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            // Mirrored locally so the follow-up request doesn't have to read the
            // answer back out of state.
            let answer = "";

            if (reader) {
                for (;;) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const text = decoder.decode(value, { stream: true });
                    answer += text;
                    setMessages((prev) => {
                        // "New chat" can land between two chunks, emptying the
                        // list this updater is appending to.
                        if (!prev.length) return prev;
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
                    if (!prev.length) return prev;
                    const next = [...prev];
                    next[next.length - 1] = { ...next[next.length - 1], sources };
                    return next;
                });
            }

            if (controller.signal.aborted) return;

            // Canned replies (greetings, off-topic) aren't grounded in anything
            // worth suggesting from, so they get the static list.
            if (notice || !answer.trim()) {
                setFollowUps(fallback);
            } else {
                void loadFollowUps([...outbound, { role: "assistant", content: answer }], fallback);
            }
        } catch {
            // Abort means the visitor cleared the conversation on purpose;
            // startNewChat already reset the state an error notice would land in.
            if (controller.signal.aborted) return;
            setMessages((prev) =>
                resolvePending(prev, {
                    role: "assistant",
                    content: "I couldn't reach the server. Please try again.",
                    notice: true,
                })
            );
            setFollowUps(fallback);
        } finally {
            if (!controller.signal.aborted) setIsStreaming(false);
        }
    };

    const exchanges = messages.filter((m) => m.role === "user").length;
    const showEmailCta = exchanges >= 5 || closed;
    const isEmpty = messages.length === 0;
    // Only surface the counter near the end — a running tally from message one
    // makes an open conversation feel metered.
    const showCounter = remaining !== null && remaining <= 5 && !closed;
    // `followUps` is still null while generation is in flight, which is what
    // keeps the chips from rendering twice with different contents.
    const visibleFollowUps =
        !isEmpty && !isStreaming && !closed && exchanges < FOLLOW_UP_EXCHANGE_LIMIT
            ? (followUps ?? [])
            : [];

    // The landing screen opens on this instead of a conversation: everything
    // centred on the composer, with the thread view taking over on first send.
    const showHero = isLanding && isEmpty;
    // Hidden once the server has closed the session: clearing the screen can't
    // give quota back, so the email CTA is the honest next step there.
    const showNewChat = !isEmpty && !closed;

    const composer = (
        <Composer
            value={input}
            onValueChange={setInput}
            onSubmit={() => send(input)}
            closed={closed}
            isStreaming={isStreaming}
            placeholder={
                closed
                    ? "This conversation has ended"
                    : isLanding
                      ? "Ask anything about Daehan…"
                      : "Ask a question…"
            }
            textareaRef={textareaRef}
            autosize={autosize}
            tone={showHero ? "hero" : "bar"}
        />
    );

    const disclaimer = "Answers come from Daehan's resume and project work.";

    if (showHero) {
        return (
            <div className="flex h-full flex-col bg-surface">
                <div className="flex-1 overflow-y-auto px-5 sm:px-6">
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center py-10"
                    >
                        <h1 className="text-center text-title font-light text-ink sm:text-display-sm">
                            Ask me about Daehan.
                        </h1>
                        {/* text-balance so the second line never orphans a word;
                            globals.css only balances headings. */}
                        <p className="mx-auto mt-3 max-w-md text-balance text-center text-body font-light leading-relaxed text-ink-tertiary">
                            I know his projects, his background, and how he works.
                        </p>

                        <div className="mt-8">{composer}</div>

                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            {STARTER_PROMPTS.map(({ label, prompt }, i) => (
                                <motion.div
                                    key={prompt}
                                    initial={reduce ? false : { opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: reduce ? 0 : 0.18 + i * 0.05,
                                        duration: 0.45,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                >
                                    <SuggestionChip label={label} onClick={() => send(prompt)} />
                                </motion.div>
                            ))}
                        </div>

                        <p className="mt-7 text-center text-[11px] leading-relaxed text-ink-quaternary">
                            {disclaimer}
                        </p>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-surface">
            {/* The landing variant leans on the site nav for context, so it
                omits this bar entirely. */}
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
                        <div className="flex shrink-0 items-center gap-2.5">
                            {showCounter && (
                                <span className="text-[11px] tabular-nums text-ink-quaternary">
                                    {remaining} left
                                </span>
                            )}
                            {/* The sheet is 420px wide; a labelled button here
                                pushes the subtitle onto a second line. */}
                            {showNewChat && (
                                <NewChatButton onClick={startNewChat} iconOnly={isCompact} />
                            )}
                        </div>
                    </div>
                </header>
            )}

            {/* Landing has no header, so the reset gets its own row above the
                thread — outside the scroll area, so it stays reachable. */}
            {isLanding && showNewChat && (
                <div className="px-5 pt-3 sm:px-6">
                    <div className="mx-auto flex max-w-2xl justify-end">
                        <NewChatButton onClick={startNewChat} />
                    </div>
                </div>
            )}

            {/* Conversation */}
            <div
                ref={scrollRef}
                className={`flex-1 overflow-y-auto ${isLanding ? "px-5 sm:px-6" : "px-6"}`}
            >
                <div className={`mx-auto max-w-2xl ${isCompact ? "py-6" : "py-10"}`}>
                    {isEmpty && (
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <p className="text-[15px] leading-relaxed text-ink-tertiary">
                                I&rsquo;m Daehan&rsquo;s AI assistant. Ask about his work, his
                                projects, or how his experience fits what you&rsquo;re looking for.
                            </p>

                            <div className="mt-7 space-y-2">
                                {STARTER_PROMPTS.map(({ prompt }, i) => (
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
                                            <ThinkingIndicator />
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

                    {/* Generated per answer on the landing chat; the static list
                        elsewhere and whenever generation didn't produce any. */}
                    {visibleFollowUps.length > 0 && (
                        <motion.div
                            key={visibleFollowUps.join("|")}
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-5 flex flex-wrap gap-2"
                        >
                            {visibleFollowUps.map((prompt) => (
                                <SuggestionChip
                                    key={prompt}
                                    label={prompt}
                                    onClick={() => send(prompt)}
                                />
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
                    isLanding ? "px-5 pb-6 pt-2 sm:px-6" : "border-t border-line-soft px-6 py-4"
                }`}
            >
                <div className="mx-auto max-w-2xl">
                    {composer}
                    <div className="mt-2.5 flex items-center justify-center gap-3 text-[11px] leading-relaxed text-ink-quaternary">
                        <span>{disclaimer}</span>
                        {showCounter && isLanding && (
                            <span className="tabular-nums">{remaining} left</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
