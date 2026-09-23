"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";

const PROMPTS = [
    "Is he a fit for a Senior Data Engineer role?",
    "What has he shipped with GenAI?",
    "How does his CPA background show up in his work?",
    "Walk me through his most complex project",
];

/**
 * The hero's entry into the assistant. It doesn't answer inline: it hands the
 * question to /ask, where the full conversation has room to breathe.
 */
export default function AskBox() {
    const router = useRouter();
    const reduce = useReducedMotion();
    const [value, setValue] = useState("");
    const [hint, setHint] = useState(0);

    // Cycle the placeholder so the box demonstrates what it's for.
    useEffect(() => {
        if (reduce) return;
        const id = window.setInterval(() => setHint((h) => (h + 1) % PROMPTS.length), 3200);
        return () => window.clearInterval(id);
    }, [reduce]);

    const ask = (question: string) => {
        const q = question.trim();
        router.push(q ? `/ask?q=${encodeURIComponent(q)}` : "/ask");
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                ask(value || PROMPTS[hint]);
            }}
            className="group relative flex w-full max-w-xl items-center rounded-full border border-line bg-surface-raised p-1.5 pl-5 shadow-raised transition-[border-color,box-shadow] duration-300 focus-within:border-ink-quaternary focus-within:shadow-lifted"
        >
            <label htmlFor="hero-ask" className="sr-only">
                Ask the AI assistant about Daehan
            </label>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mr-3 shrink-0 text-ink-quaternary">
                <path
                    d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
            </svg>
            <input
                id="hero-ask"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={PROMPTS[hint]}
                autoComplete="off"
                maxLength={500}
                className="min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-quaternary"
            />
            <button
                type="submit"
                className="ml-2 shrink-0 rounded-full bg-ink px-4 py-2 text-caption font-medium text-on-ink transition-opacity duration-200 hover:opacity-85"
            >
                Ask
            </button>
        </form>
    );
}
