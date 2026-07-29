/**
 * The mark is a "D" drawn as an aperture rather than a letterform, so it reads
 * as a shape at 20px where a glyph would just look small. No drop shadow: the
 * previous version had one, which made a 32px chip look like it was hovering.
 */
export default function Logo() {
    return (
        <span className="flex items-center gap-2.5">
            <span
                aria-hidden
                className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-ink text-white"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M8.5 6.5h4.25a5.25 5.25 0 0 1 0 10.5H8.5V6.5Z"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span className="text-caption font-medium tracking-[-0.011em] text-ink">
                Daehan Lim
            </span>
        </span>
    );
}
