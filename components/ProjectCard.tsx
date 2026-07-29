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
            {/* Tile — the affordance lives here. Previously the icon floated on
                bare background, which read as decoration rather than a control. */}
            <div
                className={`relative aspect-square overflow-hidden rounded-[20px] border bg-gradient-to-b from-gray-50 to-white transition-all duration-300 ease-out ${
                    isEmphasized ? "border-gray-200/90" : "border-gray-100 opacity-60"
                } ${
                    interactive
                        ? "group-hover:-translate-y-1 group-hover:border-gray-300 group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-14px_rgba(0,0,0,0.28)] group-focus-visible:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-black group-focus-visible:ring-offset-2 group-active:translate-y-0 group-active:scale-[0.985] group-active:duration-100"
                        : ""
                }`}
            >
                {/* Wash that warms the tile on hover, behind the icon. */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white to-gray-100/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="relative flex h-full w-full items-center justify-center">
                    <div
                        className={`h-[42%] w-[42%] transition-all duration-300 ease-out ${
                            isEmphasized
                                ? "text-gray-700 group-hover:scale-[1.08] group-hover:text-black"
                                : "text-gray-400"
                        }`}
                    >
                        {IconComponent && <IconComponent />}
                    </div>
                </div>

                {/* Corner cue: appears only on hover, so the resting state stays quiet. */}
                {interactive && (
                    <div
                        aria-hidden
                        className="pointer-events-none absolute right-2.5 top-2.5 translate-y-1 text-gray-400 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M7 17 17 7M17 7H9M17 7v8"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Label */}
            <div className="mt-3 px-0.5 text-center">
                <p
                    className={`mb-0.5 text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                        isEmphasized
                            ? "font-medium text-gray-500 group-hover:text-black"
                            : "text-gray-400"
                    }`}
                >
                    {project.code}
                </p>
                <p
                    className={`text-[11px] leading-snug transition-colors duration-200 sm:text-[11.5px] ${
                        isEmphasized
                            ? "text-gray-400 group-hover:text-gray-700"
                            : "text-gray-300"
                    }`}
                >
                    {project.title}
                </p>
            </div>
        </button>
    );
}
