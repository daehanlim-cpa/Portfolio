import type { FlowNode } from "@/components/ArchitectureFlow";

/**
 * The AI proof-of-concept applications.
 *
 * A separate type from `Project` on purpose. A project entry describes work
 * delivered somewhere else, for someone else, and is judged on outcomes. These
 * are running software on this site, and are judged on how they are built — so
 * they carry infrastructure, architecture and design-decision fields a case
 * study does not need, and none of the impact metrics it does.
 *
 * `screenshots` ships empty. The last time this codebase referenced image files
 * that did not exist it shipped broken images to production for months
 * (see the comment in app/project/[id]/page.tsx), so the gallery renders nothing
 * at all for an empty list rather than a frame around a missing file. Drop files
 * at public/images/ai/<slug>/ and add them here to turn the section on.
 */
export interface AiApp {
    slug: string;
    name: string;
    tagline: string;
    domain: "Financial services" | "Healthcare";
    iconKey: string;
    /** Two-line pitch for the index card. */
    summary: string;
    problem: string[];
    approach: string[];
    architectureNodes: FlowNode[];
    /** "Label: value" rows, the site's existing convention. */
    infrastructure: string[];
    keyDecisions: string[];
    techStack: string[];
    screenshots: { src: string; alt: string; caption?: string }[];
    disclaimer: string;
}

/**
 * The shared architecture, stated once. Both apps run it; the domains differ,
 * the shape does not.
 */
export const PIPELINE_SHAPE =
    "Deterministic normalisation, then deterministic scoring, then a JSON-constrained reasoning call, then a streamed drafting call. The model never decides anything a rule can decide, and never sees an input a rule has not already normalised.";

