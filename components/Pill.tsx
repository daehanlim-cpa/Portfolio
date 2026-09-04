import React from "react";

/**
 * The chip that was inlined in four places with three near-identical class
 * strings. `tone` covers the variants that actually existed: filled for tech
 * stacks, outline for the résumé's certifications, and a semantic set for the
 * demo verdicts, where colour carries meaning rather than decoration.
 */
export type PillTone = "muted" | "outline" | "solid" | "positive" | "caution" | "critical";

const TONES: Record<PillTone, string> = {
    muted: "bg-surface-muted text-ink-secondary",
    outline: "border border-line-soft text-ink-secondary",
    solid: "bg-ink text-white",
    // Kept desaturated on purpose: these sit inside a near-monochrome page, and
    // saturated status colours would be the loudest thing on the screen.
    positive: "bg-emerald-50 text-emerald-800",
    caution: "bg-amber-50 text-amber-800",
    critical: "bg-rose-50 text-rose-800",
};

export default function Pill({
    children,
    tone = "muted",
    uppercase = false,
}: {
    children: React.ReactNode;
    tone?: PillTone;
    uppercase?: boolean;
}) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 ${
                uppercase ? "text-label uppercase" : "text-caption"
            } ${TONES[tone]}`}
        >
            {children}
        </span>
    );
}

/** A stack list. The `<ul>`/`<li>` wrapper the tech-stack sections all repeated. */
export function PillList({ items, tone = "muted" }: { items: string[]; tone?: PillTone }) {
    if (!items.length) return null;

    return (
        <ul className="flex flex-wrap gap-2">
            {items.map((item) => (
                <li key={item}>
                    <Pill tone={tone}>{item}</Pill>
                </li>
            ))}
        </ul>
    );
}
