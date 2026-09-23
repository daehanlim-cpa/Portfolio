import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /*
     * The assistant reads content/resume.md at runtime (lib/corpus.ts). File
     * tracing can't always see a runtime fs read, so include it explicitly or
     * the deployed functions won't have the file.
     */
    outputFileTracingIncludes: {
        "/api/chat": ["./content/**/*"],
        "/api/followups": ["./content/**/*"],
    },
    images: {
        remotePatterns: [],
    },
    /*
     * Every earlier grid route — the four type pages, the skill-category pages
     * and the /experience view that replaced them — now lands on /work. These
     * keep old links, shares and search index entries working instead of 404ing.
     */
    async redirects() {
        return [
            { source: "/experience", destination: "/work", permanent: true },
            { source: "/professional", destination: "/work", permanent: true },
            { source: "/projects", destination: "/work", permanent: true },
            { source: "/purpose", destination: "/work", permanent: true },
            { source: "/skill/:category", destination: "/work", permanent: true },
            // /projects/[slug] was an unlinked duplicate of /project/[id],
            // which remains the canonical case-study route.
            { source: "/projects/:slug", destination: "/project/:slug", permanent: true },
            // DL-09 duplicated DL-06 (same engagement) and was merged into it.
            {
                source: "/project/liquidity-controls",
                destination: "/project/data-governance",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
