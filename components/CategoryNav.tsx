"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import ResumeDrawer from "./ResumeDrawer";
import { ChatButton, ChatSheet } from "./ChatLauncher";
import Logo from "./Logo";

export default function CategoryNav() {
    const pathname = usePathname();
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // On /chat the full-page chat is already on screen; a sheet would duplicate it.
    const showChatButton = pathname !== "/chat";

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
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-gray-200/80">
                <div className="px-6 sm:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                        {/* Top Row on Mobile: Name & Resume Icon */}
                        <div className="w-full sm:w-auto flex items-center justify-between">
                            <Link href="/" className="hover:opacity-80 transition-opacity">
                                <Logo />
                            </Link>

                            {/* Chat + Resume Icons - Visible here on mobile, move to right on desktop */}
                            <div className="sm:hidden flex items-center -mr-2">
                                {showChatButton && <ChatButton onClick={() => setIsChatOpen(true)} />}
                                <button
                                    onClick={() => setIsResumeOpen(true)}
                                    className="rounded-full p-2 opacity-50 hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
                                    aria-label="Open Resume"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 6V4C6 2.89543 6.89543 2 8 2H16C17.1046 2 18 2.89543 18 4V6H22V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V6H6ZM8 6H16V4H8V6Z" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Center - Type Categories - Scrollable on mobile - Hidden on /resume */}
                        {pathname !== '/resume' && (
                            <div className="w-full sm:flex-1 flex justify-start sm:justify-center overflow-x-auto sm:overflow-visible scrollbar-hide pb-1 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0">
                                <div className="flex gap-6 sm:gap-8 min-w-max">
                                    <Link
                                        href="/"
                                        className={`text-[10px] sm:text-xs uppercase tracking-wider transition-colors hover:text-black ${activeType === "all"
                                            ? "text-black font-medium"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        ALL
                                    </Link>
                                    <Link
                                        href="/professional"
                                        className={`text-[10px] sm:text-xs uppercase tracking-wider transition-colors hover:text-black ${activeType === "professional"
                                            ? "text-black font-medium"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        PROFESSIONAL
                                    </Link>
                                    <Link
                                        href="/projects"
                                        className={`text-[10px] sm:text-xs uppercase tracking-wider transition-colors hover:text-black ${activeType === "project"
                                            ? "text-black font-medium"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        PROJECTS
                                    </Link>
                                    <Link
                                        href="/purpose"
                                        className={`text-[10px] sm:text-xs uppercase tracking-wider transition-colors hover:text-black ${activeType === "purpose"
                                            ? "text-black font-medium"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        PURPOSE
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Right - Chat + Resume Icons - Hidden on mobile, visible on desktop */}
                        <div className="hidden sm:flex items-center -mr-2">
                            {showChatButton && <ChatButton onClick={() => setIsChatOpen(true)} />}
                            <button
                                onClick={() => setIsResumeOpen(true)}
                                className="rounded-full p-2 opacity-50 hover:opacity-100 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
                                aria-label="Open Resume"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6V4C6 2.89543 6.89543 2 8 2H16C17.1046 2 18 2.89543 18 4V6H22V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V6H6ZM8 6H16V4H8V6Z" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <ResumeDrawer isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
            <ChatSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
}
