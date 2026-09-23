"use client";

import { useState } from "react";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

type Language = "ko" | "en";

/**
 * The post list, used on the home page and as the body of /writing. Posts are
 * written in both English and Korean, so the toggle switches the whole list.
 */
export default function BlogSection({ showHeading = true }: { showHeading?: boolean }) {
    const [language, setLanguage] = useState<Language>("en");

    const toggle = (
        <div className="flex items-center gap-1 rounded-lg border border-line-soft bg-surface-muted p-0.5">
            {(["en", "ko"] as const).map((code) => (
                <button
                    key={code}
                    onClick={() => setLanguage(code)}
                    aria-pressed={language === code}
                    aria-label={code === "en" ? "English" : "Korean"}
                    className={`rounded-[7px] px-2.5 py-1 text-label uppercase transition-colors duration-200 ${
                        language === code
                            ? "bg-surface font-medium text-ink shadow-subtle"
                            : "text-ink-tertiary hover:text-ink"
                    }`}
                >
                    {code}
                </button>
            ))}
        </div>
    );

    return (
        <div>
            <div className="mb-8 flex items-end justify-between gap-6">
                {showHeading ? (
                    <div>
                        <p className="text-caption font-medium text-ink-tertiary">Writing</p>
                        <h2 className="mt-3 text-display-sm font-semibold tracking-[-0.03em] text-ink sm:text-display">
                            Notes on the craft. <span className="text-ink-quaternary">And the career.</span>
                        </h2>
                    </div>
                ) : (
                    <span />
                )}
                {toggle}
            </div>

            <ul className="divide-y divide-line-soft border-y border-line-soft">
                {blogPosts.map((post) => (
                    <li key={post.id}>
                        <Link
                            href={`/blog/${post.slug}`}
                            lang={language}
                            className="group grid gap-2 py-7 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-10"
                        >
                            <div className="min-w-0">
                                <h3 className="text-title-sm font-semibold tracking-[-0.02em] text-ink transition-colors group-hover:text-ink-secondary">
                                    {post.title[language]}
                                </h3>
                                <p className="mt-2 text-body text-ink-tertiary">{post.description[language]}</p>
                            </div>
                            <span className="flex items-center gap-3 text-label uppercase text-ink-quaternary">
                                {post.tags?.[0]}
                                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
