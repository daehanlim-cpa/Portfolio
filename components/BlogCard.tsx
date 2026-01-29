"use client";

import { BlogPost } from "@/data/blog";
import Image from "next/image";

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <a
            href={post.link || "#"}
            className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Title */}
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
                    {post.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {post.description}
                </p>

                {/* Footer: Date and Tags */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.date}</span>
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-gray-100 rounded text-gray-600"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </a>
    );
}
