import React from "react";

/**
 * Section label + hairline. One treatment, used everywhere, so nothing shouts.
 *
 * This existed twice — once in ProjectModal and once in app/project/[id] — with
 * the same intent and slightly different markup. Shared now, with `as` covering
 * the one real difference: the modal is a dialog under an <h2>, the route page
 * is a document under an <h1>, so the heading level has to differ.
 */
export default function Section({
    title,
    aside,
    as: Heading = "h2",
    children,
}: {
    title: string;
    aside?: string;
    as?: "h2" | "h3";
    children: React.ReactNode;
}) {
    return (
        <section>
            <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-line-soft pb-2.5">
                <Heading className="text-label uppercase text-ink-tertiary">{title}</Heading>
                {aside && <span className="text-label text-ink-quaternary">{aside}</span>}
            </div>
            {children}
        </section>
    );
}

/** The dotted-bullet list used for problem and approach copy. */
export function Dashed({ items }: { items: string[] }) {
    return (
        <ul className="space-y-3.5">
            {items.map((item, i) => (
                <li key={i} className="flex gap-3 text-body leading-[1.7] text-ink-secondary">
                    <span
                        aria-hidden
                        className="mt-[0.6em] h-[3px] w-[3px] shrink-0 rounded-full bg-ink-quaternary"
                    />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

/**
 * The "Label: value" hairline grid. `architectureComponents`, `baselineKPIs` and
 * the new infrastructure lists all use the same authoring convention — split on
 * the first colon — so they share one renderer.
 */
export function DefinitionGrid({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
    if (!items.length) return null;

    return (
        <dl
            className={`grid gap-px overflow-hidden rounded-lg bg-line-soft ${
                columns === 2 ? "sm:grid-cols-2" : ""
            }`}
        >
            {items.map((item, i) => {
                const [term, ...rest] = item.split(":");
                const value = rest.join(":").trim();
                return (
                    <div key={i} className="bg-surface-sunken px-5 py-4">
                        <dt className="text-label uppercase text-ink-quaternary">{term}</dt>
                        {value && (
                            <dd className="mt-1.5 text-caption leading-relaxed text-ink-secondary">
                                {value}
                            </dd>
                        )}
                    </div>
                );
            })}
        </dl>
    );
}
