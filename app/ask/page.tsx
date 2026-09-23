import RecruiterChat from "@/components/RecruiterChat";

export const metadata = {
    title: "Ask",
    description:
        "Ask Daehan Lim's AI assistant about his work, projects and background. Answers are grounded in the content of his website.",
};

export default async function AskPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
    const { q } = await searchParams;
    const question = typeof q === "string" ? q.slice(0, 500) : undefined;

    // --nav-h is defined once in globals.css and consumed by both the nav and
    // this view, so the two cannot drift out of sync.
    return (
        <div className="h-[calc(100dvh-var(--nav-h))]">
            <RecruiterChat variant="landing" initialQuestion={question} />
        </div>
    );
}
