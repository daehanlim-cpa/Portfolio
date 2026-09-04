"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ResumeDrawer from "./ResumeDrawer";
import { ChatButton, ChatSheet } from "./ChatLauncher";
import Logo from "./Logo";

/**
 * Three destinations. The previous nav offered ALL / PROFESSIONAL / PROJECTS /
 * PURPOSE, which were four routes rendering the same grid through different
 * filters — navigation standing in for what a filter does better. "AI apps"
 * earns its place because it is a different kind of thing, not a filtered view:
 * software that runs here, rather than work described.
 */
const LINKS = [
    { href: "/", label: "Ask" },
    { href: "/experience", label: "Experience" },
    { href: "/ai", label: "AI apps" },
] as const;

/**
 * Exact match for the root, prefix match elsewhere — otherwise the underline
 * disappears on /ai/[slug], which reads as having navigated off the section.
 */
function isActive(pathname: string, href: string): boolean {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function CategoryNav() {
    const pathname = usePathname();
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const reduce = useReducedMotion();

    // On "/" the chat is already full-page; a sheet would duplicate it.
    const showChatButton = pathname !== "/";

    return (
        <>
            {/* Frosted via Tailwind's backdrop utilities rather than a raw
                backdrop-filter declaration in globals.css — that one was being
                dropped and computed to `none`, leaving the bar unblurred. */}
            <nav className="sticky top-0 z-50 border-b border-line-soft bg-white/80 backdrop-blur-xl backdrop-saturate-150">
                {/* Height derives from --nav-h minus this element's own hairline. */}
                <div className="mx-auto flex h-[calc(var(--nav-h)-1px)] max-w-content items-center gap-4 px-5 sm:px-8">
                    <Link
                        href="/"
                        aria-label="Home"
                        className="shrink-0 rounded-sm transition-opacity duration-200 hover:opacity-70"
                    >
                        <Logo />
                    </Link>

                    {/* Centre links. The underline is a shared layout element, so it
                        slides between items instead of cross-fading. */}
                    <div className="flex flex-1 items-center justify-center gap-1">
                        {LINKS.map(({ href, label }) => {
                            const active = isActive(pathname, href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className="relative px-3 py-2 text-caption transition-colors duration-200 sm:px-4"
                                >
                                    <span className={active ? "font-medium text-ink" : "text-ink-tertiary hover:text-ink"}>
                                        {label}
                                    </span>
                                    {active && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            aria-hidden
                                            transition={
                                                reduce
                                                    ? { duration: 0 }
                                                    : { type: "spring", stiffness: 460, damping: 38 }
                                            }
                                            className="absolute inset-x-3 -bottom-px h-[1.5px] rounded-full bg-ink sm:inset-x-4"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex shrink-0 items-center gap-0.5">
                        {showChatButton && <ChatButton onClick={() => setIsChatOpen(true)} />}
                        <button
                            onClick={() => setIsResumeOpen(true)}
                            aria-label="Open resume"
                            className="rounded-full p-2 text-ink-tertiary transition-colors duration-200 hover:bg-surface-muted hover:text-ink"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path
                                    d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinejoin="round"
                                />
                                <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                <path d="M9.5 13h5M9.5 16.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            <ResumeDrawer isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
            <ChatSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
}
