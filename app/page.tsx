import Hero from "@/components/home/Hero";
import WhatIDo from "@/components/home/WhatIDo";
import Journey from "@/components/home/Journey";
import Work from "@/components/home/Work";
import Toolkit from "@/components/home/Toolkit";
import Closing from "@/components/home/Closing";
import BlogSection from "@/components/BlogSection";

/**
 * Three acts, in order: what a Forward Deployed Engineer does, the path that
 * led here, and the work it produced. Credentials, writing and contact follow.
 */
export default function HomePage() {
    return (
        <>
            <Hero />
            <WhatIDo />
            <Journey />
            <Work />
            <Toolkit />
            <section className="px-6 pt-28 sm:px-10 sm:pt-40">
                <div className="mx-auto max-w-content">
                    <BlogSection />
                </div>
            </section>
            <Closing />
        </>
    );
}
