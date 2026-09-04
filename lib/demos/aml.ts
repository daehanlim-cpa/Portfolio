import { HIGH_RISK_JURISDICTIONS, WATCHLIST_SOURCE, watchlist } from "@/data/demo/watchlist";
import { amlCases, type AmlCase, type DemoTransaction } from "@/data/demo/aml-cases";
import { nameSimilarity } from "./matching";
import {
    clamp01,
    formatUsd,
    type DemoDefinition,
    type DeterministicResult,
    type StageResult,
    type Verdict,
} from "./types";

/**
 * Sentinel — AML alert triage.
 *
 * The rules below run before the model sees anything, and they carry the
 * decisions that must be reproducible: whether a name matches a list, whether
 * deposits cluster under a reporting threshold, whether a jurisdiction is
 * high-risk. The model's job is narrower and genuinely language-shaped —
 * weighing those findings against the customer's stated business and writing the
 * narrative. It never computes a number, because a number it computed could not
 * be reproduced on demand.
 */

/** Currency Transaction Report threshold. Deposits are structured beneath it. */
const CTR_THRESHOLD = 10000;
/** How far below the threshold still counts as "just under". */
const STRUCTURING_BAND = 0.15;
/** Screening score above which a name is reported as a potential match. */
const SCREENING_THRESHOLD = 0.82;
const STRONG_MATCH_THRESHOLD = 0.9;

export interface ScreeningHit {
    queryName: string;
    entryId: string;
    entryName: string;
    matchedOn: string;
    program: string;
    jurisdiction: string;
    score: number;
    strong: boolean;
}

export interface RiskSignal {
    id: string;
    label: string;
    severity: "low" | "medium" | "high";
    detail: string;
    /** Contribution to the composite score, before normalisation. */
    weight: number;
}

/** Screens one name against every entry and alias, keeping the best hit per entry. */
export function screenName(name: string): ScreeningHit[] {
    const hits: ScreeningHit[] = [];

    for (const entry of watchlist) {
        let best = { score: nameSimilarity(name, entry.name), matchedOn: entry.name };

        for (const alias of entry.aliases) {
            const score = nameSimilarity(name, alias);
            if (score > best.score) best = { score, matchedOn: alias };
        }

        if (best.score >= SCREENING_THRESHOLD) {
            hits.push({
                queryName: name,
                entryId: entry.id,
                entryName: entry.name,
                matchedOn: best.matchedOn,
                program: entry.program,
                jurisdiction: entry.jurisdiction,
                score: best.score,
                strong: best.score >= STRONG_MATCH_THRESHOLD,
            });
        }
    }

    return hits.sort((a, b) => b.score - a.score);
}

function distinctCounterparties(transactions: DemoTransaction[]): string[] {
    return Array.from(new Set(transactions.map((t) => t.counterparty)));
}

