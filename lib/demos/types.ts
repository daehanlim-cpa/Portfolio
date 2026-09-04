/**
 * Shared vocabulary for both proof-of-concept demos.
 *
 * The two apps solve unrelated problems in unrelated industries, but they run
 * the same pipeline: deterministic normalisation, then deterministic scoring,
 * then a model call that reasons over what the rules produced, then a model call
 * that drafts a document. The model never decides anything a rule can decide and
 * never sees an input a rule has not already normalised.
 *
 * That ordering is the point of these demos, so the transport streams each stage
 * as it completes rather than returning one answer at the end — the pipeline is
 * the thing worth showing.
 */

export type StageKind = "deterministic" | "model";

export interface StageResult {
    id: string;
    label: string;
    kind: StageKind;
    /** One-line summary of what this stage concluded. */
    detail: string;
    /** "Label: value" rows, same authoring convention as the rest of the site. */
    facts?: string[];
}

export type VerdictTone = "positive" | "caution" | "critical";

export interface Verdict {
    /** The short decision, e.g. "Escalate — file SAR". */
    decision: string;
    tone: VerdictTone;
    /** 0-1. Rendered as a percentage, and always alongside the rationale. */
    confidence: number;
    headline: string;
    rationale: string[];
    metrics: { label: string; value: string }[];
}

/**
 * One line of NDJSON per event. A stream rather than a single response because
 * the deterministic stages finish in milliseconds and the model stages take
 * seconds — batching them would hide the part that is fast on purpose.
 */
export type DemoEvent =
    | { type: "stage"; stage: StageResult }
    | { type: "verdict"; verdict: Verdict }
    | { type: "draft_start"; title: string }
    | { type: "draft_delta"; text: string }
    | { type: "audit"; entries: string[] }
    | { type: "done" }
    | { type: "error"; message: string };

/** What a demo module hands back before any model call is made. */
export interface DeterministicResult {
    stages: StageResult[];
    /** Everything the model will be shown. Surfaced in the UI as the audit trail. */
    modelInputs: string[];
    /** Domain payload the prompt builders consume. */
    payload: Record<string, unknown>;
}

export interface DemoDefinition<TCase extends { id: string; label: string; summary: string }> {
    slug: string;
    cases: TCase[];
    /** Stage list shown greyed-out before a run starts. */
    stageOutline: { id: string; label: string; kind: StageKind }[];
    run: (demoCase: TCase) => DeterministicResult;
    buildReasoningPrompt: (result: DeterministicResult) => string;
    /** Given the model's parsed verdict, produce the drafting prompt. */
    buildDraftPrompt: (result: DeterministicResult, verdict: Verdict) => string;
    /** Title for the generated document panel. */
    draftTitle: (verdict: Verdict) => string;
    /** Maps raw model JSON onto a Verdict, applying domain defaults defensively. */
    toVerdict: (raw: unknown, result: DeterministicResult) => Verdict;
}

/** Clamp helper shared by both scorers. */
export function clamp01(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.min(1, Math.max(0, n));
}

export function formatUsd(amount: number): string {
    return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}
