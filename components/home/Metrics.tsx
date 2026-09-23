import Link from "next/link";
import Reveal from "./Reveal";
import { metrics } from "@/data/site";

export default function Metrics() {
    return (
        <section aria-label="Results" className="px-6 sm:px-10">
            <div className="mx-auto grid max-w-content gap-px overflow-hidden rounded-xl border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((m, i) => {
                    const body = (
                        <>
                            <p className="font-serif text-display-sm leading-none text-ink sm:text-display">{m.value}</p>
                            <p className="mt-4 max-w-[15rem] text-caption text-ink-tertiary">{m.label}</p>
                            {m.source && (
                                <span className="mt-5 inline-block text-label uppercase text-ink-quaternary transition-colors group-hover:text-ink">
                                    See the case study →
                                </span>
                            )}
                        </>
                    );
                    return (
                        <Reveal key={m.label} delay={i * 0.06} className="bg-surface">
                            {m.source ? (
                                <Link
                                    href={`/project/${m.source}`}
                                    className="group block h-full p-7 transition-colors hover:bg-surface-sunken sm:p-8"
                                >
                                    {body}
                                </Link>
                            ) : (
                                <div className="h-full p-7 sm:p-8">{body}</div>
                            )}
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}
