import Link from "next/link";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import WorkVisual from "@/components/work/WorkVisual";
import { projects } from "@/data/projects";
import { featuredIds, metrics } from "@/data/site";

/** Section 3: the work, led by its numbers. */
export default function Work() {
    const featured = featuredIds
        .map((id) => projects.find((p) => p.id === id))
        .filter((p): p is (typeof projects)[number] => Boolean(p));

    return (
        <section id="work" className="scroll-mt-20 px-6 py-28 sm:px-10 sm:py-40">
            <div className="mx-auto max-w-content">
                <SectionHeading eyebrow="Work" title="Measured in outcomes." muted="Client names withheld.">
                    Every figure on this site comes from a real engagement, and each one links to the
                    case study behind it.
                </SectionHeading>

                {/* The numbers, as a spec row. Hairline above each, nothing else. */}
                <dl className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                    {metrics.map((m, i) => (
                        <Reveal key={m.label} delay={i * 0.06}>
                            <Link href={`/project/${m.source}`} className="group block border-t border-line pt-6">
                                <dd className="text-display-sm font-semibold tracking-[-0.03em] text-ink sm:text-display">
                                    {m.value}
                                </dd>
                                <dt className="mt-3 max-w-[16rem] text-body leading-snug text-ink-tertiary transition-colors group-hover:text-ink">
                                    {m.label}
                                </dt>
                            </Link>
                        </Reveal>
                    ))}
                </dl>

                <ul className="mt-24 grid gap-4 sm:mt-32 md:grid-cols-2">
                    {featured.map((project, i) => (
                        <li key={project.id}>
                            <Reveal delay={(i % 2) * 0.06} className="h-full">
                                <Link
                                    href={`/project/${project.id}`}
                                    className="group flex h-full flex-col rounded-xl bg-surface-muted p-8 transition-colors duration-300 hover:bg-surface-sunken sm:p-10"
                                >
                                    <p className="text-caption font-medium text-ink-tertiary">
                                        {project.type === "professional" ? "Client engagement" : "Independent build"}
                                    </p>
                                    <h3 className="mt-2 text-title font-semibold tracking-[-0.025em] text-ink">
                                        {project.title}
                                    </h3>
                                    <p className="mt-3 text-body leading-relaxed text-ink-tertiary">
                                        {project.shortDescription}.
                                    </p>
                                    <div className="mt-10 flex-1">
                                        <WorkVisual project={project} />
                                    </div>
                                    <span className="mt-8 text-body font-medium text-accent">
                                        Read the case study{" "}
                                        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                                            ›
                                        </span>
                                    </span>
                                </Link>
                            </Reveal>
                        </li>
                    ))}
                </ul>

                <Reveal className="mt-14 text-center">
                    <Link href="/work" className="group text-body-lg font-medium text-accent">
                        See all {projects.length} case studies{" "}
                        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                            ›
                        </span>
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
