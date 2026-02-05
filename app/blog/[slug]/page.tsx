"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { blogPosts } from "@/data/blog";

type Language = "ko" | "en";

export default function BlogPostPage() {
    const params = useParams();
    const [language, setLanguage] = useState<Language>("en");

    // Find the blog post by slug
    const post = blogPosts.find((p) => p.slug === params?.slug);

    if (!post) {
        notFound();
    }

    // Simple markdown-to-HTML converter for basic formatting
    const formatContent = (content: string) => {
        let firstH1Skipped = false;

        return content
            .split('\n')
            .map((line, index) => {
                // Headers
                if (line.startsWith('### ')) {
                    return `<h3 key="${index}" class="text-base font-light text-gray-900 mt-8 mb-3">${line.slice(4)}</h3>`;
                }
                if (line.startsWith('## ')) {
                    return `<h2 key="${index}" class="text-lg font-light text-gray-900 mt-12 mb-4">${line.slice(3)}</h2>`;
                }
                if (line.startsWith('# ')) {
                    // Skip the first H1 header (it's already shown as the page title)
                    if (!firstH1Skipped) {
                        firstH1Skipped = true;
                        return '';
                    }
                    return `<h1 key="${index}" class="text-2xl font-light text-gray-900 mb-8">${line.slice(2)}</h1>`;
                }

                // Bold text
                line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium">$1</strong>');

                // List items
                if (line.trim().startsWith('- ')) {
                    return `<li key="${index}" class="text-sm text-gray-700 leading-relaxed ml-4">${line.slice(2)}</li>`;
                }

                // Numbered lists
                if (line.match(/^\d+\.\s/)) {
                    return `<li key="${index}" class="text-sm text-gray-700 leading-relaxed ml-4">${line.replace(/^\d+\.\s/, '')}</li>`;
                }

                // Empty lines
                if (line.trim() === '') {
                    return `<div key="${index}" class="h-4"></div>`;
                }

                // Horizontal rule
                if (line.trim() === '---') {
                    return `<hr key="${index}" class="my-12 border-gray-200" />`;
                }

                // Regular paragraphs
                return `<p key="${index}" class="text-sm text-gray-700 leading-relaxed">${line}</p>`;
            })
            .join('');
    };

    return (
        <div className="min-h-screen px-6 sm:px-8 py-20">
            <div className="max-w-3xl mx-auto">
                {/* Header with Back Button and Language Toggle */}
                <div className="mb-12 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-xs uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
                    >
                        ← Back
                    </Link>

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

                {/* Post Metadata */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                    <h1 className="text-2xl font-light text-gray-900 mb-3">
                        {post.title[language]}
                    </h1>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="tabular-nums">{post.date}</span>
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-2">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] uppercase tracking-wider"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Post Content */}
                <article
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatContent(post.content[language]) }}
                />

                {/* LinkedIn Contact Section */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            {language === "ko"
                                ? "궁금한 점이 있으시거나 더 이야기하고 싶으시다면"
                                : "Have questions or want to connect?"}
                        </p>
                        <a
                            href="https://www.linkedin.com/in/daehan-lim-cpa/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-xs uppercase tracking-wider text-gray-900 hover:text-gray-600 transition-colors border-b border-gray-900 hover:border-gray-600 pb-0.5"
                        >
                            {language === "ko" ? "링크드인에서 메시지 보내기" : "Message me on LinkedIn"}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
