import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [],
    },
    /*
     * The four grid routes and the skill-category pages collapsed into a single
     * filtered /experience view. These keep old links, shares, and any search
     * index entries working instead of 404ing.
     */
    async redirects() {
        return [
            { source: "/work", destination: "/experience", permanent: true },
            { source: "/professional", destination: "/experience", permanent: true },
            { source: "/projects", destination: "/experience", permanent: true },
            { source: "/purpose", destination: "/experience", permanent: true },
            { source: "/skill/:category", destination: "/experience", permanent: true },
            // /projects/[slug] was an unlinked duplicate of /project/[id],
            // which remains the canonical case-study route.
            { source: "/projects/:slug", destination: "/project/:slug", permanent: true },
        ];
    },
};

export default nextConfig;
