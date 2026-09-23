import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { method } from "@/data/site";

export default function Method() {
    return (
        <section className="px-6 py-24 sm:px-10 sm:py-32">
            <div className="mx-auto max-w-content">
                <SectionHeading
                    eyebrow="How an engagement runs"
                    title={
                        <>
                            Forward deployed means <em className="font-serif italic">in the room.</em>
                        </>
                    }
                >
                    The same person runs the discovery, draws the architecture and writes the code,
                    so nothing is lost between the conversation and the commit.
                </SectionHeading>

                <ol className="grid gap-px overflow-hidden rounded-xl border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
                    {method.map((m, i) => (
                        <li key={m.step} className="bg-surface">
                            <Reveal delay={i * 0.06} className="h-full p-7 sm:p-8">
                                <span className="font-serif text-title italic text-ink-quaternary">{m.step}</span>
                                <h3 className="mt-10 text-title-sm font-normal text-ink">{m.title}</h3>
                                <p className="mt-3 text-caption leading-relaxed text-ink-tertiary">{m.body}</p>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