export const aiApps: AiApp[] = [
    {
        slug: "aml-alert-triage",
        name: "Sentinel",
        tagline: "AML alert triage and SAR drafting",
        domain: "Financial services",
        iconKey: "Investigation",
        summary:
            "Screens a transaction alert against a sanctions list, applies the behavioural rules, scores it, and either drafts the SAR narrative or explains why the alert should close.",
        problem: [
            "The overwhelming majority of AML alerts are false positives, and every one of them is read by a human analyst before it is closed.",
            "The expensive part is not the decision — it is reconstructing the same context on every alert: who the counterparty is, whether the name matches a list, whether the pattern fits the customer's declared business.",
            "Institutions that reach for an LLM here usually point it at the raw alert and ask for a disposition, which produces an unreproducible answer no examiner will accept.",
        ],
        approach: [
            "Screen every party against the list with Jaro-Winkler and token-set matching, blended and thresholded. Deterministic, so the same name scores the same forever and the score can be recomputed by hand.",
            "Apply eight behavioural rules — structuring beneath the CTR threshold, deposits split across branches, inflow against declared profile, jurisdiction exposure, round-value wires, pass-through ratio, prior filings, counterparty repetition.",
            "Compute a composite 0-100 score as a weighted sum, so an analyst can see which component moved it.",
            "Only then call the model, and only for the two things that are genuinely language work: weighing the findings against the customer's stated business, and writing the narrative.",
            "Constrain the disposition to escalate, request information, or close — and require every point of rationale to cite a specific finding.",
        ],
        architectureNodes: [
            { label: "Intake", value: "Alert", unit: "fixture" },
            { label: "Screen", value: "10", unit: "entities", emphasis: true },
            { label: "Rules", value: "8", unit: "signals", emphasis: true },
            { label: "Score", value: "0-100", emphasis: true },
            { label: "Reason", value: "JSON", unit: "gemini" },
            { label: "Draft", value: "SAR", unit: "narrative" },
        ],
        infrastructure: [
            "Runtime: Next.js 15 App Router, Node runtime, streaming route handler",
            "Model: Gemini via @google/generative-ai — two calls per run, one JSON-constrained for the disposition and one streamed for the narrative",
            "Deterministic layer: TypeScript with no dependencies — Jaro-Winkler and token-set name matching, an eight-rule signal engine, and a weighted composite score",
            "Transport: NDJSON over a ReadableStream, one event per pipeline stage, so the fast stages render before the slow ones start",
            "Abuse controls: Upstash Redis sliding-window limits on a budget separate from the site's chat, origin pinning, and fixture-only input",
            "Data: synthetic watchlist and alerts committed to the repository — no database, no customer data, nothing to leak",
        ],
        keyDecisions: [
            "Rules before the model, never after. Everything an examiner would ask you to reproduce is computed in code; the model is confined to judgement and prose.",
            "Deterministic matching over embeddings. A vector search would score better on paper, but 'the vector said 0.83' is not defensible in an examination, and re-embedding the corpus can change the answer.",
            "The list is fictional, not a stale copy of the OFAC SDN list. A demo that appears to screen against real sanctions data invites someone to treat its output as a real screening result.",
            "The deterministic findings stream before any model call, so they survive a model outage, a missing API key, or a rate limit. Pull the key and the first four stages still run.",
            "Input is restricted to four curated alerts. No free text reaches the prompt, which removes the injection surface and makes it impossible to paste real customer data into a public page.",
        ],
        techStack: [
            "TypeScript",
            "Next.js 15",
            "Gemini API",
            "Jaro-Winkler",
            "NDJSON streaming",
            "Upstash Redis",
            "Tailwind CSS",
        ],
        screenshots: [],
        disclaimer:
            "Demonstration only. All customers, counterparties and list entries are invented, and the watchlist is synthetic rather than a copy of any real sanctions list. Output is a draft for human review, not a compliance decision, and this is not a BSA/AML product.",
    },
    {
        slug: "claims-denial-triage",
        name: "Recoup",
        tagline: "Claim denial triage and appeal drafting",
        domain: "Healthcare",
        iconKey: "Audit",
        summary:
            "Resolves a denial to its root cause, works out whether the appeal is worth its own handling cost, and drafts the letter — or explains why no letter should be written.",
        problem: [
            "A large share of denied claims are never appealed, and a large share of the ones that are appealed should not have been.",
            "Both failures have the same cause: nobody computed whether the expected recovery exceeded the cost of working the appeal.",
            "Denial codes also conflate very different situations. A contractual adjustment and a missing modifier arrive through the same remittance channel, but one is a write-off and the other is money left on the table.",
        ],
        approach: [
            "Resolve the CARC and RARC codes to category, preventability and owning department, so the denial is classified before anything reasons about it.",
            "Run the deadline arithmetic — days to file, days to adjudicate, days remaining in the appeal window — against a fixed review date, so the same case always produces the same run.",
            "Compute the recovery economics explicitly: amount at risk, assumed overturn rate, expected recovery, handling cost, and the net expected value that falls out of them.",
            "Let the arithmetic propose the action, then ask the model to agree with it or overturn it — and to say which it is doing.",
            "Draft the appropriate document for the action taken: an appeal letter, a corrected-claim cover letter, or an internal note explaining why the balance is being written off.",
        ],
        architectureNodes: [
            { label: "Intake", value: "Denial", unit: "fixture" },
            { label: "Codes", value: "20", unit: "CARC", emphasis: true },
            { label: "Rules", value: "Dates", unit: "windows", emphasis: true },
            { label: "Economics", value: "NEV", unit: "per claim", emphasis: true },
            { label: "Reason", value: "JSON", unit: "gemini" },
            { label: "Draft", value: "Letter", unit: "to payer" },
        ],
        infrastructure: [
            "Runtime: shared with Sentinel — the same streaming route handler serves both apps from a slug",
            "Model: Gemini via @google/generative-ai — JSON-constrained action reasoning, then a streamed document draft",
            "Deterministic layer: TypeScript code table of CARC/RARC codes, date arithmetic against a fixed review date, and an expected-value model",
            "Transport: NDJSON over a ReadableStream, identical event contract to Sentinel",
            "Abuse controls: the same Upstash budget, origin pinning and fixture-only input",
            "Data: four synthetic denials and a synthetic risk model — no PHI, no payer data, no database",
        ],
        keyDecisions: [
            "The recommendation is arithmetic, not judgement. Expected recovery minus handling cost is a number; asking a model to feel its way to it would be strictly worse.",
            "The model is allowed to overturn the arithmetic, but must declare that it is doing so — the case context sometimes defeats the maths, and hiding that would be dishonest about how the system works.",
            "Deadlines are computed against a fixed review date rather than the wall clock, so a visitor next year sees the same run as one today. A demo whose output silently drifts is impossible to discuss.",
            "The invented numbers are labelled as invented. Overturn rates and the per-appeal handling cost are surfaced in the UI as stated assumptions, because a real team would derive them from its own history and get different ones.",
            "One case is deliberately not appealable. A demo where every input produces a win proves nothing about judgement.",
        ],
        techStack: [
            "TypeScript",
            "Next.js 15",
            "Gemini API",
            "X12 CARC/RARC",
            "NDJSON streaming",
            "Upstash Redis",
            "Tailwind CSS",
        ],
        screenshots: [],
        disclaimer:
            "Demonstration only. All patients, claims, payers and identifiers are invented; no protected health information is used or stored. Overturn rates and handling costs are synthetic assumptions, not benchmarks. Output is a draft for human review, not billing, coding, legal or medical advice.",
    },
];

export function findAiApp(slug: string): AiApp | undefined {
    return aiApps.find((app) => app.slug === slug);
}
