"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import BlogSection from "@/components/BlogSection";

/**
 * One filter dimension, matching the data's own `type`. The previous build had
 * four nav destinations and a second row of skill-category chips on top of them
 * — two overlapping taxonomies for twelve items, which made the smaller
 * collection feel like it needed navigating rather than just looking at.
 */
const FILTERS = [
    { id: "all", label: "All" },
    { id: "professional", label: "Professional" },
    { id: "project", label: "Projects" },
    { id: "purpose", label: "Purpose" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

export default function ExperiencePage() {
    const [selected, setSelected] = useState<Project | null>(null);
    const [filter, setFilter] = useState<FilterId>("all");
    const reduce = useReducedMotion();

    const visible = useMemo(
        () => (filter === "all" ? projects : projects.filter((p) => p.type === filter)),
        [filter]
    );

    const step = (direction: 1 | -1) => {
        if (!selected) return;
        const i = visible.findIndex((p) => p.id === selected.id);
        if (i === -1) return;
        setSelected(visible[(i + direction + visible.length) % visible.length]);
    };

    return (
        <>
            <div className="min-h-screen px-6 pb-24 pt-16 sm:px-10 sm:pt-24">
                <div className="mx-auto max-w-content">
                    {/* Page header. States what this is, once, quietly. */}
                    <header className="mb-14 sm:mb-20">
                        <motion.h1
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="text-display-sm font-light text-ink sm:text-display"
                        >
                            Experience
                        </motion.h1>
                        <motion.p
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-4 max-w-prose text-body-lg font-light leading-relaxed text-ink-tertiary"
                        >
                            Client engagements, things I&rsquo;ve built on my own, and work
                            that isn&rsquo;t about the money. Select any one to read how it
                            was actually done.
                        </motion.p>
                    </header>

                    {/* Segmented filter. A single control, sized to its content. */}
                    <div className="mb-12 sm:mb-16">
                        <div
                            role="tablist"
                            aria-label="Filter experience by type"
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
                                        className="relative rounded-lg px-3.5 py-1.5 text-caption transition-colors duration-200 sm:px-4"
                                    >
                                        {/* The moving pill is the only element that animates,
                                            so the label text stays crisp throughout. */}
                                        {active && (
                                            <motion.span
                                                layoutId="filter-pill"
                                                aria-hidden
                                                transition={
                                                    reduce
                                                        ? { duration: 0 }
                                                        : { type: "spring", stiffness: 480, damping: 38 }
                                                }
                                                className="absolute inset-0 rounded-lg bg-surface shadow-subtle"
                                            />
                                        )}
                                        <span
                                            className={`relative z-10 ${
                                                active
                                                    ? "font-medium text-ink"
                                                    : "text-ink-tertiary hover:text-ink"
                                            }`}
                                        >
                                            {label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Grid */}
                    <motion.div
                        layout={!reduce}
                        className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 xl:grid-cols-5"
                    >
                        <AnimatePresence mode="popLayout" initial={false}>
                            {visible.map((project, i) => (
                                <motion.div
                                    key={project.id}
                                    layout={!reduce}
                                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                                    transition={
                                        reduce
                                            ? { duration: 0 }
                                            : {
                                                  duration: 0.4,
                                                  delay: Math.min(i * 0.025, 0.2),
                                                  ease: [0.16, 1, 0.3, 1],
                                              }
                                    }
                                >
                                    <ProjectCard
                                        project={project}
                                        onClick={() => setSelected(project)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {visible.length === 0 && (
                        <p className="py-16 text-center text-body text-ink-quaternary">
                            Nothing here yet.
                        </p>
                    )}
                </div>
            </div>

            <BlogSection />

            <footer className="border-t border-line-soft px-6 py-12 sm:px-10">
                <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-caption text-ink-quaternary">© 2026 Daehan Lim</p>
                    <nav className="flex gap-7">
                        <a
                            href="https://www.linkedin.com/in/daehan-lim-cpa/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-caption text-ink-tertiary transition-colors hover:text-ink"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="/resume"
                            className="text-caption text-ink-tertiary transition-colors hover:text-ink"
                        >
                            Resume
                        </a>
                        <a
                            href="mailto:daehanlim1@gmail.com"
                            className="text-caption text-ink-tertiary transition-colors hover:text-ink"
                        >
                            Email
                        </a>
                    </nav>
                </div>
            </footer>

            <ProjectModal
                project={selected}
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                onNext={() => step(1)}
                onPrevious={() => step(-1)}
            />
        </>
    );
}
