import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { Icons } from "@/components/ProjectIcons";

export async function generateStaticParams() {
    return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = projects.find((p) => p.id === id);
    if (!project) return {};
    return { title: project.title, description: project.shortDescription };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h2 className="mb-5 border-b border-line-soft pb-2.5 text-label uppercase text-ink-tertiary">
                {title}
            </h2>
            {children}
        </section>
    );
}

function Dashed({ items }: { items: string[] }) {
    return (
        <ul className="space-y-3.5">
            {items.map((item, i) => (
                <li key={i} className="flex gap-3 text-body leading-[1.7] text-ink-secondary">
                    <span aria-hidden className="mt-[0.6em] h-[3px] w-[3px] shrink-0 rounded-full bg-ink-quaternary" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = projects.find((p) => p.id === id);

    if (!project) notFound();

    const index = projects.findIndex((p) => p.id === project.id);
    const previous = index > 0 ? projects[index - 1] : null;
    const next = index < projects.length - 1 ? projects[index + 1] : null;
    const IconComponent = Icons[project.iconKey as keyof typeof Icons];

    return (
        <main className="min-h-screen bg-surface px-6 pb-28 pt-14 sm:px-8 sm:pt-20">
            <article className="mx-auto max-w-3xl">
                {/*
                 * The icon, not a photograph. This route used to render
                 * project.heroImage, but only project1-6.png exist — the five
                 * projects pointing at project7-10.png and purpose1.png showed
                 * broken images. The icon set covers every project by design.
                 */}
                <header className="mb-16 sm:mb-20">
                    <div className="mb-8 h-12 w-12 text-ink-secondary sm:h-14 sm:w-14">
                        {IconComponent && <IconComponent />}
                    </div>
                    <p className="text-label uppercase tabular-nums text-ink-quaternary">{project.code}</p>
                    <h1 className="mt-3 text-display-sm font-light text-ink sm:text-display">
                        {project.title}
                    </h1>
                    <p className="mt-5 max-w-prose text-body-lg font-light leading-relaxed text-ink-tertiary">
                        {project.shortDescription}
                    </p>
                </header>

                <div className="space-y-16 sm:space-y-20">
                    {project.overview && (
                        <Section title="Overview">
                            <p className="text-body leading-[1.75] text-ink-secondary">{project.overview}</p>
                        </Section>
                    )}

                    <Section title="Problem">
                        <Dashed items={project.problem} />
                    </Section>

                    <Section title="Approach">
                        {project.solution && (
                            <p className="mb-6 text-body leading-[1.75] text-ink-secondary">{project.solution}</p>
                        )}
                        <Dashed items={project.approach} />
                    </Section>

                    <Section title="Impact">
                        <ul className="grid gap-px overflow-hidden rounded-lg bg-line-soft">
                            {project.impact.map((item, i) => (
                                <li key={i} className="bg-surface-sunken px-5 py-5">
                                    <span className="text-label uppercase tabular-nums text-ink-quaternary">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <p className="mt-2 text-body leading-[1.7] text-ink">{item}</p>
                                </li>
                            ))}
                        </ul>
                    </Section>

                    <div className="border-t border-line-soft pt-10">
                        <p className="mb-4 text-label uppercase text-ink-quaternary">Stack</p>
                        <ul className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <li
                                    key={tech}
                                    className="rounded-full bg-surface-muted px-3 py-1.5 text-caption text-ink-secondary"
                                >
                                    {tech}
                                </li>
                            ))}
                        </ul>

                        {(project.links.demo || project.links.repo || project.links.pdf) && (
                            <div className="mt-9 flex flex-wrap gap-3">
                                {project.links.demo && (
                                    <a
                                        href={project.links.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full bg-ink px-5 py-2.5 text-caption font-medium text-white transition-opacity hover:opacity-85"
                                    >
                                        Live demo
                                    </a>
                                )}
                                {project.links.repo && (
                                    <a
                                        href={project.links.repo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-line px-5 py-2.5 text-caption text-ink transition-colors hover:bg-surface-muted"
                                    >
                                        View code
                                    </a>
                                )}
                                {project.links.pdf && (
                                    <a
                                        href={project.links.pdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rounded-full border border-line px-5 py-2.5 text-caption text-ink transition-colors hover:bg-surface-muted"
                                    >
                                        Case study
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sibling navigation. Titles rather than bare arrows, so you
                        know what you're moving to. */}
                    <nav className="grid gap-px overflow-hidden rounded-lg bg-line-soft sm:grid-cols-2">
                        {previous ? (
                            <Link
                                href={`/project/${previous.id}`}
                                className="group bg-surface-sunken px-5 py-5 transition-colors hover:bg-surface-muted"
                            >
                                <span className="text-label uppercase text-ink-quaternary">Previous</span>
                                <p className="mt-1.5 text-caption text-ink-secondary group-hover:text-ink">
                                    {previous.title}
                                </p>
                            </Link>
                        ) : (
                            <span className="hidden bg-surface-sunken sm:block" />
                        )}
                        {next && (
                            <Link
                                href={`/project/${next.id}`}
                                className="group bg-surface-sunken px-5 py-5 transition-colors hover:bg-surface-muted sm:text-right"
                            >
                                <span className="text-label uppercase text-ink-quaternary">Next</span>
                                <p className="mt-1.5 text-caption text-ink-secondary group-hover:text-ink">
                                    {next.title}
                                </p>
                            </Link>
                        )}
                    </nav>

                    <div className="flex justify-center">
                        <Link
                            href="/experience"
                            className="text-caption text-ink-tertiary transition-colors hover:text-ink"
                        >
                            All experience
                        </Link>
                    </div>
                </div>
            </article>
        </main>
    );
}
