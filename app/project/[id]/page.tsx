import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import WorkVisual from "@/components/work/WorkVisual";
import ArchitectureFlow, { hasFlow } from "@/components/work/ArchitectureFlow";

export async function generateStaticParams() {
    return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = projects.find((p) => p.id === id);
    if (!project) return {};
    return {
        title: project.title,
        description: project.shortDescription,
        openGraph: { title: project.title, description: project.shortDescription },
    };
}

const TYPE_LABEL = {
    professional: "Client engagement",
    project: "Independent build",
    purpose: "Pro bono",
} as const;

/**
 * Column spans for the last results cell, so a count that doesn't fill the
 * final row stretches to the edge instead of leaving an empty grey cell.
 */
function lastCellSpan(count: number) {
    const sm = count % 2 === 1 ? "sm:col-span-2" : "";
    const lg = { 0: "lg:col-span-1", 1: "lg:col-span-3", 2: "lg:col-span-2" }[count % 3];
    return `${sm} ${lg}`;
}

/** "Term: detail" strings are common in the data; split them for display. */
function splitTerm(text: string) {
    const i = text.indexOf(":");
    if (i === -1 || i > 48) return { term: null, detail: text };
    return { term: text.slice(0, i).trim(), detail: text.slice(i + 1).trim() };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="grid gap-5 border-t border-line-soft pt-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10">
            <h2 className="text-label uppercase text-ink-quaternary md:pt-1">{title}</h2>
            <div className="min-w-0">{children}</div>
        </section>
    );
}

