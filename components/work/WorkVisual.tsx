import { Icons } from "@/components/ProjectIcons";
import type { Project } from "@/data/projects";

/**
 * The image slot for a case study. Client work can't be screenshotted, so the
 * visual is the project's mark on drafting paper with its headline figure —
 * the number is the picture.
 */
export default function WorkVisual({ project, size = "lg" }: { project: Project; size?: "lg" | "sm" }) {
    const Icon = Icons[project.iconKey as keyof typeof Icons];
    const large = size === "lg";

    return (
        <div
            className={`bg-dots relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-line-soft bg-surface-sunken ${
                large ? "min-h-[240px] p-7 sm:min-h-[320px] sm:p-9" : "aspect-[4/3] p-5"
            }`}
        >
            <div className="flex items-start justify-between">
                <span className="text-label uppercase tabular-nums text-ink-quaternary">{project.code}</span>
                <div
                    className={`text-ink-secondary transition-transform duration-500 ease-out group-hover:scale-[1.06] ${
                        large ? "h-14 w-14 sm:h-16 sm:w-16" : "h-9 w-9"
                    }`}
                >
                    {Icon && <Icon />}
                </div>
            </div>
            {project.highlight ? (
                <div>
                    <p className={`font-serif leading-none text-ink ${large ? "text-display sm:text-display-lg" : "text-display-sm"}`}>
                        {project.highlight.value}
                    </p>
                    <p className={`mt-2 text-ink-tertiary ${large ? "text-caption" : "text-label"}`}>
                        {project.highlight.label}
                    </p>
                </div>
            ) : (
                <p className={`font-serif italic leading-tight text-ink-secondary ${large ? "text-title" : "text-title-sm"}`}>
                    {project.categories[0] ?? "Case study"}
                </p>
            )}
        </div>
    );
}
