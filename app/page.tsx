import Hero from "@/components/home/Hero";
import Metrics from "@/components/home/Metrics";
import FeaturedWork from "@/components/home/FeaturedWork";
import Journey from "@/components/home/Journey";
import Method from "@/components/home/Method";
import Toolkit from "@/components/home/Toolkit";
import Closing from "@/components/home/Closing";
import BlogSection from "@/components/BlogSection";

/**
 * The page is an argument in order: the claim (hero), the evidence (numbers,
 * then the work behind them), why it's credible (the path), how it's done
 * (method), the qualifications, and finally what to do about it.
 */
export default function HomePage() {
    return (
        <>
            <Hero />
            <Metrics />
            <FeaturedWork />
            <Journey />
            <Method />
            <Toolkit />
            <section className="px-6 pb-24 sm:px-10 sm:pb-32">
                <div className="mx-auto max-w-content">
                    <BlogSection />
                </div>
            </section>
            <Closing />
        </>
    );
}
