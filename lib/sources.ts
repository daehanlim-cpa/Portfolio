import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";

/**
 * Picks the pages to link under an answer ("sources" chips). The assistant reads
 * the whole site, so there is no retrieval step to take them from; instead this
 * scores each case study and blog post by keyword overlap with the question.
 * Free, instant, and good enough for a handful of links. When nothing clearly
 * matches, no chips are shown, which is better than irrelevant ones.
 */

const STOPWORDS = new Set(
    (
        "a an and are as at be but by can could did do does for from had has have he her him his how i if in into is it its " +
        "me my of on or our she so than that the their them then there these they this to too us was we were what when " +
        "where which who why will with would you your about tell more any some most much also just like work worked"
    ).split(" ")
);

function terms(text: string): string[] {
    return (text.toLowerCase().match(/[a-z0-9+#]+/g) ?? []).filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

interface Candidate {
    title: string;
    href: string;
    /** Strong signals: words in the title. */
    strong: Set<string>;
    /** Weaker signals: description, stack, categories. */
    weak: Set<string>;
}

let candidates: Candidate[] | null = null;

function allCandidates(): Candidate[] {
    if (candidates) return candidates;
    candidates = [
        ...projects.map((p) => ({
            title: p.title,
            href: `/project/${p.id}`,
            strong: new Set(terms(p.title)),
            weak: new Set(terms([p.shortDescription, p.techStack.join(" "), p.categories.join(" "), p.metrics.map((m) => m.label).join(" ")].join(" "))),
        })),
        ...blogPosts.map((post) => ({
            title: post.title.en,
            href: `/blog/${post.slug}`,
            strong: new Set(terms(post.title.en)),
            weak: new Set(terms([post.description.en, (post.tags ?? []).join(" ")].join(" "))),
        })),
    ];
    return candidates;
}

/** A title-word hit counts 2, anything else 1. A match needs a score of at least 2. */
const MIN_SCORE = 2;

export function pickSources(question: string, limit = 3): Array<{ title: string; href: string }> {
    const asked = new Set(terms(question));
    if (asked.size === 0) return [];

    return allCandidates()
        .map((c) => {
            let score = 0;
            for (const t of asked) score += c.strong.has(t) ? 2 : c.weak.has(t) ? 1 : 0;
            return { c, score };
        })
        .filter(({ score }) => score >= MIN_SCORE)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ c }) => ({ title: c.title, href: c.href }));
}
