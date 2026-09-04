import { claimsCases, type ClaimsCase } from "@/data/demo/claims-cases";
import { findCarc, findRarc, type CarcCode } from "@/data/demo/carc-codes";
import {
    clamp01,
    formatUsd,
    type DemoDefinition,
    type DeterministicResult,
    type StageResult,
    type Verdict,
} from "./types";

/**
 * Recoup — claim denial triage.
 *
 * Same architecture as the AML demo: the rules decide everything decidable, the
 * model reasons and writes. The economics here are the part people get wrong —
 * a large share of denials are appealed that should not be, and written off that
 * should not be, because nobody computed whether the appeal was worth its own
 * handling cost. So the recommendation falls out of arithmetic, not judgement,
 * and the model is asked to justify or challenge it rather than produce it.
 */

/**
 * Fixed review date. Deadlines are computed against this rather than `new Date()`
 * so a visitor in 2027 sees the same run as one today — a demo whose output
 * silently drifts with the wall clock is impossible to talk about.
 */
const AS_OF = new Date("2025-07-01T00:00:00Z");

/** Synthetic. Fully loaded staff cost of working one appeal to conclusion. */
const APPEAL_HANDLING_COST = 118;

function daysBetween(from: string | Date, to: string | Date): number {
    const a = typeof from === "string" ? new Date(`${from}T00:00:00Z`) : from;
    const b = typeof to === "string" ? new Date(`${to}T00:00:00Z`) : to;
    return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export interface RecoveryModel {
    atRisk: number;
    overturnRate: number;
    expectedRecovery: number;
    handlingCost: number;
    netExpectedValue: number;
    recommendation: "Appeal" | "Corrected claim" | "Write off" | "Route to process improvement";
    worthPursuing: boolean;
}

export function scoreRecovery(demoCase: ClaimsCase, carc: CarcCode | undefined): RecoveryModel {
    const atRisk = demoCase.claim.billedAmount - demoCase.claim.allowedAmount;
    const overturnRate = carc?.typicalOverturnRate ?? 0.3;
    const expectedRecovery = atRisk * overturnRate;
    const netExpectedValue = expectedRecovery - APPEAL_HANDLING_COST;

    // A contractual adjustment is not a denial. Appealing one is wasted effort;
    // the remedy is the fee schedule or the charge master, not a letter.
    if (carc && !carc.appealable) {
        return {
            atRisk,
            overturnRate,
            expectedRecovery,
            handlingCost: APPEAL_HANDLING_COST,
            netExpectedValue,
            recommendation: carc.category === "Contractual" ? "Write off" : "Route to process improvement",
            worthPursuing: false,
        };
    }

    // Where the defect is on our side and the correction window is open, a
    // corrected claim beats an appeal: it is faster and it is not adjudicated
    // against the appeal count.
    const correctable = carc?.category === "Coding" || carc?.category === "Documentation";
    const withinCorrectionWindow = daysBetween(demoCase.claim.dateOfService, AS_OF) <= 180;

    return {
        atRisk,
        overturnRate,
        expectedRecovery,
        handlingCost: APPEAL_HANDLING_COST,
        netExpectedValue,
        recommendation: correctable && withinCorrectionWindow ? "Corrected claim" : "Appeal",
        worthPursuing: netExpectedValue > 0,
    };
}

function run(demoCase: ClaimsCase): DeterministicResult {
    const { claim, denial } = demoCase;
    const carc = findCarc(denial.carc);
    const rarc = denial.rarc ? findRarc(denial.rarc) : undefined;

    const daysToFile = daysBetween(claim.dateOfService, claim.dateReceived);
    const daysToDeny = daysBetween(claim.dateReceived, claim.dateDenied);
    const daysSinceDenial = daysBetween(claim.dateDenied, AS_OF);

    // Stage 1 — normalise.
    const normalize: StageResult = {
        id: "normalize",
        label: "Normalise remittance",
        kind: "deterministic",
        detail: `Claim ${claim.claimNumber} parsed — ${formatUsd(claim.billedAmount - claim.allowedAmount)} unpaid.`,
        facts: [
            `Payer: ${claim.payer} (${claim.planType})`,
            `Service: ${claim.cptCodes.map((c) => `${c.code} ${c.description}`).join("; ")}`,
            `Diagnosis: ${claim.diagnosisCodes.map((d) => `${d.code} ${d.description}`).join("; ")}`,
            `Billed: ${formatUsd(claim.billedAmount)}`,
            `Allowed: ${formatUsd(claim.allowedAmount)}`,
            `Filed: ${daysToFile} days after service`,
            `Adjudicated: ${daysToDeny} days after receipt`,
        ],
    };

    // Stage 2 — resolve the codes to meaning.
    const lookup: StageResult = {
        id: "codes",
        label: "Resolve denial codes",
        kind: "deterministic",
        detail: carc
            ? `${carc.code} — ${carc.category}, ${carc.preventable ? "preventable" : "not preventable"} upstream.`
            : `${denial.carc} not found in the code table.`,
        facts: [
            carc
                ? `${carc.code}: ${carc.description}`
                : `${denial.carc}: unrecognised — manual review required`,
            ...(rarc ? [`${rarc.code}: ${rarc.description}`] : []),
            ...(carc
                ? [
                      `Category: ${carc.category}`,
                      `Owning department: ${carc.owner}`,
                      `Appealable: ${carc.appealable ? "yes" : "no — appeal is not the remedy"}`,
                  ]
                : []),
        ],
    };

    // Stage 3 — deadline and eligibility rules.
    const deadlineFlags: string[] = [];
    if (carc?.category === "Timely filing") {
        deadlineFlags.push(
            `Claim reached the payer ${daysToFile} days after the date of service, against a 180-day secondary limit.`
        );
    }
    deadlineFlags.push(`${daysSinceDenial} days elapsed since denial as of the ${AS_OF.toISOString().slice(0, 10)} review date.`);
    if (daysSinceDenial > 90) {
        deadlineFlags.push("Beyond a typical 90-day appeal window — confirm the payer's limit before working this.");
    } else {
        deadlineFlags.push(`Inside a typical 90-day appeal window (${90 - daysSinceDenial} days remaining).`);
    }
    if (claim.priorAuthNumber) {
        deadlineFlags.push(`Prior authorization ${claim.priorAuthNumber} is on file.`);
    }

    const rules: StageResult = {
        id: "rules",
        label: "Deadline and eligibility rules",
        kind: "deterministic",
        detail: `${deadlineFlags.length} rule outcome(s) recorded.`,
        facts: deadlineFlags,
    };

    // Stage 4 — the economics.
    const recovery = scoreRecovery(demoCase, carc);
    const economics: StageResult = {
        id: "economics",
        label: "Recovery economics",
        kind: "deterministic",
        detail: `${formatUsd(recovery.netExpectedValue)} net expected value — ${recovery.recommendation.toLowerCase()}.`,
        facts: [
            `At risk: ${formatUsd(recovery.atRisk)}`,
            `Assumed overturn rate: ${(recovery.overturnRate * 100).toFixed(0)}% (synthetic)`,
            `Expected recovery: ${formatUsd(recovery.expectedRecovery)}`,
            `Handling cost: ${formatUsd(recovery.handlingCost)} per appeal (assumption)`,
            `Net expected value: ${formatUsd(recovery.netExpectedValue)}`,
            `Rule recommendation: ${recovery.recommendation}`,
        ],
    };

    const modelInputs = [
        `Claim: ${claim.claimNumber}, ${claim.payer} (${claim.planType}), date of service ${claim.dateOfService}, denied ${claim.dateDenied}`,
        `Services: ${claim.cptCodes.map((c) => `${c.code}${c.modifiers?.length ? ` (${c.modifiers.join(",")})` : ""} ${c.description}`).join("; ")}`,
        `Diagnoses: ${claim.diagnosisCodes.map((d) => `${d.code} ${d.description}`).join("; ")}`,
        `Amounts: billed ${formatUsd(claim.billedAmount)}, allowed ${formatUsd(claim.allowedAmount)}, at risk ${formatUsd(recovery.atRisk)}`,
        `Denial: ${denial.carc}${denial.rarc ? ` / ${denial.rarc}` : ""} — ${denial.payerRemark}`,
        carc
            ? `Code meaning: ${carc.description}. Category ${carc.category}. ${carc.preventable ? "Preventable upstream" : "Not preventable upstream"}. Owner ${carc.owner}. Appealable: ${carc.appealable ? "yes" : "no"}.`
            : `Code meaning: ${denial.carc} is not in the code table.`,
        `Rule outcomes: ${deadlineFlags.join(" ")}`,
        `Economics: expected recovery ${formatUsd(recovery.expectedRecovery)} against ${formatUsd(recovery.handlingCost)} handling cost, net ${formatUsd(recovery.netExpectedValue)}. Rule recommendation: ${recovery.recommendation}.`,
        `Case context: ${demoCase.context.join(" ")}`,
    ];

    return {
        stages: [normalize, lookup, rules, economics],
        modelInputs,
        payload: { case: demoCase, carc, rarc, recovery, daysSinceDenial },
    };
}

const REASONING_INSTRUCTION = `You are assisting a hospital revenue-cycle analyst working a denied claim.

The deterministic layer has already resolved the denial codes, checked the deadlines and computed the recovery economics. Do not recompute any figure and do not invent clinical facts, payer policies or dates beyond those given.

The rule engine proposes an action. Agree with it or overturn it, and say which you are doing. Overturn it when the case context defeats the arithmetic — for example when a payer bulletin exempts the claim, or when the denial is a contractual adjustment that no letter can change.

Choose exactly one action:
- "Appeal": write to the payer disputing the determination.
- "Corrected claim": the defect is ours and the correction window is open.
- "Write off": the balance is not recoverable and no process fix applies.
- "Route to process improvement": recoverable or not, the durable fix is upstream.

Respond with JSON only, no code fence:
{"action": "...", "confidence": 0.0-1.0, "headline": "one sentence", "rootCause": "one sentence naming what actually went wrong", "rationale": ["3-5 short points citing specific findings"], "preventionStep": "one concrete upstream change, or empty if none applies"}`;

function buildReasoningPrompt(result: DeterministicResult): string {
    return `${REASONING_INSTRUCTION}

DETERMINISTIC FINDINGS
${result.modelInputs.map((line) => `- ${line}`).join("\n")}`;
}

function buildDraftPrompt(result: DeterministicResult, verdict: Verdict): string {
    const action = verdict.decision.toLowerCase();
    const demoCase = result.payload.case as ClaimsCase;

    if (action.startsWith("write off") || action.startsWith("route")) {
        return `Write the internal note that closes this claim without an appeal, addressed to the revenue-cycle lead.

ACTION: ${verdict.decision}
BASIS: ${verdict.rationale.join(" ")}

FINDINGS
${result.modelInputs.map((line) => `- ${line}`).join("\n")}

Write 120-160 words, plain prose, no headings or markdown. State the amount, why no appeal is warranted, and the specific upstream change that would prevent the next one, naming the department that owns it. Be direct; this is read by someone deciding where to put staff time.`;
    }

    const isCorrected = action.startsWith("corrected");

    return `Draft a ${isCorrected ? "corrected-claim cover letter" : "first-level appeal letter"} to the payer.

FINDINGS
${result.modelInputs.map((line) => `- ${line}`).join("\n")}

BASIS: ${verdict.rationale.join(" ")}

Address it to ${demoCase.claim.payer}. Open by identifying the claim number, member reference, date of service and the denial code being disputed. State the specific factual basis for reversal, drawing only on the findings above — cite the payer's own policy or bulletin where the findings mention one. ${isCorrected ? "Explain precisely what was corrected on the resubmitted claim." : "Request reprocessing and payment of the allowable."} Close with what is enclosed and a contact line. 220-280 words. Business-letter prose, no markdown, no bullet lists, no invented policy numbers, no invented clinical detail. Sign as "Revenue Cycle Management" without inventing a personal name.`;
}

function toVerdict(raw: unknown, result: DeterministicResult): Verdict {
    const recovery = result.payload.recovery as RecoveryModel;
    const carc = result.payload.carc as CarcCode | undefined;

    const parsed = (raw ?? {}) as {
        action?: string;
        confidence?: number;
        headline?: string;
        rootCause?: string;
        rationale?: string[];
        preventionStep?: string;
    };

    const decision = parsed.action?.trim() || recovery.recommendation;
    const lower = decision.toLowerCase();
    const tone: Verdict["tone"] = lower.startsWith("write off")
        ? "critical"
        : lower.startsWith("appeal") || lower.startsWith("corrected")
          ? "positive"
          : "caution";

    const rationale = Array.isArray(parsed.rationale) ? parsed.rationale.filter(Boolean).slice(0, 5) : [];
    if (parsed.rootCause?.trim()) rationale.unshift(`Root cause: ${parsed.rootCause.trim()}`);
    if (parsed.preventionStep?.trim()) rationale.push(`Prevention: ${parsed.preventionStep.trim()}`);

    return {
        decision,
        tone,
        confidence: clamp01(typeof parsed.confidence === "number" ? parsed.confidence : 0.6),
        headline: parsed.headline?.trim() || `${formatUsd(recovery.atRisk)} at risk on ${carc?.code ?? "an unrecognised code"}.`,
        rationale,
        metrics: [
            { label: "At risk", value: formatUsd(recovery.atRisk) },
            { label: "Expected recovery", value: formatUsd(recovery.expectedRecovery) },
            { label: "Net of handling", value: formatUsd(recovery.netExpectedValue) },
            { label: "Category", value: carc?.category ?? "Unknown" },
        ],
    };
}

export const claimsDemo: DemoDefinition<ClaimsCase> = {
    slug: "claims-denial-triage",
    cases: claimsCases,
    stageOutline: [
        { id: "normalize", label: "Normalise remittance", kind: "deterministic" },
        { id: "codes", label: "Resolve denial codes", kind: "deterministic" },
        { id: "rules", label: "Deadline and eligibility rules", kind: "deterministic" },
        { id: "economics", label: "Recovery economics", kind: "deterministic" },
        { id: "reason", label: "Action reasoning", kind: "model" },
        { id: "draft", label: "Document drafting", kind: "model" },
    ],
    run,
    buildReasoningPrompt,
    buildDraftPrompt,
    draftTitle: (verdict) => {
        const lower = verdict.decision.toLowerCase();
        if (lower.startsWith("write off") || lower.startsWith("route")) return "Internal closing note (draft)";
        if (lower.startsWith("corrected")) return "Corrected-claim cover letter (draft)";
        return "Appeal letter (draft)";
    },
    toVerdict,
};
