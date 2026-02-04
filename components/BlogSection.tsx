"use client";

import { useState } from "react";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

type Language = "ko" | "en";

export default function BlogSection() {
    const [language, setLanguage] = useState<Language>("en");

    return (
        <div className="w-full px-6 sm:px-8 py-20">
            <div className="max-w-7xl mx-auto">
                {/* Section Header with Language Toggle */}
                <div className="mb-12 flex items-center justify-between">
                    <h2 className="text-xs uppercase tracking-wider text-gray-400">
                        SS Archive
                    </h2>

                    {/* Language Toggle */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setLanguage("en")}
                            className={`text-[10px] uppercase tracking-wider transition-colors px-2 py-1 ${language === "en"
                                ? "text-black font-medium"
                                : "text-gray-400 hover:text-black"
                                }`}
                        >
                            EN
                        </button>
                        <span className="text-gray-300">/</span>
                        <button
                            onClick={() => setLanguage("ko")}
                            className={`text-[10px] uppercase tracking-wider transition-colors px-2 py-1 ${language === "ko"
                                ? "text-black font-medium"
                                : "text-gray-400 hover:text-black"
                                }`}
                        >
                            KO
                        </button>
                    </div>
                </div>

                {/* Blog List - Minimal Typography */}
                <div className="space-y-0">
                    {blogPosts.map((post, index) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block py-6 border-t border-gray-200 first:border-t-0 hover:bg-gray-50 transition-colors -mx-6 sm:-mx-8 px-6 sm:px-8"
                        >
                            <div className="flex items-start justify-between gap-8">
                                {/* Left: Title and Description */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-light text-gray-900 mb-1 group-hover:text-black transition-colors">
                                        {post.title[language]}
                                    </h3>
                                    <p className="text-xs text-gray-400 line-clamp-1">
                                        {post.description[language]}
                                    </p>
                                </div>

                                {/* Right: Date and Tags */}
                                <div className="flex items-center gap-6 flex-shrink-0">
                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="hidden sm:flex gap-2">
                                            {post.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] uppercase tracking-wider text-gray-400"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Date */}
                                    <span className="text-xs text-gray-400 tabular-nums">
                                        {post.date}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
