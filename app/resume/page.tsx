import ResumeContent from "@/components/ResumeContent";

export const metadata = {
    title: "Resume",
    description: "Professional resume and experience of Daehan Lim, CPA",
};

export default function ResumePage() {
    return (
        <div className="px-6 pb-24 pt-14 sm:px-8 sm:pt-20">
            <div className="mx-auto max-w-3xl">
                <header className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-caption font-medium text-ink-tertiary">Resume</p>
                        <h1 className="mt-3 text-display-sm font-semibold tracking-[-0.03em] text-ink sm:text-display">Experience &amp; credentials</h1>
                    </div>
                    <a
                        href="mailto:daehanlim1@gmail.com"
                        className="self-start rounded-full bg-ink px-5 py-2.5 text-caption font-medium text-on-ink transition-opacity hover:opacity-85 sm:self-auto"
                    >
                        Get in touch
                    </a>
                </header>

                {/* Full Resume Content Only */}
                <ResumeContent />
            </div>
        </div>
    );
}