function Bullets({ items }: { items: string[] }) {
    return (
        <ul className="space-y-3.5">
            {items.map((item, i) => {
                const { term, detail } = splitTerm(item);
                return (
                    <li key={i} className="flex gap-3 text-body leading-[1.7] text-ink-secondary">
                        <span aria-hidden className="mt-[0.7em] h-[3px] w-[3px] shrink-0 rounded-full bg-ink-quaternary" />
                        <span>
                            {term && <span className="font-medium text-ink">{term}. </span>}
                            {detail}
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = projects.find((p) => p.id === id);

    if (!project) notFound();

    const index = projects.findIndex((p) => p.id === project.id);
    const previous = projects[(index - 1 + projects.length) % projects.length];
    const next = projects[(index + 1) % projects.length];
    const askHref = `/ask?q=${encodeURIComponent(`Tell me more about the ${project.title} project`)}`;

    return (
        <article className="px-6 pb-24 pt-10 sm:px-10 sm:pt-14">
            <div className="mx-auto max-w-content">
                <Link href="/work" className="text-caption text-ink-tertiary transition-colors hover:text-ink">
                    ← All work
                </Link>

                {/* Header */}
                <header className="mt-10 grid items-end gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
                    <div className="animate-fade-up">
                        <p className="text-label uppercase text-ink-quaternary">
                            {TYPE_LABEL[project.type]}
                            {project.categories.length > 0 && ` · ${project.categories.join(" · ")}`}
                        </p>
                        <h1 className="mt-4 text-display-sm font-light text-ink sm:text-display lg:text-display-lg">
                            {project.title}
                        </h1>
                        <p className="mt-6 max-w-prose text-body-lg font-light leading-relaxed text-ink-secondary">
                            {project.shortDescription}.
                        </p>
                    </div>
                    <div className="animate-fade-up [animation-delay:100ms]">
                        <WorkVisual project={project} />
                    </div>
                </header>

                {/* Results first: a reader deciding whether to keep going wants the
                    outcome before the method. */}
                <section aria-label="Results" className="mt-16 sm:mt-20">
                    <ol className="grid gap-px overflow-hidden rounded-xl border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
                        {project.impact.map((result, i) => (
                            <li
                                key={i}
                                className={`bg-surface p-6 sm:p-7 ${i === project.impact.length - 1 ? lastCellSpan(project.impact.length) : ""}`}
                            >
                                <span className="font-serif text-title-sm italic text-ink-quaternary">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="mt-3 text-body leading-[1.6] text-ink">{result}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <div className="mx-auto mt-20 max-w-4xl space-y-14 sm:mt-24">
                    {project.overview && (
                        <Section title="Context">
                            <p className="text-body-lg font-light leading-[1.75] text-ink-secondary">{project.overview}</p>
                        </Section>
                    )}

                    <Section title="The problem">
                        <ol className="space-y-5">
                            {project.problem.map((item, i) => {
                                const { term, detail } = splitTerm(item);
                                return (
                                    <li key={i} className="flex gap-4">
                                        <span className="mt-[3px] w-5 shrink-0 text-label tabular-nums text-ink-quaternary">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className="text-body leading-[1.7] text-ink-secondary">
                                            {term && <span className="font-medium text-ink">{term}. </span>}
                                            {detail}
                                        </span>
                                    </li>
                                );
                            })}
                        </ol>

                        {project.baselineKPIs && (
                            <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line-soft bg-line-soft sm:grid-cols-2">
                                {project.baselineKPIs.map((kpi, i) => {
                                    const { term, detail } = splitTerm(kpi);
                                    return (
                                        <div key={i} className="bg-surface-sunken px-5 py-4">
                                            <dt className="text-label uppercase text-ink-quaternary">{term ?? "Baseline"}</dt>
                                            <dd className="mt-1 text-caption text-ink-secondary">{detail}</dd>
                                        </div>
                                    );
                                })}
                            </dl>
                        )}
                    </Section>

                    <Section title="What was built">
                        {project.solution && (
                            <p className="mb-7 text-body-lg font-light leading-[1.75] text-ink-secondary">{project.solution}</p>
                        )}
                        {project.keyCapabilities && <Bullets items={project.keyCapabilities} />}
                    </Section>

                    {project.approach.length > 0 && (
                        <Section title="Approach">
                            <ol className="relative space-y-5 border-l border-line pl-6">
                                {project.approach.map((step, i) => (
                                    <li key={i} className="relative text-body leading-[1.7] text-ink-secondary">
                                        <span aria-hidden className="absolute -left-[28.5px] top-[0.55em] h-2 w-2 rounded-full border border-line bg-surface" />
                                        {step}
                                    </li>
                                ))}
                            </ol>
                        </Section>
                    )}

                    {(hasFlow(project.id) || project.architectureComponents) && (
                        <Section title="Architecture">
                            <ArchitectureFlow id={project.id} />
                            {project.architectureComponents && (
                                <dl className="mt-4 grid gap-px overflow-hidden rounded-lg border border-line-soft bg-line-soft sm:grid-cols-2">
                                    {project.architectureComponents.map((comp, i) => {
                                        const { term, detail } = splitTerm(comp);
                                        return (
                                            <div key={i} className="bg-surface-sunken px-5 py-4">
                                                <dt className="text-label uppercase text-ink-quaternary">{term ?? "Component"}</dt>
                                                <dd className="mt-1.5 text-caption leading-relaxed text-ink-secondary">{detail}</dd>
                                            </div>
                                        );
                                    })}
                                </dl>
                            )}
                        </Section>
                    )}

                    {project.governance && (
                        <Section title="Controls">
                            <ul className="space-y-3.5">
                                {project.governance.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-body leading-[1.7] text-ink-secondary">
                                        <svg className="mt-[0.3em] h-4 w-4 shrink-0 text-ink-tertiary" viewBox="0 0 24 24" fill="none" aria-hidden>
                                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                                            <path d="M8.5 12.2l2.3 2.3 4.7-4.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    )}

                    <Section title="Stack">
                        <ul className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <li key={tech} className="rounded-full bg-surface-muted px-3 py-1.5 text-caption text-ink-secondary">
                                    {tech}
                                </li>
                            ))}
                        </ul>

                        {(project.links.demo || project.links.repo || project.links.pdf) && (
                            <div className="mt-8 flex flex-wrap gap-3">
                                {project.links.demo && (
                                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink px-5 py-2.5 text-caption font-medium text-on-ink transition-opacity hover:opacity-85">
                                        Live demo
                                    </a>
                                )}
                                {project.links.repo && (
                                    <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-5 py-2.5 text-caption text-ink transition-colors hover:bg-surface-muted">
                                        View code
                                    </a>
                                )}
                                {project.links.pdf && (
                                    <a href={project.links.pdf} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-5 py-2.5 text-caption text-ink transition-colors hover:bg-surface-muted">
                                        Case study
                                    </a>
                                )}
                            </div>
                        )}
                    </Section>

                    {/* Follow-up questions go to the assistant, pre-asked. */}
                    <div className="flex flex-col items-start justify-between gap-5 rounded-xl border border-line-soft bg-surface-sunken p-7 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-body font-medium text-ink">Questions about this project?</p>
                            <p className="mt-1 text-caption text-ink-tertiary">The assistant has read the full case study.</p>
                        </div>
                        <Link href={askHref} className="shrink-0 rounded-full bg-ink px-5 py-2.5 text-caption font-medium text-on-ink transition-opacity hover:opacity-85">
                            Ask about it
                        </Link>
                    </div>

                    {/* Sibling navigation, wrapping at the ends. Titles rather than
                        bare arrows, so you know where you're going. */}
                    <nav aria-label="More case studies" className="grid gap-px overflow-hidden rounded-xl border border-line-soft bg-line-soft sm:grid-cols-2">
                        <Link href={`/project/${previous.id}`} className="group bg-surface px-6 py-6 transition-colors hover:bg-surface-sunken">
                            <span className="text-label uppercase text-ink-quaternary">← Previous</span>
                            <p className="mt-2 text-body text-ink-secondary group-hover:text-ink">{previous.title}</p>
                        </Link>
                        <Link href={`/project/${next.id}`} className="group bg-surface px-6 py-6 transition-colors hover:bg-surface-sunken sm:text-right">
                            <span className="text-label uppercase text-ink-quaternary">Next →</span>
                            <p className="mt-2 text-body text-ink-secondary group-hover:text-ink">{next.title}</p>
                        </Link>
                    </nav>
                </div>
            </div>
        </article>
    );
}
