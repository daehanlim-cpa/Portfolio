import fs from "fs";
import path from "path";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";
import { certifications, education, method, metrics, profile, stack, timeline } from "@/data/site";

/**
 * Everything the website says, as one reference document for the assistant.
 *
 * The whole site is small (~13k tokens), so rather than retrieving pieces of it
 * per question, the assistant reads all of it every time, with prompt caching
 * making the repeat reads cheap. That means no embeddings, no index to rebuild,
 * and no relevance threshold to tune: editing a page's source data updates what
 * the assistant knows on the next deploy.
 *
 * The output must be byte-identical between requests, or the prompt cache
 * misses on every call. Only static data goes in: no timestamps, no randomness.
 */

/** content/resume.md is read at runtime; next.config.ts traces it into the API functions. */
function resume(): string {
    return fs.readFileSync(path.join(process.cwd(), "content", "resume.md"), "utf-8").trim();
}

function list(items: string[] | undefined): string {
    return items?.length ? items.map((item) => `- ${item}`).join("\n") : "";
}

function homePage(): string {
    return [
        `Name: ${profile.name}, ${profile.credential}`,
        `Current role: ${profile.role} at ${profile.employer}, ${profile.location}`,
        `Contact: ${profile.email} · LinkedIn ${profile.linkedin}`,
        `Headline: Forward Deployed Engineer. "I learn how a business really works, then build the AI and data systems it runs on."`,
        `How an engagement runs:\n${method.map((m) => `${m.step}. ${m.title}: ${m.body}`).join("\n")}`,
        `Career path (domain expert first, then builder):\n${timeline
            .map((t) => `- ${t.period} · ${t.lesson}: ${t.role}, ${t.org}. ${t.detail}`)
            .join("\n")}`,
        `Headline results:\n${metrics.map((m) => `- ${m.value}: ${m.label}`).join("\n")}`,
        `Certifications:\n${certifications.map((c) => `- ${c.name} (${c.issuer})`).join("\n")}`,
        `Toolkit:\n${stack.map((g) => `- ${g.group}: ${g.items.join(", ")}`).join("\n")}`,
        `Education:\n${education.map((e) => `- ${e.degree}, ${e.school} (${e.period})`).join("\n")}`,
    ].join("\n\n");
}

const TYPE_LABEL = { professional: "Client engagement", project: "Independent build", purpose: "Pro bono" } as const;

function caseStudy(p: (typeof projects)[number]): string {
    const sections: Array<[string, string | undefined]> = [
        ["Type", `${TYPE_LABEL[p.type]}${p.categories.length ? ` · ${p.categories.join(", ")}` : ""}`],
        ["Summary", p.shortDescription],
        ["Key figures", p.metrics.map((m) => `- ${m.value}: ${m.label}`).join("\n")],
        ["Note on figures", p.metricsNote],
        ["Context", p.overview],
        ["Baseline before", list(p.baselineKPIs)],
        ["Problem", list(p.problem)],
        ["What was built", p.solution],
        ["Capabilities", list(p.keyCapabilities)],
        ["Approach", list(p.approach)],
        ["Architecture", list(p.architectureComponents)],
        ["Governance", list(p.governance)],
        ["Outcomes", list(p.impact)],
        ["Stack", p.techStack.join(", ")],
    ];
    return sections
        .filter(([, body]) => body && body.trim())
        .map(([label, body]) => `${label}:\n${body}`)
        .join("\n\n");
}

/**
 * Each page is wrapped in a <document> tag carrying its URL, so answers can
 * point visitors to the right page and the model can tell sources apart.
 */
function doc(title: string, url: string, body: string): string {
    return `<document title="${title}" url="${url}">\n${body}\n</document>`;
}

let cached: string | null = null;

export function siteCorpus(): string {
    if (cached) return cached;
    cached = [
        doc("Home page", "/", homePage()),
        doc("Resume", "/resume", resume()),
        ...projects.map((p) => doc(`Case study: ${p.title}`, `/project/${p.id}`, caseStudy(p))),
        ...blogPosts.map((post) =>
            doc(`Blog post: ${post.title.en}`, `/blog/${post.slug}`, post.content.en.trim())
        ),
    ].join("\n\n");
    return cached;
}
