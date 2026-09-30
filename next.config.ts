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
    /*
     * Browser-level protection for every page. The CSP allows only this site's
     * own scripts, styles, fonts and API: inline scripts are needed for Next's
     * hydration payload, the theme script and the JSON-LD block, and
     * vercel.live for Vercel's preview toolbar. Applied in production only,
     * since the dev server needs eval for hot reloading.
     */
    async headers() {
        if (process.env.NODE_ENV !== "production") return [];
        const csp = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://vercel.live",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "font-src 'self'",
            "connect-src 'self' https://vercel.live wss://ws-us3.pusher.com",
            "frame-src https://vercel.live",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
        ].join("; ");
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "Content-Security-Policy", value: csp },
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
                    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
                ],
            },
        ];
    },
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
