"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ResumeDrawer from "./ResumeDrawer";

export default function CategoryNav() {
    const pathname = usePathname();
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    // Determine active type from URL
    const getActiveType = () => {
        if (pathname === "/projects") return "project";
        if (pathname === "/purpose") return "purpose";
        if (pathname === "/professional") return "professional";
        if (pathname === "/") return "all";
        return "all";
    };

    const activeType = getActiveType();

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="px-8 py-6">
                    <div className="flex items-center justify-between">
                        {/* Left - Name */}
                        <Link href="/" className="text-sm font-light tracking-tight">
                            Daehan Lim
                        </Link>

                        {/* Center - Type Categories */}
                        <div className="flex-1 flex justify-center gap-8">
                            <Link
                                href="/"
                                className={`text-xs uppercase tracking-wider transition-colors hover:text-black ${activeType === "all"
                                    ? "text-black font-medium"
                                    : "text-gray-400"
                                    }`}
                            >
                                ALL
                            </Link>
                            <Link
                                href="/professional"
                                className={`text-xs uppercase tracking-wider transition-colors hover:text-black ${activeType === "professional"
                                    ? "text-black font-medium"
                                    : "text-gray-400"
                                    }`}
                            >
                                PROFESSIONAL
                            </Link>
                            <Link
                                href="/projects"
                                className={`text-xs uppercase tracking-wider transition-colors hover:text-black ${activeType === "project"
                                    ? "text-black font-medium"
                                    : "text-gray-400"
                                    }`}
                            >
                                PROJECTS
                            </Link>
                            <Link
                                href="/purpose"
                                className={`text-xs uppercase tracking-wider transition-colors hover:text-black ${activeType === "purpose"
                                    ? "text-black font-medium"
                                    : "text-gray-400"
                                    }`}
                            >
                                PURPOSE
                            </Link>
                        </div>

                        {/* Right - Resume Bag Icon */}
                        <button
                            onClick={() => setIsResumeOpen(true)}
                            className="p-2 -mr-2 opacity-50 hover:opacity-100 transition-opacity"
                            aria-label="Open Resume"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 6V4C6 2.89543 6.89543 2 8 2H16C17.1046 2 18 2.89543 18 4V6H22V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V6H6ZM8 6H16V4H8V6Z" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <ResumeDrawer isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
        </>
    );
}
