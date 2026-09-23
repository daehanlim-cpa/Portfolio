import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { timeline } from "@/data/site";

/** Section 2: the path — domain knowledge first, then the build skills on top. */
export default function Journey() {
    return (
        <section id="path" className="scroll-mt-20 bg-surface-sunken px-6 py-28 sm:px-10 sm:py-40">
            <div className="mx-auto max-w-content">
                <SectionHeading eyebrow="The path" title="Domain expert first." muted="Then builder.">
                    I started on the business side, in accounting and then financial services. Knowing
                    how an organization actually runs means fewer translation layers between its
                    problem and the system that solves it. That approach carries to any industry.
                </SectionHeading>

                <ol className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
                    {timeline.map((step, i) => {
                        const latest = i === timeline.length - 1;
                        return (
                            <li key={step.period + step.role}>
                                <Reveal delay={i * 0.05}>
                                    {/* A short rule per step: together they read as one
                                        line across the page, and the current step is
                                        the one drawn in ink. */}
                                    <div className={`h-[2px] rounded-full ${latest ? "bg-ink" : "bg-line"}`} />
                                    <p className="mt-6 text-caption tabular-nums text-ink-quaternary">{step.period}</p>
                                    <h3 className="mt-2 text-title-sm font-semibold tracking-[-0.02em] text-ink">{step.lesson}</h3>
                                    <p className="mt-2 text-caption font-medium text-ink-secondary">{step.role}</p>
                                    <p className="text-caption text-ink-tertiary">{step.org}</p>
                                    <p className="mt-4 text-caption leading-relaxed text-ink-tertiary">{step.detail}</p>
                                </Reveal>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
