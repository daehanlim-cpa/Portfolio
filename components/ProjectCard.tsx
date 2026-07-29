"use client";

import { Project } from "@/data/projects";
import { Icons } from "@/components/ProjectIcons";

interface ProjectCardProps {
    project: Project;
    onClick?: () => void;
    isEmphasized?: boolean;
}

export default function ProjectCard({ project, onClick, isEmphasized = true }: ProjectCardProps) {
    const IconComponent = Icons[project.iconKey as keyof typeof Icons];
    const interactive = Boolean(onClick);

    return (
        <button
            onClick={onClick}
            disabled={!interactive}
            aria-label={interactive ? `Open ${project.title}` : undefined}
            // flex-col rather than block: browsers vertically centre button
            // content, so in a stretched grid row the short-label cards drifted
            // down out of alignment with their taller neighbours.
            className={`group flex w-full flex-col text-left focus-visible:outline-none ${
                interactive ? "cursor-pointer" : "cursor-default"
            }`}
        >
            {/* The tile carries the affordance. Resting state is nearly flat —
                the lift on hover is what says "this responds to you". */}
            <div
                className={`relative aspect-square overflow-hidden rounded-xl border bg-surface-sunken transition-[transform,box-shadow,border-color,background-color] duration-[450ms] ease-out ${
                    isEmphasized ? "border-line-soft" : "border-line-soft opacity-50"
                } ${
                    interactive
                        ? "group-hover:-translate-y-[3px] group-hover:border-line group-hover:bg-surface group-hover:shadow-lifted group-focus-visible:-translate-y-[3px] group-focus-visible:shadow-lifted group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-active:translate-y-0 group-active:scale-[0.99] group-active:duration-100"
                        : ""
                }`}
            >
                <div className="flex h-full w-full items-center justify-center">
                    <div
                        className={`h-[38%] w-[38%] transition-[transform,color] duration-[450ms] ease-out ${
                            isEmphasized
                                ? "text-ink-secondary group-hover:scale-[1.06] group-hover:text-ink"
                                : "text-ink-quaternary"
                        }`}
                    >
                        {IconComponent && <IconComponent />}
                    </div>
                </div>

                {/* Corner cue, revealed on hover so the resting grid stays quiet. */}
                {interactive && (
                    <span
                        aria-hidden
                        className="pointer-events-none absolute right-3 top-3 translate-y-1 text-ink-quaternary opacity-0 transition-all duration-[450ms] ease-out group-hover:translate-y-0 group-hover:opacity-100"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M7 17 17 7M17 7H9M17 7v8"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                )}
            </div>

            <div className="mt-3.5">
                <p
                    className={`text-label uppercase tabular-nums transition-colors duration-300 ${
                        isEmphasized ? "text-ink-quaternary" : "text-ink-quaternary/70"
                    }`}
                >
                    {project.code}
                </p>
                <p
                    className={`mt-1 text-caption leading-snug transition-colors duration-300 ${
                        isEmphasized
                            ? "text-ink-secondary group-hover:text-ink"
                            : "text-ink-quaternary"
                    }`}
                >
                    {project.title}
                </p>
            </div>
        </button>
    );
}
