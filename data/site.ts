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

/** Headline figures. `source` is the project id the number comes from. */
export const metrics: Array<{ value: string; label: string; source?: string }> = [
    { value: "7", label: "years in regulated financial services" },
    { value: "6h → 1h", label: "per reporting run, weekly cadence made daily", source: "liquidity-platform" },
    { value: "265", label: "Tier-1 analytics assets at 100% production availability", source: "cloud-modernization" },
    { value: "600+", label: "professionals upskilled through a certification program he built", source: "certification-center" },
];

/** Case studies given full-width treatment on the home page, in order. */
export const featuredIds = [
    "liquidity-platform",
    "cloud-modernization",
    "ai-portfolio",
    "regulatory-reporting",
] as const;

/**
 * The career arc, oldest first. Each step adds a layer rather than replacing
 * the last — that accumulation is the point of the section.
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
        lesson: "The ledger",
        detail: "Trained as an accountant, then licensed as a CPA: every number needs evidence behind it.",
    },
    {
        period: "2019 – 2021",
        org: "Ernst & Young",
        role: "Enterprise Risk, Financial Services",
        lesson: "The auditor's eye",
        detail:
            "Independent AML, BSA and OFAC controls assessments. Reported findings to Chief Compliance Officers and Chief Audit Executives.",
    },
    {
        period: "2021 – 2024",
        org: "Ernst & Young",
        role: "AI & Data Senior, Technology Consulting",
        lesson: "The builder",
        detail:
            "On-site lead building production data models, ingestion frameworks and PII masking controls. Ran platform proofs of concept that shaped client modernization decisions.",
    },
    {
        period: "2024 – 2026",
        org: "Ernst & Young",
        role: "AI & Data Manager, Technology Consulting",
        lesson: "The owner",
        detail:
            "Forward-deployed technical owner across enterprise clients, from executive discovery through value realization.",
    },
    {
        period: "2026 –",
        org: "Deloitte",
        role: "Senior Forward Deployed Engineer",
        lesson: "The agent era",
        detail:
            "Builds and deploys production GenAI platforms and agentic workflows directly alongside client teams.",
    },
];

/** How an engagement runs. Phrased from the resume's own account of the work. */
export const method: Array<{ step: string; title: string; body: string }> = [
    {
        step: "01",
        title: "Sit with the business",
        body: "Executive discovery and walkthroughs with the people doing the work, to map the real workflow and the pain points in it before choosing any technology.",
    },
    {
        step: "02",
        title: "Design the whole system",
        body: "End-to-end architecture across ingestion, governance, analytics and BI, with metadata, lineage and data quality designed in from the start.",
    },
    {
        step: "03",
        title: "Build it personally",
        body: "Hands-on delivery of the models, pipelines and agents themselves, working inside the client's environment alongside their team.",
    },
    {
        step: "04",
        title: "Prove it in production",
        body: "Controlled environments, CI/CD promotion and demonstrations with users, then staying with it until the outcome is measurable.",
    },
];

export const certifications = [
    { name: "Certified Public Accountant", short: "CPA" },
    { name: "SnowPro Advanced: Data Architect", short: "Snowflake" },
    { name: "SnowPro Advanced: Data Engineer", short: "Snowflake" },
    { name: "SnowPro Core", short: "Snowflake" },
    { name: "Databricks Certified Data Engineer Associate", short: "Databricks" },
];

export const stack: Array<{ group: string; items: string[] }> = [
    { group: "AI", items: ["GenAI platforms", "Agentic workflows", "RAG", "Vector search", "Gemini"] },
    { group: "Data", items: ["Snowflake", "Databricks", "dbt", "Prefect", "SQL", "Python"] },
    { group: "Cloud", items: ["Azure", "AWS", "CI/CD", "Power BI"] },
    { group: "Domain", items: ["AML / BSA / OFAC", "Liquidity reporting", "Data governance", "PII controls"] },
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
