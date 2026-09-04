"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Pill from "@/components/Pill";
import type { DemoEvent, StageKind, StageResult, Verdict } from "@/lib/demos/types";

interface DemoCase {
    id: string;
    label: string;
    summary: string;
}

interface DemoRunnerProps {
    slug: string;
    cases: DemoCase[];
    stageOutline: { id: string; label: string; kind: StageKind }[];
    disclaimer: string;
}

type RunState = "idle" | "running" | "done" | "failed";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Reads NDJSON off a fetch body. Events arrive one per line, but a chunk can
 * split a line anywhere, so the tail is carried forward rather than parsed.
 */
async function* readEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<DemoEvent> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
            if (!line.trim()) continue;
            try {
                yield JSON.parse(line) as DemoEvent;
            } catch {
                // A malformed line is not worth failing the whole run over.
            }
        }
    }

    if (buffer.trim()) {
        try {
            yield JSON.parse(buffer) as DemoEvent;
        } catch {
            /* ignore trailing partial */
        }
    }
}

function StageRow({
    outline,
    result,
    active,
}: {
    outline: { id: string; label: string; kind: StageKind };
    result?: StageResult;
    active: boolean;
}) {
    const [open, setOpen] = useState(false);
    const done = Boolean(result);
    const hasFacts = Boolean(result?.facts?.length);

    return (
        <li className="bg-surface-sunken">
            <div className="flex items-start gap-3 px-5 py-4">
                <span
                    aria-hidden
                    className={`mt-[5px] h-2 w-2 shrink-0 rounded-full transition-colors ${
                        done ? "bg-ink" : active ? "animate-pulse bg-ink-quaternary" : "bg-line"
                    }`}
                />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className={`text-caption ${done ? "text-ink" : "text-ink-quaternary"}`}>
                            {outline.label}
                        </span>
                        <span className="text-label uppercase text-ink-quaternary">
                            {outline.kind === "model" ? "Model" : "Deterministic"}
                        </span>
                    </div>

                    {result && (
                        <p className="mt-1.5 text-caption leading-relaxed text-ink-secondary">
                            {result.detail}
                        </p>
                    )}

                    {hasFacts && (
                        <>
                            <button
                                type="button"
                                onClick={() => setOpen((v) => !v)}
                                aria-expanded={open}
                                className="mt-2 text-label uppercase text-ink-quaternary transition-colors hover:text-ink"
                            >
                                {open ? "Hide detail" : `Show detail (${result?.facts?.length})`}
                            </button>
                            {open && (
                                <ul className="mt-3 space-y-2 border-l border-line-soft pl-4">
                                    {result?.facts?.map((fact, i) => (
                                        <li key={i} className="text-caption leading-relaxed text-ink-tertiary">
                                            {fact}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            </div>
        </li>
    );
}

export default function DemoRunner({ slug, cases, stageOutline, disclaimer }: DemoRunnerProps) {
    const reduce = useReducedMotion();
    const [selected, setSelected] = useState(cases[0]?.id ?? "");
    const [state, setState] = useState<RunState>("idle");
    const [stages, setStages] = useState<Record<string, StageResult>>({});
    const [verdict, setVerdict] = useState<Verdict | null>(null);
    const [draftTitle, setDraftTitle] = useState("");
    const [draft, setDraft] = useState("");
    const [audit, setAudit] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [auditOpen, setAuditOpen] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const activeStageId = useMemo(() => {
        return stageOutline.find((stage) => !stages[stage.id])?.id ?? null;
    }, [stageOutline, stages]);

    const run = useCallback(async () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setState("running");
        setStages({});
        setVerdict(null);
        setDraft("");
        setDraftTitle("");
        setAudit([]);
        setError("");
        setCopied(false);

        try {
            const response = await fetch(`/api/demo/${slug}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caseId: selected }),
                signal: controller.signal,
            });

            if (!response.ok || !response.body) {
                const message = await response
                    .json()
                    .then((data: { message?: string }) => data.message)
                    .catch(() => null);
                setError(message || "The run could not be started.");
                setState("failed");
                return;
            }

            for await (const event of readEvents(response.body)) {
                switch (event.type) {
                    case "stage":
                        setStages((prev) => ({ ...prev, [event.stage.id]: event.stage }));
                        break;
                    case "verdict":
                        setVerdict(event.verdict);
                        break;
                    case "draft_start":
                        setDraftTitle(event.title);
                        break;
                    case "draft_delta":
                        setDraft((prev) => prev + event.text);
                        break;
                    case "audit":
                        setAudit(event.entries);
                        break;
                    case "error":
                        setError(event.message);
                        break;
                    case "done":
                        break;
                }
            }

            setState((prev) => (prev === "running" ? "done" : prev));
        } catch (err) {
            if ((err as Error).name === "AbortError") return;
            setError("The run failed to complete. Please try again.");
            setState("failed");
        }
    }, [selected, slug]);

    const copyDraft = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(draft);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            /* Clipboard permission denied — the text is selectable regardless. */
        }
    }, [draft]);

    const running = state === "running";

    return (
        <div>
            <fieldset disabled={running} className="min-w-0">
                <legend className="mb-4 text-label uppercase text-ink-quaternary">
                    Choose a synthetic case
                </legend>
                <div className="grid gap-px overflow-hidden rounded-lg bg-line-soft sm:grid-cols-2">
                    {cases.map((demoCase) => {
                        const active = selected === demoCase.id;
                        return (
                            <label
                                key={demoCase.id}
                                className={`flex cursor-pointer items-start gap-3 px-5 py-4 transition-colors ${
                                    active ? "bg-surface-muted" : "bg-surface-sunken hover:bg-surface-muted"
                                } ${running ? "cursor-not-allowed opacity-60" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name={`${slug}-case`}
                                    value={demoCase.id}
                                    checked={active}
                                    onChange={() => setSelected(demoCase.id)}
                                    className="mt-1 h-3.5 w-3.5 shrink-0 accent-[color:var(--ink)]"
                                />
                                <span className="min-w-0">
                                    <span className="block text-caption text-ink">{demoCase.label}</span>
                                    <span className="mt-1 block text-caption leading-relaxed text-ink-tertiary">
                                        {demoCase.summary}
                                    </span>
                                </span>
                            </label>
                        );
                    })}
                </div>
            </fieldset>

            <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                    type="button"
                    onClick={run}
                    disabled={running || !selected}
                    className="rounded-full bg-ink px-5 py-2.5 text-caption font-medium text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                >
                    {running ? "Running…" : state === "idle" ? "Run the pipeline" : "Run again"}
                </button>
                <p className="text-caption text-ink-quaternary" aria-live="polite">
                    {running
                        ? "Deterministic stages first, then two model calls."
                        : state === "done"
                          ? "Run complete."
                          : ""}
                </p>
            </div>

            {state !== "idle" && (
                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                    className="mt-10 space-y-10"
                >
                    <section>
                        <h3 className="mb-4 text-label uppercase text-ink-quaternary">Pipeline</h3>
                        <ul className="grid gap-px overflow-hidden rounded-lg bg-line-soft">
                            {stageOutline.map((outline) => (
                                <StageRow
                                    key={outline.id}
                                    outline={outline}
                                    result={stages[outline.id]}
                                    active={running && activeStageId === outline.id}
                                />
                            ))}
                        </ul>
                    </section>

                    {error && (
                        <p
                            role="status"
                            className="rounded-lg border border-line-soft bg-surface-sunken px-5 py-4 text-caption leading-relaxed text-ink-secondary"
                        >
                            {error}
                        </p>
                    )}

                    {verdict && (
                        <section>
                            <h3 className="mb-4 text-label uppercase text-ink-quaternary">Recommendation</h3>
                            <div className="rounded-lg border border-line-soft px-5 py-5 sm:px-6 sm:py-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Pill tone={verdict.tone}>{verdict.decision}</Pill>
                                    <span className="text-caption tabular-nums text-ink-quaternary">
                                        {(verdict.confidence * 100).toFixed(0)}% stated confidence
                                    </span>
                                </div>

                                <p className="mt-4 text-body leading-[1.7] text-ink">{verdict.headline}</p>

                                {verdict.rationale.length > 0 && (
                                    <ul className="mt-5 space-y-3">
                                        {verdict.rationale.map((point, i) => (
                                            <li
                                                key={i}
                                                className="flex gap-3 text-caption leading-relaxed text-ink-secondary"
                                            >
                                                <span
                                                    aria-hidden
                                                    className="mt-[0.65em] h-[3px] w-[3px] shrink-0 rounded-full bg-ink-quaternary"
                                                />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {verdict.metrics.length > 0 && (
                                    <dl className="mt-6 grid gap-px overflow-hidden rounded-lg bg-line-soft sm:grid-cols-4">
                                        {verdict.metrics.map((metric) => (
                                            <div key={metric.label} className="bg-surface-sunken px-4 py-3">
                                                <dt className="text-label uppercase text-ink-quaternary">
                                                    {metric.label}
                                                </dt>
                                                <dd className="mt-1 text-caption tabular-nums text-ink">
                                                    {metric.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                )}
                            </div>
                        </section>
                    )}

                    {draftTitle && (
                        <section>
                            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                                <h3 className="text-label uppercase text-ink-quaternary">{draftTitle}</h3>
                                {draft && (
                                    <button
                                        type="button"
                                        onClick={copyDraft}
                                        className="text-label uppercase text-ink-quaternary transition-colors hover:text-ink"
                                    >
                                        {copied ? "Copied" : "Copy"}
                                    </button>
                                )}
                            </div>
                            <div className="rounded-lg bg-surface-sunken px-5 py-5 sm:px-6 sm:py-6">
                                <p className="whitespace-pre-wrap text-body leading-[1.75] text-ink-secondary">
                                    {draft}
                                    {running && !draft && (
                                        <span className="text-ink-quaternary">Drafting…</span>
                                    )}
                                </p>
                            </div>
                        </section>
                    )}

                    {audit.length > 0 && (
                        <section>
                            <button
                                type="button"
                                onClick={() => setAuditOpen((v) => !v)}
                                aria-expanded={auditOpen}
                                className="text-label uppercase text-ink-quaternary transition-colors hover:text-ink"
                            >
                                {auditOpen ? "Hide audit trail" : "Show audit trail"}
                            </button>
                            <p className="mt-2 max-w-prose text-caption leading-relaxed text-ink-quaternary">
                                Every input the model was given, verbatim. Nothing else reached it.
                            </p>
                            {auditOpen && (
                                <ul className="mt-4 grid gap-px overflow-hidden rounded-lg bg-line-soft">
                                    {audit.map((entry, i) => (
                                        <li
                                            key={i}
                                            className="bg-surface-sunken px-5 py-3.5 text-caption leading-relaxed text-ink-tertiary"
                                        >
                                            {entry}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    )}
                </motion.div>
            )}

            <p className="mt-10 border-t border-line-soft pt-6 text-caption leading-relaxed text-ink-quaternary">
                {disclaimer}
            </p>
        </div>
    );
}