export function deriveSignals(demoCase: AmlCase): RiskSignal[] {
    const signals: RiskSignal[] = [];
    const { transactions, customer } = demoCase;

    const inflows = transactions.filter((t) => t.amount > 0);
    const outflows = transactions.filter((t) => t.amount < 0);
    const cashIn = inflows.filter((t) => t.channel === "cash");

    // 1. Structuring: cash deposits clustered just beneath the CTR threshold.
    const nearThreshold = cashIn.filter(
        (t) => t.amount >= CTR_THRESHOLD * (1 - STRUCTURING_BAND) && t.amount < CTR_THRESHOLD
    );
    if (nearThreshold.length >= 3) {
        const total = nearThreshold.reduce((sum, t) => sum + t.amount, 0);
        signals.push({
            id: "structuring",
            label: "Deposits clustered below reporting threshold",
            severity: "high",
            detail: `${nearThreshold.length} cash deposits between ${formatUsd(
                CTR_THRESHOLD * (1 - STRUCTURING_BAND)
            )} and ${formatUsd(CTR_THRESHOLD)}, totalling ${formatUsd(
                total
            )}. No single deposit triggers a CTR.`,
            weight: 34,
        });
    } else if (cashIn.length > 0) {
        signals.push({
            id: "cash-activity",
            label: "Cash activity present",
            severity: "low",
            detail: `${cashIn.length} cash deposit(s) totalling ${formatUsd(
                cashIn.reduce((sum, t) => sum + t.amount, 0)
            )}, none clustered beneath the threshold.`,
            weight: 4,
        });
    }

    // 2. Deposits split across locations — a hallmark of deliberate structuring.
    const cashLocations = new Set(cashIn.map((t) => t.counterparty));
    if (cashIn.length >= 3 && cashLocations.size >= 3) {
        signals.push({
            id: "location-spread",
            label: "Cash deposits split across locations",
            severity: "medium",
            detail: `Deposits placed at ${cashLocations.size} distinct branches or channels, which defeats a per-location aggregation rule.`,
            weight: 14,
        });
    }

    // 3. Volume against the profile the customer declared at onboarding.
    const totalIn = inflows.reduce((sum, t) => sum + t.amount, 0);
    if (customer.expectedMonthlyVolume > 0) {
        const ratio = totalIn / customer.expectedMonthlyVolume;
        if (ratio > 1.5) {
            signals.push({
                id: "volume-variance",
                label: "Inflow exceeds declared profile",
                severity: ratio > 2.5 ? "high" : "medium",
                detail: `${formatUsd(totalIn)} received against a declared monthly volume of ${formatUsd(
                    customer.expectedMonthlyVolume
                )} — ${ratio.toFixed(1)}× profile.`,
                weight: ratio > 2.5 ? 20 : 12,
            });
        }
    }

    // 4. Geographic risk.
    const riskyCountries = Array.from(
        new Set(transactions.map((t) => t.counterpartyCountry).filter((c) => HIGH_RISK_JURISDICTIONS.has(c)))
    );
    if (riskyCountries.length) {
        signals.push({
            id: "jurisdiction",
            label: "High-risk jurisdiction exposure",
            severity: "medium",
            detail: `Counterparty activity involving ${riskyCountries.join(", ")}.`,
            weight: 16,
        });
    }

    // 5. Round-value outbound wires — invoices rarely land on round figures.
    const roundWires = outflows.filter((t) => t.channel === "wire" && Math.abs(t.amount) % 5000 === 0);
    if (roundWires.length >= 3) {
        signals.push({
            id: "round-value",
            label: "Repeated round-value wires",
            severity: "medium",
            detail: `${roundWires.length} outbound wires in exact multiples of ${formatUsd(
                5000
            )}, totalling ${formatUsd(Math.abs(roundWires.reduce((sum, t) => sum + t.amount, 0)))}.`,
            weight: 13,
        });
    }

    // 6. Rapid pass-through: money in, money straight back out.
    if (totalIn > 0) {
        const totalOut = Math.abs(outflows.reduce((sum, t) => sum + t.amount, 0));
        const passThrough = totalOut / totalIn;
        if (passThrough > 0.85 && passThrough < 1.15 && outflows.length <= 3 && inflows.length >= 4) {
            signals.push({
                id: "pass-through",
                label: "Funds aggregated then moved out intact",
                severity: "high",
                detail: `${formatUsd(totalIn)} in across ${inflows.length} credits, ${formatUsd(
                    totalOut
                )} out across ${outflows.length} debit(s) — ${(passThrough * 100).toFixed(
                    0
                )}% of inflow leaves the account.`,
                weight: 22,
            });
        }
    }

    // 7. Prior filing history.
    if (customer.priorSarCount > 0) {
        signals.push({
            id: "prior-sar",
            label: "Prior SAR on this relationship",
            severity: "medium",
            detail: `${customer.priorSarCount} prior filing(s). Continuing activity reviews are required after a filing.`,
            weight: 10,
        });
    }

    // 8. Repetition against a single counterparty.
    const counterpartyCounts = new Map<string, number>();
    for (const t of outflows) {
        counterpartyCounts.set(t.counterparty, (counterpartyCounts.get(t.counterparty) ?? 0) + 1);
    }
    const repeated = Array.from(counterpartyCounts.entries()).filter(([, count]) => count >= 3);
    if (repeated.length) {
        signals.push({
            id: "repeat-counterparty",
            label: "Escalating payments to a single counterparty",
            severity: "low",
            detail: repeated
                .map(([name, count]) => `${count} outbound payments to ${name}`)
                .join("; ") + ".",
            weight: 8,
        });
    }

    return signals;
}

/**
 * Composite risk score, 0-100. A weighted sum rather than a model output so the
 * same alert always scores the same, and so an analyst can see which component
 * moved the number.
 */
export function scoreRisk(signals: RiskSignal[], hits: ScreeningHit[]): number {
    const signalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
    const screeningWeight = hits.reduce(
        (sum, hit) => sum + (hit.strong ? 45 : 18 + (hit.score - SCREENING_THRESHOLD) * 100),
        0
    );
    return Math.round(Math.min(100, signalWeight + screeningWeight));
}

