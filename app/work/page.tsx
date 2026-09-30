import WorkIndex from "@/components/work/WorkIndex";

export const metadata = {
    title: "Work",
    description:
        "Case studies from Daehan Lim: enterprise data platforms, GenAI and RAG systems, platform strategy, and AML and regulatory controls work.",
};

export default function WorkPage() {
    return (
        <div className="px-6 pb-24 pt-14 sm:px-10 sm:pt-20">
            <div className="mx-auto max-w-content">
                <header className="mb-12 max-w-5xl sm:mb-16">
                    <p className="text-caption font-medium text-ink-tertiary">Work</p>
                    <h1 className="mt-3 text-display-sm font-semibold tracking-[-0.03em] text-ink sm:text-display lg:text-display-lg">
                        <span className="block">Measured in outcomes.</span>
                        <span className="block text-ink-quaternary">Every number is real.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-ink-tertiary">
                        Client engagements, independent builds, and pro bono work. Client names are
                        withheld. Where a figure wasn&rsquo;t tracked, the case study says so instead
                        of estimating one.
                    </p>
                </header>
                <WorkIndex />
            </div>
        </div>
    );
}
