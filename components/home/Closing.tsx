import Link from "next/link";
import Reveal from "./Reveal";
import { profile } from "@/data/site";

const QUESTIONS = [
    "Would he fit a forward deployed role on my team?",
    "What would he be weakest at?",
    "How has he used GenAI with compliance data?",
];

/**
 * The one inverted section. Ink on ink-surface draws the eye to the two ways
 * to act on everything above: talk to him, or interrogate the assistant.
 */
export default function Closing() {
    return (
        <section className="px-4 pb-24 sm:px-8 sm:pb-32">
            <Reveal className="mx-auto max-w-[76rem] overflow-hidden rounded-xl bg-ink px-7 py-16 text-on-ink sm:px-14 sm:py-20">
                <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
                    <div>
                        <p className="text-label uppercase opacity-60">Get in touch</p>
                        <h2 className="mt-4 text-display-sm font-light sm:text-display">
                            Have something that has to <em className="font-serif italic">hold up?</em>
                        </h2>
                        <p className="mt-6 max-w-md text-body-lg font-light leading-relaxed opacity-70">
                            Roles, engagements, or a hard data problem in a regulated setting. Email
                            gets a reply.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <a
                                href={`mailto:${profile.email}`}
                                className="rounded-full bg-on-ink px-5 py-2.5 text-caption font-medium text-ink transition-opacity hover:opacity-85"
                            >
                                {profile.email}
                            </a>
                            <a
                                href={profile.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-current px-5 py-2.5 text-caption opacity-80 transition-opacity hover:opacity-100"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>

                    <div className="lg:border-l lg:border-[color-mix(in_srgb,var(--on-ink)_14%,transparent)] lg:pl-20">
                        <p className="text-label uppercase opacity-60">Or ask first</p>
                        <p className="mt-4 text-body-lg font-light leading-relaxed opacity-70">
                            The assistant answers from his resume and case studies, and says so when
                            something isn&rsquo;t in them.
                        </p>
                        <ul className="mt-8 space-y-2.5">
                            {QUESTIONS.map((q) => (
                                <li key={q}>
                                    <Link
                                        href={`/ask?q=${encodeURIComponent(q)}`}
                                        className="group flex items-center justify-between gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--on-ink)_18%,transparent)] px-5 py-3.5 text-caption transition-colors hover:bg-[color-mix(in_srgb,var(--on-ink)_8%,transparent)]"
                                    >
                                        {q}
                                        <span aria-hidden className="opacity-50 transition-transform group-hover:translate-x-0.5">
                                            →
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
