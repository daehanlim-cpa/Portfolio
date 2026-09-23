import type { Project } from "@/data/projects";

/**
 * Word-valued metrics ("Weekly → Daily", "Independent") are far wider than
 * numeric ones at the same size and wrap mid-phrase, so they step down a size.
 */
export function isLongMetric(value: string) {
    return value.length > 8;
}

/**
 * The picture for a case study is its scorecard. Client work can't be
 * screenshotted, and the numbers are the more honest image anyway.
 */
export default function WorkVisual({ project, count = 2 }: { project: Project; count?: number }) {
    const shown = project.metrics.slice(0, count);

    return (
        <dl className={`grid gap-6 ${shown.length > 1 ? "grid-cols-2" : ""}`}>
            {shown.map((m) => (
                <div key={m.label} className="border-t border-line pt-4">
                    <dd
                        className={`font-semibold tracking-[-0.025em] text-ink ${
                            isLongMetric(m.value) ? "text-title-sm sm:text-title" : "text-title sm:text-display-sm"
                        }`}
                    >
                        {m.value}
                    </dd>
                    <dt className="mt-1.5 text-caption leading-snug text-ink-tertiary">{m.label}</dt>
                </div>
            ))}
        </dl>
    );
}
