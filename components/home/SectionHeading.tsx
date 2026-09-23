import Reveal from "./Reveal";

/**
 * Two-tone headline: the statement in ink, its qualifier in grey. One idea per
 * section, stated once, large, with nothing competing beside it.
 */
export default function SectionHeading({
    eyebrow,
    title,
    muted,
    children,
    align = "left",
}: {
    eyebrow: string;
    title: string;
    muted?: string;
    children?: React.ReactNode;
    align?: "left" | "center";
}) {
    const centered = align === "center";
    return (
        <Reveal className={`mb-14 max-w-3xl sm:mb-20 ${centered ? "mx-auto text-center" : ""}`}>
            <p className="text-caption font-medium text-ink-tertiary">{eyebrow}</p>
            <h2 className="mt-3 text-display-sm font-semibold tracking-[-0.03em] text-ink sm:text-display lg:text-display-lg">
                {title}
                {muted && <span className="text-ink-quaternary"> {muted}</span>}
            </h2>
            {children && (
                <p className={`mt-6 text-body-lg leading-relaxed text-ink-tertiary sm:text-title-sm sm:leading-[1.45] ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
                    {children}
                </p>
            )}
        </Reveal>
    );
}
