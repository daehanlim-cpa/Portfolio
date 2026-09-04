"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Project } from "@/data/projects";
import { Icons } from "./ProjectIcons";
import ArchitectureFlow from "./ArchitectureFlow";
import Section from "./Section";
import { PillList } from "./Pill";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

export default function ProjectModal({ project, isOpen, onClose, onNext, onPrevious }: ProjectModalProps) {
    const reduce = useReducedMotion();

    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNext();
            if (e.key === "ArrowLeft") onPrevious();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = previous;
        };
    }, [isOpen, onClose, onNext, onPrevious]);

    if (!project) return null;

    const IconComponent = Icons[project.iconKey as keyof typeof Icons];

    /*
     * Diagrams are data now (project.architectureNodes). This used to be three
     * hardcoded `if (project.id === ...)` branches, which meant a fourth diagram
     * required editing this component. The mermaid <pre> remains the fallback
     * for projects that carry a diagram string but no nodes.
     */
    const architecture = () => {
        if (project.architectureNodes?.length) {
            return <ArchitectureFlow nodes={project.architectureNodes} />;
        }
        return (
            project.architectureDiagram && (
                <div className="overflow-x-auto rounded-lg bg-surface-sunken p-5">
                    <pre className="whitespace-pre font-mono text-[11px] leading-relaxed text-ink-tertiary">
                        {project.architectureDiagram}
                    </pre>
                </div>
            )
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={project.title}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.99, y: 8 }}
                    transition={
                        reduce
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 320, damping: 34, mass: 0.9 }
                    }
                    className="fixed inset-0 z-[70] overflow-y-auto bg-surface"
                >
                    {/* One toolbar holding all three controls, instead of three
                        separately positioned floating buttons. Solid rather than
                        frosted: the sheet behind it is plain white, so
                        translucency would buy nothing and only risk the scrolling
                        text showing through the bar. */}
                    <div className="sticky top-0 z-10 border-b border-line-soft bg-surface">
                        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5 sm:h-16 sm:px-8">
                            <button
                                onClick={onClose}
                                className="-ml-2 flex items-center gap-1.5 rounded-full px-2 py-1.5 text-caption text-ink-tertiary transition-colors hover:text-ink"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back
                            </button>

                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={onPrevious}
                                    aria-label="Previous project"
                                    className="rounded-full p-2 text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink"
                                >
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button
                                    onClick={onNext}
                                    aria-label="Next project"
                                    className="rounded-full p-2 text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink"
                                >
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button
                                    onClick={onClose}
                                    aria-label="Close"
                                    className="ml-1 rounded-full p-2 text-ink-tertiary transition-colors hover:bg-surface-muted hover:text-ink"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <article className="mx-auto max-w-3xl px-6 pb-28 pt-14 sm:px-8 sm:pt-20">
                        {/* Title block. The icon is small here — at 256px it was
                            competing with the title for first read. */}
                        <header className="mb-16 sm:mb-20">
                            <div className="mb-8 h-12 w-12 text-ink-secondary sm:h-14 sm:w-14">
                                {IconComponent && <IconComponent />}
                            </div>
                            <p className="text-label uppercase tabular-nums text-ink-quaternary">{project.code}</p>
                            <h2 className="mt-3 text-display-sm font-light text-ink sm:text-display">
                                {project.title}
                            </h2>
                            <p className="mt-5 max-w-prose text-body-lg font-light leading-relaxed text-ink-tertiary">
                                {project.shortDescription}
                            </p>
                        </header>

                        <div className="space-y-16 sm:space-y-20">
                            {project.overview && (
                                <Section title="Overview" as="h3">
                                    <p className="text-body leading-[1.75] text-ink-secondary">{project.overview}</p>
                                </Section>
                            )}

                            <Section title="Problem & baseline" as="h3">
                                <ol className="space-y-5">
                                    {project.problem.map((item, i) => (
                                        <li key={i} className="flex gap-4">
                                            <span className="mt-[3px] w-5 shrink-0 text-label tabular-nums text-ink-quaternary">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <span className="text-body leading-[1.7] text-ink-secondary">{item}</span>
                                        </li>
                                    ))}
                                </ol>

                                {project.baselineKPIs && (
                                    <dl className="mt-8 grid gap-px overflow-hidden rounded-lg bg-line-soft sm:grid-cols-2">
                                        {project.baselineKPIs.map((kpi, i) => {
                                            const [term, ...rest] = kpi.split(":");
                                            const value = rest.join(":").trim();
                                            return (
                                                <div key={i} className="bg-surface-sunken px-5 py-4">
                                                    <dt className="text-label uppercase text-ink-quaternary">{term}</dt>
                                                    <dd className="mt-1 text-caption text-ink-secondary">{value || term}</dd>
                                                </div>
                                            );
                                        })}
                                    </dl>
                                )}
                            </Section>

                            <Section title="Solution" as="h3">
                                {project.solution && (
                                    <p className="text-body leading-[1.75] text-ink-secondary">{project.solution}</p>
                                )}

                                {project.keyCapabilities && (
                                    <ul className="mt-8 space-y-3">
                                        {project.keyCapabilities.map((cap, i) => (
                                            <li key={i} className="flex gap-3 text-body leading-[1.7] text-ink-secondary">
                                                <span aria-hidden className="mt-[0.6em] h-[3px] w-[3px] shrink-0 rounded-full bg-ink-quaternary" />
                                                <span>{cap}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {project.approach.length > 0 && (
                                    <div className="mt-10">
                                        <p className="mb-4 text-label uppercase text-ink-quaternary">Approach</p>
                                        <ol className="space-y-4 border-l border-line-soft pl-5">
                                            {project.approach.map((step, i) => (
                                                <li key={i} className="text-body leading-[1.7] text-ink-secondary">
                                                    {step}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </Section>

                            {(project.architectureNodes || project.architectureDiagram || project.architectureComponents) && (
                                <Section title="Architecture" as="h3">
                                    {architecture()}

                                    {project.architectureComponents && (
                                        <dl className="mt-6 grid gap-px overflow-hidden rounded-lg bg-line-soft">
                                            {project.architectureComponents.map((comp, i) => {
                                                const [term, ...rest] = comp.split(":");
                                                const value = rest.join(":").trim();
                                                return (
                                                    <div key={i} className="bg-surface-sunken px-5 py-4">
                                                        <dt className="text-label uppercase text-ink-quaternary">{term}</dt>
                                                        {value && (
                                                            <dd className="mt-1.5 text-caption leading-relaxed text-ink-secondary">{value}</dd>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </dl>
                                    )}
                                </Section>
                            )}

                            {project.governance && (
                                <Section title="Governance & reliability" as="h3">
                                    <ul className="space-y-3.5">
                                        {project.governance.map((item, i) => (
                                            <li key={i} className="flex gap-3 text-body leading-[1.7] text-ink-secondary">
                                                <svg className="mt-[0.3em] h-4 w-4 shrink-0 text-ink-quaternary" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                                                    <path d="M8.5 12.2l2.3 2.3 4.7-4.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Section>
                            )}

                            <Section title="Value delivered" as="h3">
                                <ul className="grid gap-px overflow-hidden rounded-lg bg-line-soft">
                                    {project.impact.map((result, i) => (
                                        <li key={i} className="bg-surface-sunken px-5 py-5">
                                            <span className="text-label uppercase tabular-nums text-ink-quaternary">
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <p className="mt-2 text-body leading-[1.7] text-ink">{result}</p>
                                        </li>
                                    ))}
                                </ul>
                            </Section>

                            <div className="border-t border-line-soft pt-10">
                                <p className="mb-4 text-label uppercase text-ink-quaternary">Stack</p>
                                <PillList items={project.techStack} />

                                {(project.links.demo || project.links.repo || project.links.pdf) && (
                                    <div className="mt-9 flex flex-wrap gap-3">
                                        {project.links.demo && (
                                            <a
                                                href={project.links.demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-full bg-ink px-5 py-2.5 text-caption font-medium text-white transition-opacity hover:opacity-85"
                                            >
                                                Live demo
                                            </a>
                                        )}
                                        {project.links.repo && (
                                            <a
                                                href={project.links.repo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-full border border-line px-5 py-2.5 text-caption text-ink transition-colors hover:bg-surface-muted"
                                            >
                                                View code
                                            </a>
                                        )}
                                        {project.links.pdf && (
                                            <a
                                                href={project.links.pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-full border border-line px-5 py-2.5 text-caption text-ink transition-colors hover:bg-surface-muted"
                                            >
                                                Case study
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between border-t border-line-soft pt-10">
                                <button
                                    onClick={onPrevious}
                                    className="text-caption text-ink-tertiary transition-colors hover:text-ink"
                                >
                                    ← Previous
                                </button>
                                <button
                                    onClick={onNext}
                                    className="text-caption text-ink-tertiary transition-colors hover:text-ink"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </article>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
