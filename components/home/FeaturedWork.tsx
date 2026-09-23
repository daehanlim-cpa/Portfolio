import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import WorkVisual from "@/components/work/WorkVisual";
import { projects } from "@/data/projects";
import { featuredIds } from "@/data/site";

export default function FeaturedWork() {
    const featured = featuredIds
        .map((id) => projects.find((p) => p.id === id))
        .filter((p): p is (typeof projects)[number] => Boolean(p));

    return (
        <section id="work" className="scroll-mt-20 px-6 py-24 sm:px-10 sm:py-32">
            <div className="mx-auto max-w-content">
                <SectionHeading
                    eyebrow="Selected work"
                    title={
                        <>
                            Systems in production, <em className="font-serif italic">not slideware.</em>
                        </>
                    }
                    aside={
                        <Link
                            href="/work"
                            className="shrink-0 text-caption text-ink-tertiary underline-offset-4 transition-colors hover:text-ink hover:underline"
                        >
                            All {projects.length} case studies →
                        </Link>
                    }
                >
                    Client names stay confidential. The problems, the architecture and the numbers
                    are real.
                </SectionHeading>

                <ul className="space-y-6 sm:space-y-8">
                    {featured.map((project, i) => (
                        <li key={project.id}>
                            <Reveal>
                                <Link
                                    href={`/project/${project.id}`}
                                    className="group grid items-stretch gap-6 rounded-xl p-2 transition-colors duration-300 hover:bg-surface-sunken sm:p-3 md:grid-cols-2 md:gap-10"
                                >
                                    <div className={i % 2 === 1 ? "md:order-2" : ""}>
                                        <WorkVisual project={project} />
                                    </div>
                                    <div className="flex flex-col justify-center px-2 pb-4 md:px-0 md:py-6 md:pr-6">
                                        <p className="text-label uppercase text-ink-quaternary">
                                            {project.type === "professional" ? "Client engagement" : "Independent build"}
                                            {project.categories.length > 0 && ` · ${project.categories.join(" · ")}`}
                                        </p>
                                        <h3 className="mt-3 text-title font-light text-ink sm:text-display-sm">
                                            {project.title}
                                        </h3>
                                        <p className="mt-4 text-body leading-relaxed text-ink-secondary">
                                            {project.solution ?? project.shortDescription}
                                        </p>
                                        <ul className="mt-6 flex flex-wrap gap-1.5">
                                            {project.techStack.slice(0, 5).map((tech) => (
                                                <li
                                                    key={tech}
                                                    className="rounded-full border border-line-soft px-2.5 py-1 text-label text-ink-tertiary"
                                                >
                                                    {tech}
                                                </li>
                                            ))}
                                        </ul>
                                        <span className="mt-7 inline-flex items-center gap-1.5 text-caption font-medium text-ink">
                                            Read the case study
                                            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                                                →
                                            </span>
                                        </span>
                                    </div>
                                </Link>
                            </Reveal>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
