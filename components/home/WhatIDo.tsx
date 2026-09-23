import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { method } from "@/data/site";

/** Section 1: what a Forward Deployed Engineer is, told as how the work runs. */
export default function WhatIDo() {
    return (
        <section id="fde" className="scroll-mt-20 px-6 pb-28 sm:px-10 sm:pb-40">
            <div className="mx-auto max-w-content">
                <SectionHeading
                    eyebrow="Forward Deployed Engineer"
                    title="The problem and the code."
                    muted="Same person, same room."
                >
                    I work inside the client&rsquo;s team. I run the discovery, design the
                    architecture, write the code, and stay until it works in production, so nothing
                    gets lost between the conversation and the commit.
                </SectionHeading>

                <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {method.map((m, i) => (
                        <li key={m.step}>
                            <Reveal delay={i * 0.06} className="flex h-full flex-col rounded-xl bg-surface-muted p-8">
                                <span className="text-caption font-medium tabular-nums text-ink-quaternary">{m.step}</span>
                                <h3 className="mt-14 text-title-sm font-semibold tracking-[-0.02em] text-ink">{m.title}</h3>
                                <p className="mt-3 text-body leading-relaxed text-ink-tertiary">{m.body}</p>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
