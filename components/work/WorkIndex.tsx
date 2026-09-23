"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import WorkVisual from "./WorkVisual";
import { projects, type Project } from "@/data/projects";

const FILTERS = [
    { id: "all", label: "All" },
    { id: "professional", label: "Client work" },
    { id: "project", label: "Independent" },
    { id: "purpose", label: "Purpose" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const TYPE_LABEL: Record<Project["type"], string> = {
    professional: "Client engagement",
    project: "Independent build",
    purpose: "Pro bono",
};

export default function WorkIndex() {
    const [filter, setFilter] = useState<FilterId>("all");
    const reduce = useReducedMotion();

    const visible = useMemo(
        () => (filter === "all" ? projects : projects.filter((p) => p.type === filter)),
        [filter]
    );

    const count = (id: FilterId) => (id === "all" ? projects.length : projects.filter((p) => p.type === id).length);

    return (
        <>
            {/* Segmented filter. The moving pill is the only animated element,
                so label text stays crisp throughout. */}
            <div className="mb-12 overflow-x-auto scrollbar-hide sm:mb-14">
                <div
                    role="tablist"
                    aria-label="Filter work by type"
                    className="inline-flex gap-1 rounded-xl border border-line-soft bg-surface-muted p-1"
                >
                    {FILTERS.map(({ id, label }) => {
                        const active = filter === id;
                        return (
                            <button
                                key={id}
                                role="tab"
                                aria-selected={active}
                                onClick={() => setFilter(id)}
                                className="relative whitespace-nowrap rounded-lg px-3.5 py-1.5 text-caption sm:px-4"
                            >
                                {active && (
                                    <motion.span
                                        layoutId="work-filter-pill"
                                        aria-hidden
                                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 38 }}
                                        className="absolute inset-0 rounded-lg bg-surface-raised shadow-subtle"
                                    />
                                )}
                                <span className={`relative z-10 ${active ? "font-medium text-ink" : "text-ink-tertiary hover:text-ink"}`}>
                                    {label}
                                    <span className="ml-1.5 tabular-nums text-ink-quaternary">{count(id)}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <motion.ul layout={!reduce} className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout" initial={false}>
                    {visible.map((project, i) => (
                        <motion.li
                            key={project.id}
                            layout={!reduce}
                            initial={reduce ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
                            transition={reduce ? { duration: 0 } : { duration: 0.45, delay: Math.min(i * 0.03, 0.24), ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href={`/project/${project.id}`} className="group block">
                                <div className="transition-[transform,box-shadow] duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-lifted rounded-xl">
                                    <WorkVisual project={project} size="sm" />
                                </div>
                                <p className="mt-5 text-label uppercase text-ink-quaternary">{TYPE_LABEL[project.type]}</p>
                                <h2 className="mt-2 text-title-sm font-normal text-ink">{project.title}</h2>
                                <p className="mt-2 text-caption leading-relaxed text-ink-tertiary">{project.shortDescription}</p>
                            </Link>
                        </motion.li>
                    ))}
                </AnimatePresence>
            </motion.ul>
        </>
    );
}
