import Reveal from "./Reveal";

export default function SectionHeading({
    eyebrow,
    title,
    children,
    aside,
}: {
    eyebrow: string;
    title: React.ReactNode;
    children?: React.ReactNode;
    aside?: React.ReactNode;
}) {
    return (
        <Reveal className="mb-12 flex flex-col justify-between gap-6 sm:mb-16 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
                <p className="text-label uppercase text-ink-quaternary">{eyebrow}</p>
                <h2 className="mt-4 text-display-sm font-light text-ink sm:text-display">{title}</h2>
                {children && (
                    <p className="mt-5 text-body-lg font-light leading-relaxed text-ink-tertiary">{children}</p>
                )}
            </div>
            {aside}
        </Reveal>
    );
}
