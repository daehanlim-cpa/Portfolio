"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChatSheet } from "@/components/ChatLauncher";
import Logo from "@/components/Logo";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
    { href: "/work", label: "Work" },
    { href: "/writing", label: "Writing" },
    { href: "/resume", label: "Resume" },
] as const;

/** A link is active on its own page and on anything nested under it. */
function isActive(pathname: string, href: string) {
    if (href === "/work") return pathname === "/work" || pathname.startsWith("/project/");
    if (href === "/writing") return pathname === "/writing" || pathname.startsWith("/blog/");
    return pathname === href;
}

export default function SiteNav() {
    const pathname = usePathname();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const reduce = useReducedMotion();

    // On /ask the chat is already the page; a sheet would duplicate it.
    const onAsk = pathname === "/ask";

    return (
        <>
            <nav className="glass sticky top-0 z-50 border-b border-line-soft backdrop-blur-xl backdrop-saturate-150">
                {/* Height derives from --nav-h minus this element's own hairline. */}
                <div className="mx-auto flex h-[calc(var(--nav-h)-1px)] max-w-content items-center gap-2 px-5 sm:gap-4 sm:px-8">
                    <Link
                        href="/"
                        aria-label="Daehan Lim, home"
                        className="shrink-0 rounded-sm transition-opacity duration-200 hover:opacity-70"
                    >
                        <Logo />
                    </Link>

                    <div className="flex flex-1 items-center justify-end gap-0.5 sm:justify-center">
                        {LINKS.map(({ href, label }) => {
                            const active = isActive(pathname, href);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    aria-current={active ? "page" : undefined}
                                    className="relative px-2.5 py-2 text-caption transition-colors duration-200 sm:px-4"
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
                                            className="absolute inset-x-2.5 -bottom-px h-[1.5px] rounded-full bg-ink sm:inset-x-4"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        <ThemeToggle />
                        {!onAsk && (
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="group flex items-center gap-1.5 rounded-full bg-ink py-1.5 pl-2.5 pr-3 text-caption font-medium text-on-ink transition-opacity duration-200 hover:opacity-85"
                            >
                                <span aria-hidden className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-on-ink opacity-60 motion-reduce:hidden" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-on-ink" />
                                </span>
                                <span>
                                    Ask<span className="hidden sm:inline"> AI</span>
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <ChatSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
    );
}
