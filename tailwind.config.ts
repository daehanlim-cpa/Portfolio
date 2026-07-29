import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                ink: {
                    DEFAULT: "var(--ink)",
                    secondary: "var(--ink-secondary)",
                    tertiary: "var(--ink-tertiary)",
                    quaternary: "var(--ink-quaternary)",
                },
                surface: {
                    DEFAULT: "var(--surface)",
                    sunken: "var(--surface-sunken)",
                    muted: "var(--surface-muted)",
                },
                line: {
                    DEFAULT: "var(--line)",
                    soft: "var(--line-soft)",
                },
                accent: "var(--accent)",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
            },
            /*
             * Display sizes carry negative tracking and tight leading; body sizes
             * stay near-neutral. The jump between steps widens as sizes grow, so
             * hierarchy reads at a glance rather than requiring comparison.
             */
            fontSize: {
                "label": ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.06em" }],
                "caption": ["0.8125rem", { lineHeight: "1.45" }],
                "body": ["0.9375rem", { lineHeight: "1.6" }],
                "body-lg": ["1.0625rem", { lineHeight: "1.6" }],
                "title-sm": ["1.3125rem", { lineHeight: "1.3", letterSpacing: "-0.014em" }],
                "title": ["1.75rem", { lineHeight: "1.22", letterSpacing: "-0.019em" }],
                "display-sm": ["2.25rem", { lineHeight: "1.14", letterSpacing: "-0.024em" }],
                "display": ["3rem", { lineHeight: "1.06", letterSpacing: "-0.028em" }],
                "display-lg": ["4rem", { lineHeight: "1.02", letterSpacing: "-0.032em" }],
            },
            borderRadius: {
                sm: "var(--r-sm)",
                md: "var(--r-md)",
                lg: "var(--r-lg)",
                xl: "var(--r-xl)",
            },
            /*
             * Two-layer shadows: a tight contact shadow plus a wide diffuse one.
             * A single hard drop shadow reads as a sticker; this reads as lift.
             */
            boxShadow: {
                subtle: "0 1px 2px rgba(0,0,0,0.04)",
                raised: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -12px rgba(0,0,0,0.14)",
                lifted: "0 1px 2px rgba(0,0,0,0.05), 0 16px 40px -16px rgba(0,0,0,0.22)",
                floating: "0 2px 4px rgba(0,0,0,0.04), 0 24px 64px -24px rgba(0,0,0,0.26)",
            },
            transitionTimingFunction: {
                out: "cubic-bezier(0.16, 1, 0.3, 1)",
                "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
            },
            maxWidth: {
                prose: "42rem",
                content: "72rem",
            },
            keyframes: {
                "fade-up": {
                    from: { opacity: "0", transform: "translateY(8px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            },
        },
    },
    plugins: [],
};

export default config;
