/**
 * Hand-drawn stage diagrams for the case studies that have a clean linear
 * shape. Everything else falls back to the component list beneath.
 */

type Stage = { label: string; value: string; unit?: string; emphasis?: boolean };

const FLOWS: Record<string, Stage[]> = {
    "liquidity-platform": [
        { label: "Sources", value: "8", unit: "systems" },
        { label: "Ingest", value: "Prefect", emphasis: true },
        { label: "Transform", value: "dbt", emphasis: true },
        { label: "Consume", value: "16", unit: "dashboards" },
    ],
    "cloud-modernization": [
        { label: "Intake", value: "435", unit: "requests" },
        { label: "Build", value: "338", unit: "views", emphasis: true },
        { label: "Release", value: "CI/CD", emphasis: true },
        { label: "Production", value: "265", unit: "tier-1", emphasis: true },
    ],
    "certification-center": [
        { label: "Partners", value: "5+", unit: "alliances" },
        { label: "Platform", value: "Center", unit: "community", emphasis: true },
        { label: "Talent", value: "600+", unit: "upskilled" },
    ],
    "ai-portfolio": [
        { label: "Alerts", value: "Data", unit: "structured" },
        { label: "Policies", value: "Docs", unit: "unstructured" },
        { label: "Retrieve", value: "RAG", emphasis: true },
        { label: "Assess", value: "LLM", emphasis: true },
    ],
};

export function hasFlow(id: string) {
    return id in FLOWS;
}

export default function ArchitectureFlow({ id }: { id: string }) {
    const stages = FLOWS[id];
    if (!stages) return null;

    return (
        <div className="-mx-1 overflow-x-auto py-6 scrollbar-hide">
            {/* The hairline is inset by half a node (43px of 86px) at each end,
                so it joins the outer nodes' centres rather than overrunning. */}
            <div className="relative flex min-w-max items-start gap-10 px-1 sm:gap-14">
                <div aria-hidden className="absolute left-[43px] right-[43px] top-[43px] h-px bg-line" />
                {stages.map((s) => (
                    <div
                        key={s.label}
                        className={`relative flex h-[86px] w-[86px] shrink-0 flex-col items-center justify-center rounded-full border ${
                            s.emphasis ? "border-transparent bg-ink text-on-ink shadow-raised" : "border-line bg-surface-raised text-ink"
                        }`}
                    >
                        <span className={`text-[9px] uppercase tracking-[0.08em] ${s.emphasis ? "opacity-60" : "text-ink-quaternary"}`}>
                            {s.label}
                        </span>
                        <span className="mt-0.5 text-body font-light tabular-nums">{s.value}</span>
                        {s.unit && (
                            <span className={`text-[9px] uppercase tracking-[0.08em] ${s.emphasis ? "opacity-60" : "text-ink-quaternary"}`}>
                                {s.unit}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
