import RecruiterChat from "@/components/RecruiterChat";

export const metadata = {
    title: "Ask About Daehan",
    description:
        "Ask Daehan Lim's AI assistant how his experience maps to the role you're hiring for. Answers are grounded in his resume and project work.",
};

export default function ChatPage() {
    // Offset accounts for the sticky CategoryNav above it.
    return (
        <div className="h-[calc(100dvh-73px)] sm:h-[calc(100dvh-89px)]">
            <RecruiterChat />
        </div>
    );
}
