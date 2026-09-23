import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import ArchitectureFlow, { hasFlow } from "@/components/work/ArchitectureFlow";
import { isLongMetric } from "@/components/work/WorkVisual";

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

/** Columns for the scorecard at desktop width: never more than the metrics fill. */
function scorecardCols(count: number) {
    if (count % 3 === 0) return "lg:grid-cols-3";
    if (count >= 4) return "lg:grid-cols-4";
    return "lg:grid-cols-2";
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
            <h2 className="text-caption font-medium text-ink-tertiary md:pt-1">{title}</h2>
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

                {/* Header: one statement, centred, nothing beside it. */}
                <header className="mx-auto mt-14 max-w-3xl animate-fade-up text-center sm:mt-20">
                    <p className="text-caption font-medium text-ink-tertiary">
                        {TYPE_LABEL[project.type]}
                        {project.categories.length > 0 && ` · ${project.categories.join(" · ")}`}
                    </p>
                    <h1 className="mt-3 text-display-sm font-semibold tracking-[-0.03em] text-ink sm:text-display lg:text-display-lg">
                        {project.title}
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed text-ink-tertiary sm:text-title-sm sm:leading-[1.45]">
                        {project.shortDescription}.
                    </p>
                </header>

                {/* The scorecard. Results come before method: a reader deciding
                    whether to keep going wants the outcome first. */}
                <section aria-label="Results at a glance" className="mt-20 sm:mt-28">
                    <dl className={`grid gap-x-8 gap-y-12 sm:grid-cols-2 ${scorecardCols(project.metrics.length)}`}>
                        {project.metrics.map((m) => (
                            <div key={m.label} className="border-t border-line pt-6">
                                <dd
                                    className={`font-semibold tracking-[-0.03em] text-ink ${
                                        isLongMetric(m.value) ? "text-title sm:text-display-sm" : "text-display-sm sm:text-display"
                                    }`}
                                >
                                    {m.value}
                                </dd>
                                <dt className="mt-3 max-w-[18rem] text-body leading-snug text-ink-tertiary">{m.label}</dt>
                            </div>
                        ))}
                    </dl>
                    {project.metricsNote && (
                        <p className="mt-10 max-w-2xl text-caption text-ink-quaternary">{project.metricsNote}</p>
                    )}
                </section>

                {/* Before and after, side by side where a baseline was recorded. */}
                <section aria-label="Outcomes" className="mt-20 grid gap-4 sm:mt-28 md:grid-cols-2">
                    {project.baselineKPIs && (
                        <div className="rounded-xl bg-surface-muted p-8 sm:p-10">
                            <h2 className="text-caption font-medium text-ink-tertiary">Before</h2>
                            <dl className="mt-6 space-y-5">
                                {project.baselineKPIs.map((kpi, i) => {
                                    const { term, detail } = splitTerm(kpi);
                                    return (
                                        <div key={i}>
                                            <dt className="text-caption text-ink-quaternary">{term ?? "Baseline"}</dt>
                                            <dd className="mt-0.5 text-body text-ink-secondary">{detail}</dd>
                                        </div>
                                    );
                                })}
                            </dl>
                        </div>
                    )}
                    <div className={`rounded-xl bg-ink p-8 text-on-ink sm:p-10 ${project.baselineKPIs ? "" : "md:col-span-2"}`}>
                        <h2 className="text-caption font-medium opacity-60">{project.baselineKPIs ? "After" : "Outcomes"}</h2>
                        <ul className={`mt-6 grid gap-x-10 gap-y-5 ${project.baselineKPIs ? "" : "md:grid-cols-2"}`}>
                            {project.impact.map((result, i) => (
                                <li key={i} className="flex gap-3 text-body leading-[1.55]">
                                    <svg className="mt-[0.3em] h-4 w-4 shrink-0 opacity-60" viewBox="0 0 24 24" fill="none" aria-hidden>
                                        <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>{result}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <div className="mx-auto mt-20 max-w-4xl space-y-14 sm:mt-24">
                    {project.overview && (
                        <Section title="Context">
                            <p className="text-body-lg leading-[1.7] text-ink-secondary">{project.overview}</p>
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
                    </Section>

                    <Section title="What was built">
                        {project.solution && (
                            <p className="mb-7 text-body-lg leading-[1.7] text-ink-secondary">{project.solution}</p>
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
                                <dl className="mt-4 grid gap-x-8 sm:grid-cols-2">
                                    {project.architectureComponents.map((comp, i) => {
                                        const { term, detail } = splitTerm(comp);
                                        return (
                                            <div key={i} className="border-t border-line-soft py-4">
                                                <dt className="text-caption font-medium text-ink">{term ?? "Component"}</dt>
                                                <dd className="mt-1.5 text-caption leading-relaxed text-ink-secondary">{detail}</dd>
                                            </div>
                                        );
                                    })}
                                </dl>
                            )}
                        </Section>
                    )}

                    {project.governance && (
                        <Section title="Governance">
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
