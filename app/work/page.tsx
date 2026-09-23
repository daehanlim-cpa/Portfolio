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
                <header className="mb-12 max-w-2xl sm:mb-16">
                    <p className="text-label uppercase text-ink-quaternary">Work</p>
                    <h1 className="mt-4 text-display-sm font-light text-ink sm:text-display-lg">
                        The problem, the build, <em className="font-serif italic">the result.</em>
                    </h1>
                    <p className="mt-6 text-body-lg font-light leading-relaxed text-ink-tertiary">
                        Client engagements, things built independently, and work that isn&rsquo;t
                        about the money. Client names are withheld; everything else is as it
                        happened.
                    </p>
                </header>
                <WorkIndex />
            </div>
        </div>
    );
}
