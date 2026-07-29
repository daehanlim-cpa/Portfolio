import ResumeContent from "@/components/ResumeContent";

export const metadata = {
    title: "Resume | Daehan Lim",
    description: "Professional resume and experience of Daehan Lim, CPA",
};

export default function ResumePage() {
    return (
        <div className="min-h-screen px-6 pb-24 pt-16 sm:px-8 sm:pt-24">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-14 text-display-sm font-light text-ink sm:text-display">Resume</h1>

                {/* Full Resume Content Only */}
                <ResumeContent />
            </div>
        </div>
    );
}
