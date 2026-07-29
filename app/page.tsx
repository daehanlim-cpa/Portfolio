import RecruiterChat from "@/components/RecruiterChat";

export const metadata = {
    title: "Daehan Lim | Ask me anything",
    description:
        "Ask Daehan Lim's AI assistant about his work, projects, and background. Answers are grounded in his resume and project case studies.",
};

export default function HomePage() {
    // --nav-h is defined once in globals.css and consumed by both the nav and
    // this view, so the two cannot drift out of sync.
    return (
        <div className="h-[calc(100dvh-var(--nav-h))]">
            <RecruiterChat variant="landing" />
        </div>
    );
}
