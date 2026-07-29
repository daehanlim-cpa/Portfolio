import RecruiterChat from "@/components/RecruiterChat";

export const metadata = {
    title: "Daehan Lim | Ask me anything",
    description:
        "Ask Daehan Lim's AI assistant about his work, projects, and background. Answers are grounded in his resume and project case studies.",
};

export default function HomePage() {
    // Offset matches the sticky CategoryNav, measured: 104px on mobile where it
    // wraps to two rows, 85px from the sm breakpoint up. Keep in sync if the
    // nav's padding changes, or the composer clips off the bottom of the screen.
    return (
        <div className="h-[calc(100dvh-104px)] sm:h-[calc(100dvh-85px)]">
            <RecruiterChat variant="landing" />
        </div>
    );
}
