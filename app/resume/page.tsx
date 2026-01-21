import ResumeContent from "@/components/ResumeContent";

export const metadata = {
    title: "Resume | Daehan Lim",
    description: "Professional resume and experience of Daehan Lim, CPA",
};

export default function ResumePage() {
    return (
        <div className="min-h-screen px-6 py-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-light mb-12">Resume</h1>

                {/* Full Resume Content Only */}
                <ResumeContent />
            </div>
        </div>
    );
}
