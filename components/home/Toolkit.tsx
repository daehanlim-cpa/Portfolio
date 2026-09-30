import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { certifications, education, stack } from "@/data/site";

export default function Toolkit() {
    return (
        <section className="bg-surface-sunken px-6 py-28 sm:px-10 sm:py-40">
            <div className="mx-auto max-w-content">
                <SectionHeading eyebrow="Credentials" title="Certified across the stack." muted="From the ledger to the LLM." />

                <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
                    <Reveal>
                        <ul className="divide-y divide-line-soft border-y border-line-soft">
                            {certifications.map((c) => (
                                <li key={c.name} className="flex items-baseline justify-between gap-6 py-4">
                                    <span className="text-body text-ink">{c.name}</span>
                                    <span className="shrink-0 text-caption text-ink-quaternary">{c.issuer}</span>
                                </li>
                            ))}
                        </ul>
                    </Reveal>

                    <div className="space-y-14">
                        <Reveal delay={0.06}>
                            <h3 className="text-caption font-medium text-ink-tertiary">Toolkit</h3>
                            <dl className="mt-5 space-y-5">
                                {stack.map((g) => (
                                    <div key={g.group} className="grid grid-cols-[5.5rem_1fr] gap-4">
                                        <dt className="text-caption font-medium text-ink">{g.group}</dt>
                                        <dd className="text-caption leading-relaxed text-ink-secondary">{g.items.join(" · ")}</dd>
                                    </div>
                                ))}
                            </dl>
                        </Reveal>

                        <Reveal delay={0.12}>
                            <h3 className="text-caption font-medium text-ink-tertiary">Education</h3>
                            <ul className="mt-5 space-y-5">
                                {education.map((e) => (
                                    <li key={e.degree}>
                                        <p className="text-caption font-medium text-ink">{e.degree}</p>
                                        <p className="mt-0.5 text-caption text-ink-tertiary">
                                            {e.school} · {e.period}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
