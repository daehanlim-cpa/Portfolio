"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-content mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-lg font-normal tracking-tight hover:opacity-70 transition-opacity"
                >
                    Daehan Lim
                </Link>

                <div className="flex items-center gap-8">
                    <Link
                        href="/projects"
                        className="text-sm hover:opacity-70 transition-opacity"
                    >
                        Projects
                    </Link>
                    <Link
                        href="/resume"
                        className="text-sm hover:opacity-70 transition-opacity"
                    >
                        Resume
                    </Link>
                    <Link
                        href="#contact"
                        className="text-sm hover:opacity-70 transition-opacity"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
}
