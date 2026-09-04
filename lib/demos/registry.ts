import { amlDemo } from "./aml";
import { claimsDemo } from "./claims";
import type { DemoDefinition, DeterministicResult, StageKind, Verdict } from "./types";

/**
 * The case-type-erased view of a demo, so the API route can serve both apps
 * without knowing what an alert or a claim is. Adding a third demo is a line in
 * `demos` below and nothing else.
 *
 * `prepare` takes a case id rather than a case object on purpose: the route must
 * never accept a caller-supplied case body. Curated fixtures only means there is
 * no free text reaching a prompt, which removes the injection surface and caps
 * what a run can cost.
 */
export interface DemoRunner {
    slug: string;
    cases: { id: string; label: string; summary: string }[];
    stageOutline: { id: string; label: string; kind: StageKind }[];
    prepare: (caseId: string) => DeterministicResult | null;
    buildReasoningPrompt: (result: DeterministicResult) => string;
    buildDraftPrompt: (result: DeterministicResult, verdict: Verdict) => string;
    draftTitle: (verdict: Verdict) => string;
    toVerdict: (raw: unknown, result: DeterministicResult) => Verdict;
}

function toRunner<TCase extends { id: string; label: string; summary: string }>(
    definition: DemoDefinition<TCase>
): DemoRunner {
    return {
        slug: definition.slug,
        cases: definition.cases.map(({ id, label, summary }) => ({ id, label, summary })),
        stageOutline: definition.stageOutline,
        prepare: (caseId) => {
            const found = definition.cases.find((c) => c.id === caseId);
            return found ? definition.run(found) : null;
        },
        buildReasoningPrompt: definition.buildReasoningPrompt,
        buildDraftPrompt: definition.buildDraftPrompt,
        draftTitle: definition.draftTitle,
        toVerdict: definition.toVerdict,
    };
}

export const demos: Record<string, DemoRunner> = {
    [amlDemo.slug]: toRunner(amlDemo),
    [claimsDemo.slug]: toRunner(claimsDemo),
};

export function getDemo(slug: string): DemoRunner | undefined {
    return demos[slug];
}
