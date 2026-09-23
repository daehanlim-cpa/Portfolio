import Reveal from "./Reveal";
import { certifications, education, stack } from "@/data/site";

export default function Toolkit() {
    return (
        <section className="border-t border-line-soft px-6 py-24 sm:px-10 sm:py-32">
            <div className="mx-auto grid max-w-content gap-16 lg:grid-cols-3 lg:gap-12">
                <Reveal>
                    <p className="text-label uppercase text-ink-quaternary">Credentials</p>
                    <ul className="mt-6 divide-y divide-line-soft border-y border-line-soft">
                        {certifications.map((c) => (
                            <li key={c.name} className="flex items-baseline justify-between gap-4 py-3.5">
                                <span className="text-caption text-ink">{c.name}</span>
                                <span className="shrink-0 text-label uppercase text-ink-quaternary">{c.short}</span>
                            </li>
                        ))}
                    </ul>
                </Reveal>

                <Reveal delay={0.06}>
                    <p className="text-label uppercase text-ink-quaternary">Toolkit</p>
                    <dl className="mt-6 space-y-6">
                        {stack.map((g) => (
                            <div key={g.group}>
                                <dt className="text-caption font-medium text-ink">{g.group}</dt>
                                <dd className="mt-2.5 flex flex-wrap gap-1.5">
                                    {g.items.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full bg-surface-muted px-2.5 py-1 text-label text-ink-secondary"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Reveal>

                <Reveal delay={0.12}>
                    <p className="text-label uppercase text-ink-quaternary">Education</p>
                    <ul className="mt-6 space-y-6">
                        {education.map((e) => (
                            <li key={e.degree}>
                                <p className="text-caption text-ink">{e.degree}</p>
                                <p className="mt-1 text-label text-ink-tertiary">
                                    {e.school} · {e.period}
                                </p>
                            </li>
                        ))}
                    </ul>
                </Reveal>
            </div>
        </section>
    );
}
