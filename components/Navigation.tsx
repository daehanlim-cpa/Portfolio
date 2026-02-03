"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import Logo from "./Logo";

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when clicking a link
    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-white/80 backdrop-blur-md shadow-sm"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-content mx-auto px-6 md:px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="relative z-50"
                        onClick={handleLinkClick}
                    >
                        <Logo />
                    </Link>

                    {/* Desktop Navigation - Hidden on mobile */}
                    <div className="hidden md:flex items-center gap-8">
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

                    {/* Mobile Hamburger Button - Visible only on mobile */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden relative z-50 w-11 h-11 flex items-center justify-center"
                        aria-label="Toggle menu"
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span
                                className={`w-full h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                                    }`}
                            />
                            <span
                                className={`w-full h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""
                                    }`}
                            />
                            <span
                                className={`w-full h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                                    }`}
                            />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-white z-40 md:hidden transition-all duration-300 ${isMobileMenuOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
                    <Link
                        href="/projects"
                        className="text-2xl font-light hover:opacity-70 transition-opacity"
                        onClick={handleLinkClick}
                    >
                        Projects
                    </Link>
                    <Link
                        href="/resume"
                        className="text-2xl font-light hover:opacity-70 transition-opacity"
                        onClick={handleLinkClick}
                    >
                        Resume
                    </Link>
                    <Link
                        href="#contact"
                        className="text-2xl font-light hover:opacity-70 transition-opacity"
                        onClick={handleLinkClick}
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </>
    );
}
