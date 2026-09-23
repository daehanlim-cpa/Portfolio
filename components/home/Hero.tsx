import Link from "next/link";
import AskBox from "./AskBox";
import PipelineDiagram from "./PipelineDiagram";
import { profile } from "@/data/site";

const CREDENTIALS = ["CPA", "SnowPro Advanced ×2", "Databricks Certified", "Ph.D. in AI, in progress"];

export default function Hero() {
    return (
        <section className="relative overflow-hidden px-6 pb-20 pt-14 sm:px-10 sm:pb-28 sm:pt-20 lg:pt-24">
            <div className="mx-auto grid max-w-content items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
                <div className="animate-fade-up">
                    <p className="inline-flex items-center gap-2 rounded-full border border-line-soft bg-surface-raised px-3 py-1 text-caption text-ink-tertiary">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#30a46c]" />
                        {profile.role} at {profile.employer}
                    </p>

                    <h1 className="mt-7 text-display-sm font-light text-ink sm:text-display-lg xl:text-display-xl">
                        Production AI,
                        <br />
                        built to{" "}
                        <em className="font-serif font-normal italic tracking-[-0.02em]">pass the audit.</em>
                    </h1>

                    <p className="mt-7 max-w-[34rem] text-body-lg font-light leading-relaxed text-ink-secondary">
                        I&rsquo;m Daehan Lim, a CPA who became an engineer. For seven years I&rsquo;ve
                        built data platforms and GenAI systems for regulated financial institutions,
                        designed the way an auditor would want to test them.
                    </p>

                    <div className="mt-9">
                        <AskBox />
                        <p className="mt-3 pl-5 text-caption text-ink-quaternary">
                            An AI assistant answers from his resume and case studies. Or{" "}
                            <Link href="/work" className="text-ink-tertiary underline underline-offset-2 hover:text-ink">
                                go straight to the work
                            </Link>
                            .
                        </p>
                    </div>
                </div>

                <div className="relative animate-fade-up [animation-delay:120ms]">
                    <div className="bg-dots relative rounded-xl border border-line-soft bg-surface-sunken p-4 sm:p-8">
                        <PipelineDiagram />
                        <p className="mt-2 text-center text-caption text-ink-tertiary">
                            Every record passes a control before an agent acts on it.{" "}
                            <span className="text-signal">Exceptions</span> go to a person.
                        </p>
                    </div>
                </div>
            </div>

            <ul className="mx-auto mt-16 flex max-w-content flex-wrap gap-x-8 gap-y-3 border-t border-line-soft pt-6 sm:mt-24">
                {CREDENTIALS.map((c) => (
                    <li key={c} className="text-label uppercase text-ink-tertiary">
                        {c}
                    </li>
                ))}
            </ul>
        </section>
    );
}
