"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Icons } from "@/components/ProjectIcons";
import Pill from "@/components/Pill";
import { PIPELINE_SHAPE, type AiApp } from "@/data/ai-apps";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function AiIndex({ apps }: { apps: AiApp[] }) {
    const reduce = useReducedMotion();

    return (
        <main className="mx-auto max-w-content px-6 pb-24 pt-16 sm:px-10 sm:pt-24">
            <motion.header
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }}
                className="max-w-prose"
            >
                <p className="text-label uppercase text-ink-quaternary">Working software</p>
                <h1 className="mt-3 text-display-sm font-light text-ink sm:text-display">
                    AI applications
                </h1>
                <p className="mt-5 text-body-lg font-light leading-relaxed text-ink-tertiary">
                    Two proof-of-concept applications, built to be run rather than described. Both
                    are live on this site: pick a synthetic case, and the pipeline executes in front
                    of you.
                </p>
                <p className="mt-5 text-body leading-[1.75] text-ink-secondary">{PIPELINE_SHAPE}</p>
            </motion.header>

            <div className="mt-16 grid gap-px overflow-hidden rounded-lg bg-line-soft sm:mt-20 sm:grid-cols-2">
                {apps.map((app, i) => {
                    const Icon = Icons[app.iconKey as keyof typeof Icons];
                    return (
                        <motion.div
                            key={app.slug}
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={
                                reduce
                                    ? { duration: 0 }
                                    : { duration: 0.5, delay: 0.06 * (i + 1), ease: EASE }
                            }
                        >
                            <Link
                                href={`/ai/${app.slug}`}
                                className="group flex h-full flex-col bg-surface-sunken px-6 py-8 transition-colors hover:bg-surface-muted sm:px-8 sm:py-10"
                            >
                                <div className="mb-7 h-10 w-10 text-ink-secondary">
                                    {Icon && <Icon />}
                                </div>

                                <p className="text-label uppercase text-ink-quaternary">{app.domain}</p>
                                <h2 className="mt-2.5 text-title-sm font-light text-ink">{app.name}</h2>
                                <p className="mt-1.5 text-caption text-ink-tertiary">{app.tagline}</p>

                                <p className="mt-5 flex-1 text-body leading-[1.7] text-ink-secondary">
                                    {app.summary}
                                </p>

                                <ul className="mt-7 flex flex-wrap gap-2">
                                    {app.techStack.slice(0, 4).map((tech) => (
                                        <li key={tech}>
                                            <Pill tone="muted">{tech}</Pill>
                                        </li>
                                    ))}
                                </ul>

                                <span className="mt-7 text-caption text-ink-tertiary group-hover:text-ink">
                                    Open and run it →
                                </span>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            <p className="mt-14 max-w-prose text-caption leading-relaxed text-ink-quaternary">
                Both applications run on synthetic data only. No real customer records, patient
                information or sanctions data is used, and every generated document is a draft for
                human review rather than a decision.
            </p>
        </main>
    );
}
