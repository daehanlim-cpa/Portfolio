"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import RecruiterChat from "./RecruiterChat";

interface ChatSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChatButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="rounded-full p-2 opacity-50 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
            aria-label="Ask about Daehan"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}

export function ChatSheet({ isOpen, onClose }: ChatSheetProps) {
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
                        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px]"
                        aria-hidden
                    />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Ask about Daehan"
                        initial={reduce ? { opacity: 0 } : { y: "100%" }}
                        animate={reduce ? { opacity: 1 } : { y: 0 }}
                        exit={reduce ? { opacity: 0 } : { y: "100%" }}
                        transition={
                            reduce
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 380, damping: 40, mass: 0.9 }
                        }
                        drag={reduce ? false : "y"}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.35 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 120 || info.velocity.y > 600) onClose();
                        }}
                        className="fixed inset-x-0 bottom-0 z-[70] h-[88dvh] overflow-hidden rounded-t-[20px] border-t border-gray-200 bg-white shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[min(680px,82dvh)] sm:w-[420px] sm:rounded-[20px] sm:border"
                    >
                        <div className="flex h-full flex-col">
                            {/* Grabber only — the sheet is drag-to-dismiss, so a
                                Close button alongside it would be redundant. */}
                            <div className="flex justify-center px-4 pt-2.5 sm:hidden">
                                <div className="h-1 w-9 rounded-full bg-gray-300" aria-hidden />
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                className="absolute right-3 top-3 z-20 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path
                                        d="M18 6 6 18M6 6l12 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                            <div className="min-h-0 flex-1">
                                <RecruiterChat variant="compact" />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
