"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";

interface ResumeDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Roles and degrees as data, so the markup stays one shape per row rather than
 * a hand-repeated block per entry.
 */
const ROLES: Array<{ org: string; entries: Array<[title: string, dates: string]> }> = [
    {
        org: "Deloitte",
        entries: [["Senior Forward Deployed Engineer", "Jul 2026 — Present"]],
    },
    {
        org: "Ernst & Young",
        entries: [
            ["AI & Data Manager", "Jul 2024 — Jul 2026"],
            ["AI & Data Senior", "Jul 2021 — Jul 2024"],
            ["Enterprise Risk Staff", "Sep 2019 — Jul 2021"],
        ],
    },
];

const EDUCATION: Array<{ org: string; entries: Array<[title: string, dates: string]> }> = [
    {
        org: "University of the Cumberlands",
        entries: [
            ["PhD, Information Technology in AI", "Est. 2027"],
            ["MS, Global Business with Blockchain", "Aug 2024"],
        ],
    },
    {
        org: "University of Arizona",
        entries: [["BS, Accounting & Management Information Systems", "May 2019"]],
    },
];

function Group({ label, groups }: { label: string; groups: typeof ROLES }) {
    return (
        <section>
            <h3 className="mb-6 border-b border-line-soft pb-2.5 text-label uppercase text-ink-tertiary">
                {label}
            </h3>
            <div className="space-y-7">
                {groups.map(({ org, entries }) => (
                    <div key={org}>
                        <p className="text-caption font-medium text-ink">{org}</p>
                        <ul className="mt-2.5 space-y-2.5">
                            {entries.map(([title, dates]) => (
                                <li key={title} className="flex items-baseline justify-between gap-5">
                                    <span className="text-caption text-ink-secondary">{title}</span>
                                    <span className="shrink-0 text-label tabular-nums text-ink-quaternary">
                                        {dates}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function ResumeDrawer({ isOpen, onClose }: ResumeDrawerProps) {
    const reduce = useReducedMotion();

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = previous;
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.25 }}
                        onClick={onClose}
                        aria-hidden
                        className="fixed inset-0 z-[60] bg-ink/20 backdrop-blur-[2px]"
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Résumé summary"
                        initial={reduce ? { opacity: 0 } : { x: "100%" }}
                        animate={reduce ? { opacity: 1 } : { x: 0 }}
                        exit={reduce ? { opacity: 0 } : { x: "100%" }}
                        transition={
                            reduce
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 340, damping: 36, mass: 0.9 }
                        }
                        className="fixed right-0 top-0 z-[70] h-full w-full overflow-y-auto border-l border-line-soft bg-surface shadow-floating sm:w-[480px]"
                    >
                        <div className="sticky top-0 z-10 border-b border-line-soft bg-surface">
                            <div className="flex h-[calc(var(--nav-h)-1px)] items-center justify-between px-6">
                                <h2 className="text-caption font-medium text-ink">Overview</h2>
                                <button
                                    onClick={onClose}
                                    aria-label="Close"
                                    className="-mr-2 rounded-full p-2 text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="px-6 pb-10 pt-9">
                            <header className="mb-11">
                                <p className="text-title-sm font-light text-ink">Daehan Lim, CPA</p>
                                <p className="mt-2 text-caption leading-relaxed text-ink-tertiary">
                                    Senior Forward Deployed Engineer at Deloitte. Seven years
                                    building data and AI systems in regulated financial
                                    environments.
                                </p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    <a
                                        href="mailto:daehanlim1@gmail.com"
                                        className="rounded-full border border-line px-3.5 py-1.5 text-label text-ink-secondary transition-colors hover:bg-surface-muted hover:text-ink"
                                    >
                                        Email
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/daehan-lim-cpa/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-line px-3.5 py-1.5 text-label text-ink-secondary transition-colors hover:bg-surface-muted hover:text-ink"
                                    >
                                        LinkedIn
                                    </a>
                                    <a
                                        href="https://github.com/daehanlim-cpa"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-line px-3.5 py-1.5 text-label text-ink-secondary transition-colors hover:bg-surface-muted hover:text-ink"
                                    >
                                        GitHub
                                    </a>
                                </div>
                            </header>

                            <div className="space-y-11">
                                <Group label="Experience" groups={ROLES} />
                                <Group label="Education" groups={EDUCATION} />

                                <section>
                                    <h3 className="mb-6 border-b border-line-soft pb-2.5 text-label uppercase text-ink-tertiary">
                                        Certifications
                                    </h3>
                                    <ul className="flex flex-wrap gap-2">
                                        {[
                                            "CPA",
                                            "SnowPro Advanced: Data Engineer",
                                            "SnowPro Advanced: Data Architect",
                                            "SnowPro Core",
                                            "Databricks Data Engineer Associate",
                                        ].map((cert) => (
                                            <li
                                                key={cert}
                                                className="rounded-full bg-surface-muted px-3 py-1.5 text-label text-ink-secondary"
                                            >
                                                {cert}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <Link
                                    href="/resume"
                                    onClick={onClose}
                                    className="block rounded-full bg-ink py-3.5 text-center text-caption font-medium text-white transition-opacity hover:opacity-85"
                                >
                                    Full résumé
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
