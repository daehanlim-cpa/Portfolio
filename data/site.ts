/**
 * Home-page copy and curated facts, kept apart from the components so the page
 * can be edited without touching layout code.
 *
 * Every figure here is lifted from content/resume.md or data/projects.ts. If a
 * number changes there, change it here too — nothing on this page should claim
 * more than the source material does.
 */

export const profile = {
    name: "Daehan Lim",
    credential: "CPA",
    role: "Senior Forward Deployed Engineer",
    employer: "Deloitte",
    location: "Costa Mesa, California",
    email: "daehanlim1@gmail.com",
    linkedin: "https://www.linkedin.com/in/daehan-lim-cpa/",
    site: "https://daehanlim.com",
};

/**
 * Headline figures for the top of the work section, each from a case study.
 * `source` is the project id, so every number links to its evidence.
 */
export const metrics: Array<{ value: string; label: string; source: string }> = [
    { value: "435+", label: "enterprise data requests delivered with zero backlog", source: "cloud-modernization" },
    { value: "6h → 1h", label: "per reporting run, with weekly reporting made daily", source: "liquidity-platform" },
    { value: "600+", label: "professionals upskilled through a program I co-founded", source: "certification-center" },
    { value: "3,000+", label: "hours of platform training after a strategic platform decision", source: "regulatory-reporting" },
];

/** Case studies featured on the home page, in order. */
export const featuredIds = [
    "cloud-modernization",
    "liquidity-platform",
    "regulatory-reporting",
    "ai-portfolio",
] as const;

/**
 * The career arc, oldest first: domain knowledge first, then the build skills
 * layered on top of it. Each step adds range rather than replacing the last.
 */
export const timeline: Array<{
    period: string;
    org: string;
    role: string;
    lesson: string;
    detail: string;
}> = [
    {
        period: "2019",
        org: "University of Arizona",
        role: "B.S. Accounting & Management Information Systems",
        lesson: "Foundation",
        detail: "Studied accounting and information systems, then earned the CPA. Learned how a business really works by following its numbers.",
    },
    {
        period: "2019 – 2021",
        org: "Ernst & Young",
        role: "Enterprise Risk, Financial Services",
        lesson: "Domain",
        detail:
            "Worked inside banks and digital-asset platforms, presenting to their compliance and audit leadership. Learned what institutions care about, and why.",
    },
    {
        period: "2021 – 2024",
        org: "Ernst & Young",
        role: "AI & Data Senior, Technology Consulting",
        lesson: "Build",
        detail:
            "Moved into engineering: production data models, ingestion frameworks, PII masking, and platform proofs of concept that shaped modernization decisions.",
    },
    {
        period: "2024 – 2026",
        org: "Ernst & Young",
        role: "AI & Data Manager, Technology Consulting",
        lesson: "Own",
        detail:
            "Forward-deployed technical owner across enterprise clients, from executive discovery through value realization.",
    },
    {
        period: "2026 –",
        org: "Deloitte",
        role: "Senior Forward Deployed Engineer",
        lesson: "Deploy AI",
        detail:
            "Building and deploying production GenAI platforms and agentic workflows alongside client teams.",
    },
];

/** How an engagement runs. Phrased from the resume's own account of the work. */
export const method: Array<{ step: string; title: string; body: string }> = [
    {
        step: "01",
        title: "Understand the business",
        body: "Executive discovery and walkthroughs with the people doing the work. I map the real workflow and its pain points before choosing any technology.",
    },
    {
        step: "02",
        title: "Design the whole system",
        body: "End-to-end architecture across ingestion, governance, analytics and AI, with data quality and lineage designed in from the start.",
    },
    {
        step: "03",
        title: "Build it myself",
        body: "Hands-on delivery of the models, pipelines and agents, inside the client's environment and alongside their team.",
    },
    {
        step: "04",
        title: "Ship it and prove it",
        body: "Controlled environments, CI/CD and demonstrations with users. I stay with it until the outcome is measurable.",
    },
];

/** Newest first. The resume page renders this same list. */
export const certifications = [
    { name: "Claude Certified Architect – Foundations", issuer: "Anthropic" },
    { name: "Gemini Enterprise Agent Development, Certified Partner Specialist", issuer: "Google" },
    { name: "Gemini Enterprise Deployment, Certified Partner Specialist", issuer: "Google" },
    { name: "SnowPro Specialty: Gen AI", issuer: "Snowflake" },
    { name: "SnowPro Advanced: Data Architect", issuer: "Snowflake" },
    { name: "SnowPro Advanced: Data Engineer", issuer: "Snowflake" },
    { name: "SnowPro Core", issuer: "Snowflake" },
    { name: "Databricks Certified Data Engineer Associate", issuer: "Databricks" },
    { name: "Certified Public Accountant", issuer: "CPA" },
];

export const stack: Array<{ group: string; items: string[] }> = [
    { group: "AI", items: ["GenAI platforms", "Agentic workflows", "RAG", "Gemini Enterprise", "Claude"] },
    { group: "Data", items: ["Snowflake", "Databricks", "dbt", "Prefect", "SQL", "Python"] },
    { group: "Cloud", items: ["Azure", "AWS", "CI/CD", "Power BI"] },
    { group: "Domain", items: ["Financial services", "Accounting", "Risk & compliance", "Data governance"] },
];

export const education = [
    {
        school: "University of the Cumberlands",
        degree: "Ph.D., Information Technology, Artificial Intelligence",
        period: "In progress",
    },
    {
        school: "University of the Cumberlands",
        degree: "M.S., Global Business with Blockchain Technology",
        period: "2024",
    },
    {
        school: "University of Arizona, Eller College of Management",
        degree: "B.S., Accounting & Management Information Systems",
        period: "2019",
    },
];
