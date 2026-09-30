import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";
import { profile } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const url = (path: string) => `${profile.site}${path}`;
    return [
        { url: url("/"), changeFrequency: "monthly", priority: 1 },
        { url: url("/work"), changeFrequency: "monthly", priority: 0.9 },
        { url: url("/resume"), changeFrequency: "monthly", priority: 0.8 },
        { url: url("/writing"), changeFrequency: "monthly", priority: 0.6 },
        { url: url("/ask"), changeFrequency: "yearly", priority: 0.5 },
        ...projects.map((p) => ({ url: url(`/project/${p.id}`), changeFrequency: "yearly" as const, priority: 0.7 })),
        ...blogPosts.map((p) => ({ url: url(`/blog/${p.slug}`), lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.5 })),
    ];
}
