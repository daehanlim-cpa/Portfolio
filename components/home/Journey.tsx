import Reveal from "./Reveal";
import { timeline } from "@/data/site";

export default function Journey() {
    return (
        <section id="journey" className="scroll-mt-20 border-y border-line-soft bg-surface-sunken px-6 py-24 sm:px-10 sm:py-32">
            <div className="mx-auto grid max-w-content gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
                <Reveal className="lg:sticky lg:top-[calc(var(--nav-h)+3rem)] lg:self-start">
                    <p className="text-label uppercase text-ink-quaternary">The path</p>
                    <h2 className="mt-4 text-display-sm font-light text-ink sm:text-display">
                        From auditing systems to <em className="font-serif italic">building them.</em>
                    </h2>
                    <p className="mt-6 max-w-md text-body-lg font-light leading-relaxed text-ink-tertiary">
                        Most engineers learn controls after something breaks. He started with them:
                        testing AML programs, presenting findings to compliance chiefs. Each role
                        since has added a layer on top of that one.
                    </p>
                </Reveal>

                <ol className="relative">
                    {timeline.map((step, i) => {
                        const latest = i === timeline.length - 1;
                        return (
                            <li key={step.period + step.role} className="relative pb-12 pl-10 last:pb-0">
                                {/* Each step draws the rail down to the next dot, so
                                    it ends exactly at the last one whatever the text length. */}
                                {!latest && (
                                    <span aria-hidden className="absolute -bottom-1.5 left-[7px] top-5 w-px bg-line" />
                                )}
                                <span
                                    aria-hidden
                                    className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border ${
                                        latest ? "border-ink bg-ink" : "border-line bg-surface"
                                    }`}
                                />
                                <Reveal delay={i * 0.04}>
                                    <p className="text-label uppercase tabular-nums text-ink-quaternary">{step.period}</p>
                                    <p className="mt-2 font-serif text-title italic text-ink">{step.lesson}</p>
                                    <p className="mt-1.5 text-caption font-medium text-ink-secondary">
                                        {step.role} <span className="font-normal text-ink-tertiary">· {step.org}</span>
                                    </p>
                                    <p className="mt-3 max-w-lg text-body leading-relaxed text-ink-tertiary">{step.detail}</p>
                                </Reveal>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </section>
    );
}
