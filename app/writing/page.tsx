import BlogSection from "@/components/BlogSection";

export const metadata = {
    title: "Writing",
    description: "Essays by Daehan Lim on data consulting careers and breaking into the industry, in English and Korean.",
};

export default function WritingPage() {
    return (
        <div className="px-6 pb-24 pt-14 sm:px-10 sm:pt-20">
            <div className="mx-auto max-w-content">
                <header className="mb-14 max-w-2xl sm:mb-20">
                    <p className="text-caption font-medium text-ink-tertiary">Writing</p>
                    <h1 className="mt-3 text-display-sm font-semibold tracking-[-0.03em] text-ink sm:text-display lg:text-display-lg">
                        Notes on the craft. <span className="text-ink-quaternary">And the career.</span>
                    </h1>
                    <p className="mt-6 text-body-lg font-light leading-relaxed text-ink-tertiary">
                        Written for people starting out in data and consulting. Every post is in
                        English and Korean.
                    </p>
                </header>
                <BlogSection showHeading={false} />
            </div>
        </div>
    );
}
