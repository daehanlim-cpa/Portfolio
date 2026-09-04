import React from "react";

/**
 * A stage in a left-to-right architecture diagram.
 *
 * These used to be JSX literals hardcoded behind `if (project.id === ...)`
 * checks inside ProjectModal, which meant a fourth diagram required editing a
 * component. They are data now, so a diagram is authored beside the case study
 * it belongs to.
 */
export interface FlowNode {
    label: string;
    value: string;
    unit?: string;
    /** Filled treatment. Reserve it for the stages you actually built. */
    emphasis?: boolean;
}

/** A labelled node in the flow diagrams. */
export function Node({ label, value, unit, emphasis = false }: FlowNode) {
    return (
        <div className="flex shrink-0 flex-col items-center">
            <div
                className={`flex h-[86px] w-[86px] flex-col items-center justify-center rounded-full border transition-colors ${
                    emphasis
                        ? "border-transparent bg-ink text-white shadow-raised"
                        : "border-line-soft bg-surface text-ink"
                }`}
            >
                <span
                    className={`text-[9px] uppercase tracking-[0.08em] ${
                        emphasis ? "text-white/55" : "text-ink-quaternary"
                    }`}
                >
                    {label}
                </span>
                <span className="mt-0.5 text-body font-light tabular-nums">{value}</span>
                {unit && (
                    <span
                        className={`text-[9px] uppercase tracking-[0.08em] ${
                            emphasis ? "text-white/55" : "text-ink-quaternary"
                        }`}
                    >
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}

export function Flow({ children, label }: { children: React.ReactNode; label?: string }) {
    return (
        /*
         * A horizontally scrolling region needs to be reachable without a mouse:
         * four nodes fit the 3xl column, six do not, and on a phone none of them
         * do. tabIndex makes it scrollable by keyboard, and the group role plus
         * label stop it announcing as an unlabelled scroll box.
         */
        <div
            tabIndex={0}
            role="group"
            aria-label={label ?? "Architecture diagram, scrolls horizontally"}
            className="-mx-1 overflow-x-auto py-8 scrollbar-hide"
        >
            {/* The hairline is inset by half a node (43px of the 86px circle) at
                each end, so it connects the outer nodes' centres instead of
                running past them to the container edge. */}
            <div className="relative flex min-w-max items-start gap-10 px-1 sm:gap-14">
                <div
                    aria-hidden
                    className="absolute left-[43px] right-[43px] top-[43px] h-px bg-line-soft"
                />
                {children}
            </div>
        </div>
    );
}

/**
 * The whole diagram from data. Renders nothing for an empty list, so callers can
 * pass an optional field straight through without guarding.
 */
export default function ArchitectureFlow({ nodes, label }: { nodes?: FlowNode[]; label?: string }) {
    if (!nodes?.length) return null;

    return (
        <Flow label={label}>
            {nodes.map((node, i) => (
                <Node key={`${node.label}-${i}`} {...node} />
            ))}
        </Flow>
    );
}
