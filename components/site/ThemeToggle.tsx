"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Runs in <head> before first paint, so a dark-mode visitor never sees a white
 * flash. An explicit choice is stored; with none, the CSS follows the OS.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;}catch(e){}})();`;

function currentTheme(): Theme {
    const explicit = document.documentElement.dataset.theme;
    if (explicit === "light" || explicit === "dark") return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
    // Unknown until mounted: the server can't see the visitor's preference.
    const [theme, setTheme] = useState<Theme | null>(null);

    useEffect(() => setTheme(currentTheme()), []);

    const toggle = () => {
        const next: Theme = currentTheme() === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
            localStorage.setItem("theme", next);
        } catch {
            // Private mode or blocked storage: the switch still works for this visit.
        }
        setTheme(next);
    };

    return (
        <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="rounded-full p-2 text-ink-tertiary transition-colors duration-200 hover:bg-surface-muted hover:text-ink"
        >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                {theme === "dark" ? (
                    <>
                        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
                        <path
                            d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </>
                ) : (
                    <path
                        d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                )}
            </svg>
        </button>
    );
}
