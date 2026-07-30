"use client";

import { useState } from "react";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

type Language = "ko" | "en";

export default function BlogSection() {
    const [language, setLanguage] = useState<Language>("en");

    return (
        <section className="border-t border-line-soft px-6 py-20 sm:px-10 sm:py-24">
            <div className="mx-auto max-w-content">
                <div className="mb-10 flex items-baseline justify-between gap-6">
                    <h2 className="text-title-sm font-light text-ink">Writing</h2>

                    {/* Two-state toggle. Sized to the text, not padded to a button. */}
                    <div className="flex items-center gap-1 rounded-lg border border-line-soft bg-surface-muted p-0.5">
                        {(["en", "ko"] as const).map((code) => (
                            <button
                                key={code}
                                onClick={() => setLanguage(code)}
                                aria-pressed={language === code}
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
                </div>

                <ul className="-mx-4">
                    {blogPosts.map((post) => (
                        <li key={post.id}>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="group flex items-baseline justify-between gap-8 rounded-md px-4 py-5 transition-colors duration-200 hover:bg-surface-sunken"
                            >
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-body text-ink-secondary transition-colors group-hover:text-ink">
                                        {post.title[language]}
                                    </h3>
                                    <p className="mt-1 truncate text-caption text-ink-quaternary">
                                        {post.description[language]}
                                    </p>
                                </div>

                                {post.tags && post.tags.length > 0 && (
                                    <span className="hidden shrink-0 text-label uppercase text-ink-quaternary sm:inline">
                                        {post.tags[0]}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
