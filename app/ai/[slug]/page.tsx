import Link from "next/link";
import { notFound } from "next/navigation";
import { aiApps, findAiApp } from "@/data/ai-apps";
import { getDemo } from "@/lib/demos/registry";
import ArchitectureFlow from "@/components/ArchitectureFlow";
import Section, { Dashed, DefinitionGrid } from "@/components/Section";
import { PillList } from "@/components/Pill";
import { Icons } from "@/components/ProjectIcons";
import DemoRunner from "@/components/demos/DemoRunner";

export async function generateStaticParams() {
    return aiApps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const app = findAiApp(slug);
    if (!app) return {};
    return { title: `${app.name} — ${app.tagline}`, description: app.summary };
}

export default async function AiAppPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const app = findAiApp(slug);
    if (!app) notFound();

    // The runner is registered against the same slug, so a page without a demo is
    // a wiring mistake rather than a valid state — but it renders without one.
    const demo = getDemo(app.slug);
    const Icon = Icons[app.iconKey as keyof typeof Icons];

    const index = aiApps.findIndex((a) => a.slug === app.slug);
    const other = aiApps[(index + 1) % aiApps.length];

    return (
        <main className="min-h-screen bg-surface px-6 pb-28 pt-14 sm:px-8 sm:pt-20">
            <article className="mx-auto max-w-3xl">
                <header className="mb-16 sm:mb-20">
                    <div className="mb-8 h-12 w-12 text-ink-secondary sm:h-14 sm:w-14">
                        {Icon && <Icon />}
                    </div>
                    <p className="text-label uppercase text-ink-quaternary">{app.domain}</p>
                    <h1 className="mt-3 text-display-sm font-light text-ink sm:text-display">
                        {app.name}
                    </h1>
                    <p className="mt-5 max-w-prose text-body-lg font-light leading-relaxed text-ink-tertiary">
                        {app.tagline}
                    </p>
                    <p className="mt-6 max-w-prose text-body leading-[1.75] text-ink-secondary">
                        {app.summary}
                    </p>
                </header>

                <div className="space-y-16 sm:space-y-20">
                    <Section title="Problem">
                        <Dashed items={app.problem} />
                    </Section>

                    {demo && (
                        <Section title="Run it" aside="Live">
                            <p className="mb-8 max-w-prose text-body leading-[1.75] text-ink-secondary">
                                The deterministic stages complete in milliseconds; the two model
                                calls take a few seconds. Each stage reports as it finishes, and
                                every input the model received is listed at the end.
                            </p>
                            <DemoRunner
                                slug={app.slug}
                                cases={demo.cases}
                                stageOutline={demo.stageOutline}
                                disclaimer={app.disclaimer}
                            />
                        </Section>
                    )}

                    <Section title="Approach">
                        <Dashed items={app.approach} />
                    </Section>

                    <Section title="Architecture">
                        <ArchitectureFlow
                            nodes={app.architectureNodes}
                            label={`${app.name} pipeline diagram, scrolls horizontally`}
                        />
                        <div className="mt-6">
                            <DefinitionGrid items={app.infrastructure} />
                        </div>
                    </Section>

                    <Section title="Design decisions">
                        <Dashed items={app.keyDecisions} />
                    </Section>

                    {app.screenshots.length > 0 && (
                        <Section title="Screens">
                            <div className="space-y-8">
                                {app.screenshots.map((shot) => (
                                    <figure key={shot.src}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={shot.src}
                                            alt={shot.alt}
                                            loading="lazy"
                                            className="w-full rounded-lg border border-line-soft"
                                        />
                                        {shot.caption && (
                                            <figcaption className="mt-3 text-caption text-ink-tertiary">
                                                {shot.caption}
                                            </figcaption>
                                        )}
                                    </figure>
                                ))}
                            </div>
                        </Section>
                    )}

                    <div className="border-t border-line-soft pt-10">
                        <p className="mb-4 text-label uppercase text-ink-quaternary">Stack</p>
                        <PillList items={app.techStack} />
                    </div>

                    {other.slug !== app.slug && (
                        <nav className="grid gap-px overflow-hidden rounded-lg bg-line-soft">
                            <Link
                                href={`/ai/${other.slug}`}
                                className="group bg-surface-sunken px-5 py-5 transition-colors hover:bg-surface-muted"
                            >
                                <span className="text-label uppercase text-ink-quaternary">
                                    The other one
                                </span>
                                <p className="mt-1.5 text-caption text-ink-secondary group-hover:text-ink">
                                    {other.name} — {other.tagline}
                                </p>
                            </Link>
                        </nav>
                    )}

                    <div className="flex justify-center gap-6">
                        <Link
                            href="/ai"
                            className="text-caption text-ink-tertiary transition-colors hover:text-ink"
                        >
                            All AI applications
                        </Link>
                        <Link
                            href="/experience"
                            className="text-caption text-ink-tertiary transition-colors hover:text-ink"
                        >
                            Experience
                        </Link>
                    </div>
                </div>
            </article>
        </main>
    );
}