function run(demoCase: AmlCase): DeterministicResult {
    const { transactions, customer } = demoCase;
    const counterparties = distinctCounterparties(transactions);
    const dates = transactions.map((t) => t.date).sort();
    const totalIn = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalOut = Math.abs(transactions.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0));

    // Stage 1 — normalise.
    const normalize: StageResult = {
        id: "normalize",
        label: "Normalise alert",
        kind: "deterministic",
        detail: `${transactions.length} transactions across ${counterparties.length} counterparties parsed and typed.`,
        facts: [
            `Customer: ${customer.name} (${customer.accountNumber})`,
            `Alert rule: ${demoCase.alertRule}`,
            `Window: ${dates[0]} to ${dates[dates.length - 1]}`,
            `Credits: ${formatUsd(totalIn)}`,
            `Debits: ${formatUsd(totalOut)}`,
        ],
    };

    // Stage 2 — screen every party against the list.
    const namesToScreen = [customer.name, ...counterparties];
    const hits = namesToScreen.flatMap((name) => screenName(name));
    const screening: StageResult = {
        id: "screen",
        label: "Sanctions screening",
        kind: "deterministic",
        detail: hits.length
            ? `${hits.length} potential match(es) above ${(SCREENING_THRESHOLD * 100).toFixed(0)}% on ${namesToScreen.length} names screened.`
            : `No matches above ${(SCREENING_THRESHOLD * 100).toFixed(0)}% on ${namesToScreen.length} names screened.`,
        facts: hits.length
            ? hits.map(
                  (hit) =>
                      `${hit.queryName}: ${(hit.score * 100).toFixed(1)}% to ${hit.entryName} (${hit.entryId}, ${hit.program}) via "${hit.matchedOn}"`
              )
            : [`List: ${WATCHLIST_SOURCE}`, `Names screened: ${namesToScreen.join(", ")}`],
    };

    // Stage 3 — behavioural signals.
    const signals = deriveSignals(demoCase);
    const behavioural: StageResult = {
        id: "signals",
        label: "Behavioural rules",
        kind: "deterministic",
        detail: signals.length
            ? `${signals.length} signal(s) raised — ${signals.filter((s) => s.severity === "high").length} high severity.`
            : "No behavioural signals raised.",
        facts: signals.map((s) => `${s.label}: ${s.detail}`),
    };

    // Stage 4 — composite score.
    const score = scoreRisk(signals, hits);
    const band = score >= 65 ? "High" : score >= 35 ? "Medium" : "Low";
    const scoring: StageResult = {
        id: "score",
        label: "Composite risk score",
        kind: "deterministic",
        detail: `${score}/100 — ${band} band.`,
        facts: [
            `Behavioural weight: ${signals.reduce((s, x) => s + x.weight, 0)}`,
            `Screening weight: ${Math.round(score - signals.reduce((s, x) => s + x.weight, 0))}`,
            `Band thresholds: Low <35, Medium 35-64, High >=65`,
        ],
    };

    const modelInputs = [
        `Alert rule: ${demoCase.alertRule}`,
        `Customer: ${customer.name}, ${customer.type}${customer.businessType ? `, ${customer.businessType}` : ""}, relationship opened ${customer.relationshipOpened}, declared monthly volume ${formatUsd(customer.expectedMonthlyVolume)}, prior SARs ${customer.priorSarCount}`,
        `Transactions: ${transactions
            .map((t) => `${t.date} ${t.amount > 0 ? "+" : "-"}${formatUsd(Math.abs(t.amount))} ${t.channel} ${t.counterparty} (${t.counterpartyCountry})${t.memo ? ` — ${t.memo}` : ""}`)
            .join("; ")}`,
        `Screening result: ${hits.length ? hits.map((h) => `${h.queryName} ~ ${h.entryName} at ${(h.score * 100).toFixed(1)}% (${h.program})`).join("; ") : "no matches above threshold"}`,
        `Behavioural signals: ${signals.length ? signals.map((s) => `[${s.severity}] ${s.label} — ${s.detail}`).join("; ") : "none"}`,
        `Composite score: ${score}/100 (${band})`,
        ...(demoCase.analystNotes ? [`Analyst notes: ${demoCase.analystNotes}`] : []),
    ];

    return {
        stages: [normalize, screening, behavioural, scoring],
        modelInputs,
        payload: { case: demoCase, hits, signals, score, band },
    };
}

