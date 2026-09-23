"use client";

import { useReducedMotion } from "framer-motion";

/**
 * The hero's signature graphic: records flow from source systems through
 * ingestion and modelling, pass a controls gate, and only then reach the agent.
 * One in a few is caught at the gate and routed to human review instead.
 *
 * That is the thesis of the site drawn as a system — an AI pipeline built by
 * someone who used to audit them. Motion is SMIL rather than JS so it costs
 * nothing per frame; under reduced motion the particles simply aren't drawn.
 */

const SOURCES = [
    { label: "Core banking", y: 78 },
    { label: "Market data", y: 190 },
    { label: "Policy docs", y: 302 },
];

const TRUNK_Y = 190;
const CONTROLS_X = 400;

/** Source edge → ingest, then straight along the trunk. */
const sourceCurve = (y: number) => `M124 ${y} C168 ${y} 162 ${TRUNK_Y} 186 ${TRUNK_Y}`;
const mainPath = (y: number) => `${sourceCurve(y)} L586 ${TRUNK_Y}`;
const exceptionPath = (y: number) => `${sourceCurve(y)} L${CONTROLS_X} ${TRUNK_Y} L${CONTROLS_X} 300`;

const DURATION = 5.2;

function Particle({ path, begin, dur = DURATION }: { path: string; begin: number; dur?: number }) {
    return (
        <circle r="3" opacity="0" style={{ fill: "var(--ink)" }}>
            <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
            <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.06;0.92;1"
                dur={`${dur}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
            />
        </circle>
    );
}

/**
 * The caught record. Two stacked dots share one motion: the ink one fades out
 * and the signal one fades in at the moment the gate is reached (~75% along a
 * paced path), so the record visibly changes state at the control.
 */
function Exception({ y, begin }: { y: number; begin: number }) {
    const path = exceptionPath(y);
    const dur = 4.6;
    const common = { dur: `${dur}s`, begin: `${begin}s`, repeatCount: "indefinite" } as const;
    return (
        <g>
            <circle r="3" opacity="0" style={{ fill: "var(--ink)" }}>
                <animateMotion {...common} path={path} />
                <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.06;0.72;0.76;1" {...common} />
            </circle>
            <circle r="3.6" opacity="0" style={{ fill: "var(--signal)" }}>
                <animateMotion {...common} path={path} />
                <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.72;0.76;0.94;1" {...common} />
            </circle>
        </g>
    );
}

function Label({ x, y, children, tone = "ink" }: { x: number; y: number; children: string; tone?: "ink" | "on-ink" | "muted" }) {
    const fill = tone === "on-ink" ? "var(--on-ink)" : tone === "muted" ? "var(--ink-tertiary)" : "var(--ink)";
    return (
        <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            // Sizes live in classes, not the style prop, so a media query can
            // enlarge them: at phone width the whole SVG renders at about half
            // scale and 11px labels would shrink to 6px.
            className="text-[11px] max-sm:text-[14px]"
            style={{ fill, fontWeight: 500, letterSpacing: "-0.01em" }}
        >
            {children}
        </text>
    );
}

function Caption({ x, y, children }: { x: number; y: number; children: string }) {
    return (
        <text
            x={x}
            y={y}
            textAnchor="middle"
            className="text-[9px] max-sm:text-[12px]"
            style={{ fill: "var(--ink-quaternary)", letterSpacing: "0.06em" }}
        >
            {children.toUpperCase()}
        </text>
    );
}

export default function PipelineDiagram() {
    const reduce = useReducedMotion();

    const node = { fill: "var(--surface-raised)", stroke: "var(--line)", strokeWidth: 1 } as const;
    const wire = { stroke: "var(--line)", strokeWidth: 1.25, fill: "none" } as const;

    return (
        <figure className="relative">
            <svg
                viewBox="0 0 640 380"
                role="img"
                aria-labelledby="pipeline-title pipeline-desc"
                className="h-auto w-full overflow-visible"
            >
                <title id="pipeline-title">A governed AI pipeline</title>
                <desc id="pipeline-desc">
                    Records from core banking, market data and policy documents are ingested and
                    modelled, then pass a controls gate. Clean records reach an AI agent that
                    produces a decision; exceptions are routed to human review.
                </desc>

                {/* Wires */}
                {SOURCES.map((s) => (
                    <path key={s.label} d={sourceCurve(s.y)} style={wire} />
                ))}
                <path d={`M186 ${TRUNK_Y} L586 ${TRUNK_Y}`} style={wire} />
                <path
                    d={`M${CONTROLS_X} ${TRUNK_Y + 26} L${CONTROLS_X} 300`}
                    style={{ ...wire, stroke: "var(--signal)", strokeDasharray: "3 4", opacity: 0.7 }}
                />

                {/* Particles sit under the nodes, so records disappear "into" each
                    stage and re-emerge — the stage is doing the work. */}
                {!reduce && (
                    <g>
                        {SOURCES.map((s, i) => (
                            <g key={s.label}>
                                <Particle path={mainPath(s.y)} begin={i * 0.9} />
                                <Particle path={mainPath(s.y)} begin={i * 0.9 + DURATION / 2} />
                            </g>
                        ))}
                        <Exception y={SOURCES[2].y} begin={1.4} />
                    </g>
                )}

                {/* Sources */}
                {SOURCES.map((s) => (
                    <g key={s.label}>
                        <rect x="20" y={s.y - 18} width="104" height="36" rx="18" style={node} />
                        <Label x={72} y={s.y}>
                            {s.label}
                        </Label>
                    </g>
                ))}
                <Caption x={72} y={30}>
                    Sources
                </Caption>

                {/* Ingest */}
                <circle cx="212" cy={TRUNK_Y} r="26" style={node} />
                <Label x={212} y={TRUNK_Y}>
                    Ingest
                </Label>
                <Caption x={212} y={TRUNK_Y - 42}>
                    Pipelines
                </Caption>

                {/* Model */}
                <rect x="262" y={TRUNK_Y - 22} width="80" height="44" rx="12" style={node} />
                <Label x={302} y={TRUNK_Y}>
                    Model
                </Label>
                <Caption x={302} y={TRUNK_Y - 42}>
                    Warehouse
                </Caption>

                {/* Controls gate — a diamond, the flowchart shape for a decision. */}
                <rect
                    x={CONTROLS_X - 19}
                    y={TRUNK_Y - 19}
                    width="38"
                    height="38"
                    rx="7"
                    transform={`rotate(45 ${CONTROLS_X} ${TRUNK_Y})`}
                    style={{ ...node, stroke: "var(--ink-quaternary)" }}
                />
                <Label x={CONTROLS_X} y={TRUNK_Y}>
                    ✓
                </Label>
                <Caption x={CONTROLS_X} y={TRUNK_Y - 42}>
                    Controls
                </Caption>

                {/* Agent — the only filled node; everything upstream serves it. */}
                {/* Pulse ring. Scaled inside a group translated to the node's
                    centre, since SVG scales about the origin. */}
                {!reduce && (
                    <g transform={`translate(494 ${TRUNK_Y})`}>
                        <rect
                            x="-40"
                            y="-24"
                            width="80"
                            height="48"
                            rx="14"
                            style={{ fill: "none", stroke: "var(--ink)", strokeWidth: 1 }}
                        >
                            <animate attributeName="opacity" values="0.45;0;0.45" dur="2.6s" repeatCount="indefinite" />
                            <animateTransform
                                attributeName="transform"
                                type="scale"
                                values="1;1.14;1"
                                dur="2.6s"
                                repeatCount="indefinite"
                            />
                        </rect>
                    </g>
                )}
                <rect x="456" y={TRUNK_Y - 22} width="76" height="44" rx="12" style={{ fill: "var(--ink)" }} />
                <Label x={494} y={TRUNK_Y} tone="on-ink">
                    Agent
                </Label>
                <Caption x={494} y={TRUNK_Y - 42}>
                    GenAI
                </Caption>

                {/* Decision */}
                <circle cx="598" cy={TRUNK_Y} r="14" style={node} />
                <path
                    d={`M592 ${TRUNK_Y} l4 4 l7 -8`}
                    style={{ fill: "none", stroke: "var(--ink)", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" }}
                />
                <Caption x={598} y={TRUNK_Y - 42}>
                    Decision
                </Caption>

                {/* Exception branch */}
                <rect
                    x={CONTROLS_X - 56}
                    y="300"
                    width="112"
                    height="36"
                    rx="18"
                    style={{ fill: "var(--surface-raised)", stroke: "var(--signal)", strokeWidth: 1 }}
                />
                <Label x={CONTROLS_X} y={318}>
                    Human review
                </Label>
                <Caption x={CONTROLS_X + 104} y={296}>
                    Exceptions
                </Caption>
            </svg>
        </figure>
    );
}
