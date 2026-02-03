"use client";

import { motion } from "framer-motion";

export default function Logo() {
    return (
        <div className="flex items-center gap-2 group cursor-pointer">
            {/* Minimalist Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                >
                    {/* Abstract DL Monogram / Minimal Shape */}
                    <path
                        d="M7 7H14C15.6569 7 17 8.34315 17 10V14C17 15.6569 15.6569 17 14 17H7V7Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Text Logo */}
            <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight leading-none text-gray-900 group-hover:text-black transition-colors">
                    Daehan Lim
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase group-hover:text-gray-700 transition-colors">
                    Portfolio
                </span>
            </div>
        </div>
    );
}