const REASONING_INSTRUCTION = `You are assisting a BSA/AML analyst triaging an alert at a US financial institution.

The deterministic layer has already screened names, applied the behavioural rules and computed the composite score. Do not recompute any number, and do not invent facts that are not in the findings.

Weigh the findings against the customer's stated business. A rule firing is not by itself suspicious: a cash-intensive business making cash deposits, or a staffing agency making many payroll debits, may be entirely consistent with its profile. Say so when it is.

Choose exactly one disposition:
- "Escalate — recommend SAR": the activity has no apparent lawful purpose consistent with the customer profile.
- "Request information": the activity could be legitimate but a specific documented fact is missing.
- "Close — no further action": the activity is consistent with the profile and the alert is a false positive.

Respond with JSON only, no code fence:
{"disposition": "...", "confidence": 0.0-1.0, "headline": "one sentence", "rationale": ["3-5 short points, each citing a specific finding"], "informationNeeded": ["only if requesting information, else empty"]}`;

function buildReasoningPrompt(result: DeterministicResult): string {
    return `${REASONING_INSTRUCTION}

DETERMINISTIC FINDINGS
${result.modelInputs.map((line) => `- ${line}`).join("\n")}`;
}

function buildDraftPrompt(result: DeterministicResult, verdict: Verdict): string {
    const escalating = verdict.decision.toLowerCase().startsWith("escalate");

    if (!escalating) {
        return `Write the alert disposition memo an analyst files when closing or pending an alert without a SAR.

DISPOSITION: ${verdict.decision}
BASIS: ${verdict.rationale.join(" ")}

FINDINGS
${result.modelInputs.map((line) => `- ${line}`).join("\n")}

Write 150-200 words in plain prose, no headings, no markdown. State what the alert fired on, what was reviewed, why the activity is or is not consistent with the customer profile, and what happens next. Where information is outstanding, name the specific document or fact required. Do not recommend filing a SAR.`;
    }

    return `Draft the narrative section of a Suspicious Activity Report.

FINDINGS
${result.modelInputs.map((line) => `- ${line}`).join("\n")}

BASIS FOR ESCALATION: ${verdict.rationale.join(" ")}

Follow FinCEN narrative convention: plain chronological prose covering who conducted the activity, what instruments and amounts were involved, when it occurred, where it took place, and why it is suspicious. 200-260 words. No headings, no bullets, no markdown. Use only the amounts and dates given above. Refer to the subject by name and account number. Close with the fact that the institution is filing and will maintain supporting documentation. Do not speculate about the underlying crime beyond what the transaction pattern supports.`;
}

function toVerdict(raw: unknown, result: DeterministicResult): Verdict {
    const score = (result.payload.score as number) ?? 0;
    const band = (result.payload.band as string) ?? "Unknown";
    const hits = (result.payload.hits as ScreeningHit[]) ?? [];
    const signals = (result.payload.signals as RiskSignal[]) ?? [];

    const parsed = (raw ?? {}) as {
        disposition?: string;
        confidence?: number;
        headline?: string;
        rationale?: string[];
        informationNeeded?: string[];
    };

    const decision = parsed.disposition?.trim() || "Request information";
    const lower = decision.toLowerCase();
    const tone: Verdict["tone"] = lower.startsWith("escalate")
        ? "critical"
        : lower.startsWith("close")
          ? "positive"
          : "caution";

    const rationale = Array.isArray(parsed.rationale) ? parsed.rationale.filter(Boolean).slice(0, 5) : [];
    if (Array.isArray(parsed.informationNeeded)) {
        for (const item of parsed.informationNeeded.filter(Boolean).slice(0, 3)) {
            rationale.push(`Information required: ${item}`);
        }
    }

    return {
        decision,
        tone,
        confidence: clamp01(typeof parsed.confidence === "number" ? parsed.confidence : 0.6),
        headline: parsed.headline?.trim() || `Composite risk ${score}/100 (${band}).`,
        rationale,
        metrics: [
            { label: "Risk score", value: `${score}/100` },
            { label: "Band", value: band },
            { label: "List hits", value: String(hits.length) },
            { label: "Signals", value: String(signals.length) },
        ],
    };
}

export const amlDemo: DemoDefinition<AmlCase> = {
    slug: "aml-alert-triage",
    cases: amlCases,
    stageOutline: [
        { id: "normalize", label: "Normalise alert", kind: "deterministic" },
        { id: "screen", label: "Sanctions screening", kind: "deterministic" },
        { id: "signals", label: "Behavioural rules", kind: "deterministic" },
        { id: "score", label: "Composite risk score", kind: "deterministic" },
        { id: "reason", label: "Disposition reasoning", kind: "model" },
        { id: "draft", label: "Narrative drafting", kind: "model" },
    ],
    run,
    buildReasoningPrompt,
    buildDraftPrompt,
    draftTitle: (verdict) =>
        verdict.decision.toLowerCase().startsWith("escalate") ? "SAR narrative (draft)" : "Disposition memo (draft)",
    toVerdict,
};
