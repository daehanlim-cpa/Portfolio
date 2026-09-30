import Link from "next/link";
import Reveal from "./Reveal";
import { profile } from "@/data/site";

const QUESTIONS = [
    "Would he fit a forward deployed role on my team?",
    "What has he built with GenAI?",
    "What would he be weakest at?",
];

/** The close: two ways to act on everything above. */
export default function Closing() {
    return (
        <section className="px-6 py-28 text-center sm:px-10 sm:py-40">
            <Reveal className="mx-auto max-w-3xl">
                <p className="text-caption font-medium text-ink-tertiary">Get in touch</p>
                <h2 className="mt-3 text-display-sm font-semibold tracking-[-0.03em] text-ink sm:text-display lg:text-display-lg">
                    Have a problem worth building for?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-body-lg leading-relaxed text-ink-tertiary sm:text-title-sm sm:leading-[1.45]">
                    Roles, engagements, or a hard problem you want someone to sit with. Email gets a
                    reply.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                    <a
                        href={`mailto:${profile.email}`}
                        className="rounded-full bg-ink px-6 py-3 text-body font-medium text-on-ink transition-opacity hover:opacity-85"
                    >
                        Email me
                    </a>
                    <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group text-body font-medium text-accent"
                    >
                        Connect on LinkedIn{" "}
                        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                            ›
                        </span>
                    </a>
                </div>
            </Reveal>

            <Reveal delay={0.08} className="mx-auto mt-20 max-w-2xl">
                <p className="text-caption text-ink-quaternary">Or ask the AI assistant, which answers from everything on this site</p>
                <ul className="mt-5 flex flex-wrap justify-center gap-2">
                    {QUESTIONS.map((q) => (
                        <li key={q}>
                            <Link
                                href={`/ask?q=${encodeURIComponent(q)}`}
                                className="block rounded-full border border-line px-4 py-2 text-caption text-ink-secondary transition-colors hover:border-ink-quaternary hover:text-ink"
                            >
                                {q}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Reveal>
        </section>
    );
}
