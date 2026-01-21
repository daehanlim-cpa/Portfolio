"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";

interface ResumeDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ResumeDrawer({ isOpen, onClose }: ResumeDrawerProps) {
    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-[60] cursor-crosshair"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
                        className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white z-[70] border-l border-gray-200 overflow-y-auto"
                    >
                        <div className="p-6 md:p-10 min-h-full flex flex-col">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-12">
                                <h2 className="text-sm font-bold tracking-widest uppercase">
                                    BIO
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-sm font-bold tracking-widest uppercase hover:text-gray-500 transition-colors"
                                >
                                    CLOSE
                                </button>
                            </div>

                            {/* Content */}
                            <div className="space-y-12 flex-1">
                                {/* Contact Info Group */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold tracking-widest uppercase mb-6">
                                        CONTACT INFORMATION
                                    </h3>

                                    <div className="border border-black p-4 uppercase text-xs tracking-wide space-y-4">
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-500">NAME</span>
                                            <span>DAEHAN LIM</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-2">
                                            <span className="text-gray-500">EMAIL</span>
                                            <span>DAEHANLIM1@GMAIL.COM</span>
                                        </div>
                                        <div className="flex justify-between pt-2">
                                            <span className="text-gray-500">LINKS</span>
                                            <div className="flex gap-4">
                                                <a href="https://linkedin.com/in/daehan-lim-cpa" target="_blank" className="hover:underline">LINKEDIN</a>
                                                <a href="https://github.com/daehanlim-cpa" target="_blank" className="hover:underline">GITHUB</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Experience */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold tracking-widest uppercase border-b border-black pb-2 mb-6 flex justify-between">
                                        <span>PROFESSIONAL EXPERIENCE</span>
                                        <span>QTY: 3</span>
                                    </h3>

                                    {/* Company Header */}
                                    <div className="text-xs font-bold tracking-wide mb-4">
                                        ERNST & YOUNG
                                    </div>

                                    <div className="space-y-6 pl-4">
                                        {/* Role 1 */}
                                        <div className="flex justify-between text-xs tracking-wide">
                                            <div className="space-y-1">
                                                <p className="font-bold">AI & DATA MANAGER</p>
                                            </div>
                                            <div className="text-right font-mono text-[10px] text-gray-400">
                                                JUL 2024 - PRESENT
                                            </div>
                                        </div>

                                        {/* Role 2 */}
                                        <div className="flex justify-between text-xs tracking-wide">
                                            <div className="space-y-1">
                                                <p className="font-bold">AI & DATA SENIOR</p>
                                            </div>
                                            <div className="text-right font-mono text-[10px] text-gray-400">
                                                JUL 2021 - JUL 2024
                                            </div>
                                        </div>

                                        {/* Role 3 */}
                                        <div className="flex justify-between text-xs tracking-wide">
                                            <div className="space-y-1">
                                                <p className="font-bold">ENTERPRISE RISK STAFF</p>
                                            </div>
                                            <div className="text-right font-mono text-[10px] text-gray-400">
                                                SEP 2019 - JUL 2021
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold tracking-widest uppercase border-b border-black pb-2 mb-6 flex justify-between">
                                        <span>EDUCATION</span>
                                        <span>QTY: 2 + 1 IN FLIGHT</span>
                                    </h3>

                                    <div className="space-y-8">
                                        {/* University 1 */}
                                        <div>
                                            <div className="text-xs font-bold tracking-wide mb-3">
                                                UNIVERSITY OF THE CUMBERLANDS
                                            </div>
                                            <div className="space-y-4 pl-4">
                                                <div className="flex justify-between text-xs tracking-wide">
                                                    <p className="font-medium">PHD IN INFORMATION TECHNOLOGY IN AI</p>
                                                    <div className="text-right font-mono text-[10px] text-gray-400 whitespace-nowrap ml-4">
                                                        EST. 2027
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-xs tracking-wide">
                                                    <p className="font-medium">MS IN GLOBAL BUSINESS IN BLOCKCHAIN TECHNOLOGY</p>
                                                    <div className="text-right font-mono text-[10px] text-gray-400 whitespace-nowrap ml-4">
                                                        AUG 2024
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* University 2 */}
                                        <div>
                                            <div className="text-xs font-bold tracking-wide mb-3">
                                                UNIVERSITY OF ARIZONA
                                            </div>
                                            <div className="pl-4">
                                                <div className="flex justify-between text-xs tracking-wide">
                                                    <p className="font-medium">BS IN ACCOUNTING AND MANAGEMENT INFORMATION SYSTEMS</p>
                                                    <div className="text-right font-mono text-[10px] text-gray-400 whitespace-nowrap ml-4">
                                                        MAY 2019
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer / Total */}
                                <div className="border-t border-black pt-6 mt-auto">
                                    <div className="flex justify-between text-sm font-bold tracking-widest uppercase">
                                        <span>TOTAL EXPERIENCE</span>
                                        <span>7 YEARS</span>
                                    </div>
                                    <div className="mt-8">
                                        <Link
                                            href="/resume"
                                            onClick={onClose}
                                            className="block w-full bg-black text-white text-center py-4 text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors uppercase"
                                        >
                                            VIEW FULL RESUME
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
