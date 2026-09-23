import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
        ];
    },
};

export default nextConfig;
