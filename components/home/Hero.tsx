import Link from "next/link";
import { profile } from "@/data/site";

/**
 * One statement, centred, with room around it. Nothing sits beside the
 * headline: the page earns attention by what it leaves out.
 */
export default function Hero() {
    return (
        <section className="px-6 pb-28 pt-24 text-center sm:px-10 sm:pb-40 sm:pt-36 lg:pt-44">
            <div className="mx-auto max-w-4xl animate-fade-up">
                <p className="text-body-lg font-medium text-ink-tertiary">
                    {profile.name}, {profile.credential}
                </p>
                <h1 className="mt-4 text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.04em] text-ink sm:text-display-lg lg:text-display-xl">
                    Forward Deployed Engineer.
                </h1>
                <p className="mx-auto mt-7 max-w-2xl text-title-sm font-normal leading-[1.4] text-ink-tertiary sm:text-title sm:leading-[1.3]">
                    I learn how a business really works, then build the AI and data systems it
                    runs on.
                </p>
                <div className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                    <Link
                        href="/work"
                        className="rounded-full bg-ink px-6 py-3 text-body font-medium text-on-ink transition-opacity hover:opacity-85"
                    >
                        See the work
                    </Link>
                    <Link href="/ask" className="group text-body font-medium text-accent">
                        Ask my AI assistant{" "}
                        <span aria-hidden className="inline-block transition-transform group-hover:translate-x-0.5">
                            ›
                        </span>
                    </Link>
                </div>
                <p className="mt-16 text-caption text-ink-quaternary">
                    {profile.role} at {profile.employer} · {profile.location}
                </p>
            </div>
        </section>
    );
}
