"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Project } from "@/data/projects";
import { Icons } from "./ProjectIcons";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!project) return null;

    const IconComponent = Icons[project.iconKey as keyof typeof Icons];

    // Custom Architecture Visualization for DL-01 and DL-02
    const renderArchitectureVisual = () => {
        if (project.id === "liquidity-platform") {
            return (
                <div className="w-full py-12 overflow-x-auto">
                    <div className="min-w-[600px] px-8 relative">
                        {/* Connecting Line - Perfectly Centered on Circles (h-24 = 6rem, center = 3rem = top-12) */}
                        <div className="absolute top-12 left-0 w-full h-[1px] bg-gray-200 -z-10" />

                        <div className="flex justify-between items-start">
                            {/* Node 1: Sources */}
                            <div className="flex flex-col items-center bg-white px-2">
                                <div className="w-24 h-24 rounded-full border border-gray-200 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Sources</span>
                                    <span className="text-xl font-light">8</span>
                                    <span className="text-[9px] text-gray-400">SYSTEMS</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">Raw Data</span>
                            </div>

                            {/* Node 2: Ingestion */}
                            <div className="flex flex-col items-center bg-white px-2">
                                <div className="w-24 h-24 rounded-full border border-gray-900 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Ingest</span>
                                    <span className="text-sm font-bold tracking-wider">PREFECT</span>
                                    <span className="text-[9px] text-gray-400 mt-1">ORCHESTRATION</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">Auto-Run</span>
                            </div>

                            {/* Node 3: Transformation */}
                            <div className="flex flex-col items-center bg-white px-2">
                                <div className="w-24 h-24 rounded-full border border-gray-900 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Transform</span>
                                    <span className="text-sm font-bold tracking-wider">dbt</span>
                                    <span className="text-[9px] text-gray-400 mt-1">SNOWFLAKE</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">Modeling</span>
                            </div>

                            {/* Node 4: Consumption */}
                            <div className="flex flex-col items-center bg-white px-2">
                                <div className="w-24 h-24 rounded-full border border-gray-200 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Consume</span>
                                    <span className="text-xl font-light">16</span>
                                    <span className="text-[9px] text-gray-400">DASHBOARDS</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">Insights</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Custom Architecture Visualization for DL-02 (Snowflake Consumption Layer)
        if (project.id === "cloud-modernization") {
            return (
                <div className="w-full py-12 overflow-x-auto">
                    <div className="min-w-[700px] px-4 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-12 left-0 w-full h-[1px] bg-gray-200 -z-10" />

                        <div className="flex justify-between items-start">
                            {/* Node 1: Intake */}
                            <div className="flex flex-col items-center bg-white px-2">
                                <div className="w-24 h-24 rounded-full border border-gray-200 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Intake</span>
                                    <span className="text-xl font-light">435</span>
                                    <span className="text-[9px] text-gray-400">TICKETS</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">JIRA</span>
                            </div>

                            {/* Node 2: Build */}
                            <div className="flex flex-col items-center bg-white px-2">
                                <div className="w-24 h-24 rounded-full border border-gray-900 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Build</span>
                                    <span className="text-sm font-bold tracking-wider">338</span>
                                    <span className="text-[9px] text-gray-400 mt-1">VIEWS</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">Snowflake</span>
                            </div>

                            {/* Node 3: Release */}
                            <div className="flex flex-col items-center bg-white px-2">
                                <div className="w-24 h-24 rounded-full border border-gray-900 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Release</span>
                                    <span className="text-sm font-bold tracking-wider">CI/CD</span>
                                    <span className="text-[9px] text-gray-400 mt-1">GITLAB</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">RFC</span>
                            </div>

                            {/* Node 4: Production */}
                            <div className="flex flex-col items-center bg-white px-2">
                                <div className="w-24 h-24 rounded-full border border-gray-900 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Prod</span>
                                    <span className="text-xl font-light">265</span>
                                    <span className="text-[9px] text-gray-400">TIER-1</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">100%</span>
                            </div>

                            {/* Node 5: Analytics */}
                            <div className="flex flex-col items-center bg-white px-2">
                                <div className="w-24 h-24 rounded-full border border-gray-200 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Consume</span>
                                    <span className="text-xs font-bold tracking-wider">ENTERPRISE</span>
                                    <span className="text-[9px] text-gray-400 mt-1">ANALYTICS</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">Insights</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Custom Architecture Visualization for DL-03 (EY Certification Center)
        if (project.id === "certification-center") {
            return (
                <div className="w-full py-12 overflow-x-auto">
                    <div className="min-w-[500px] px-12 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-12 left-0 w-full h-[1px] bg-gray-200 -z-10" />

                        <div className="flex justify-between items-start">
                            {/* Node 1: Inputs */}
                            <div className="flex flex-col items-center bg-white px-4">
                                <div className="w-24 h-24 rounded-full border border-gray-200 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Partners</span>
                                    <span className="text-xl font-light">5+</span>
                                    <span className="text-[9px] text-gray-400">ALLIANCES</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">Curriculum</span>
                            </div>

                            {/* Node 2: The Platform (Highlighted) */}
                            <div className="flex flex-col items-center bg-white px-4">
                                <div className="w-24 h-24 rounded-full border border-gray-900 bg-black flex flex-col items-center justify-center shadow-lg mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Platform</span>
                                    <span className="text-sm font-bold tracking-wider text-white">CENTER</span>
                                    <span className="text-[9px] text-gray-400 mt-1">COMMUNITY</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">Enablement</span>
                            </div>

                            {/* Node 3: Outputs */}
                            <div className="flex flex-col items-center bg-white px-4">
                                <div className="w-24 h-24 rounded-full border border-gray-200 flex flex-col items-center justify-center bg-white shadow-sm mb-4">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Talent</span>
                                    <span className="text-xl font-light">600+</span>
                                    <span className="text-[9px] text-gray-400">CERTIFIED</span>
                                </div>
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest">Impact</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Default generic code block for other projects if they have diagram code
        return project.architectureDiagram && (
            <div className="bg-gray-50 p-4 mb-6 rounded border border-gray-100 overflow-x-auto">
                <pre className="text-[10px] md:text-xs font-mono text-gray-500 whitespace-pre">
                    {project.architectureDiagram}
                </pre>
                <p className="text-[10px] text-center mt-2 text-gray-400 uppercase tracking-widest">System Data Flow</p>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-white z-[60]"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                        className="fixed inset-0 z-[70] overflow-y-auto"
                    >
                        <div className="min-h-screen px-6 sm:px-8 py-20">
                            <div className="max-w-4xl mx-auto">
                                {/* Close Button - Improved for mobile */}
                                <button
                                    onClick={onClose}
                                    className="fixed top-6 right-6 sm:top-8 sm:right-8 w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all z-50 border border-gray-200"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Project Detail Content - Vertical Layout */}
                                <div className="flex flex-col items-center">
                                    {/* Icon - Centered at Top */}
                                    <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 text-gray-800 mb-8 sm:mb-12">
                                        {IconComponent && <IconComponent />}
                                    </div>

                                    {/* Content Below - Centered */}
                                    <div className="w-full max-w-2xl space-y-8 sm:space-y-12">
                                        {/* Header: Title & Description */}
                                        <div className="text-center">
                                            <p className="text-sm sm:text-xs font-bold tracking-widest text-gray-500 mb-2">{project.code}</p>
                                            <h2 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">{project.title}</h2>
                                            <p className="text-base sm:text-xl text-gray-600 font-light leading-relaxed">{project.shortDescription}</p>
                                        </div>

                                        {/* OVERVIEW SECTION */}
                                        {project.overview && (
                                            <div>
                                                <h3 className="text-sm sm:text-xs font-bold tracking-widest uppercase border-b border-black pb-2 mb-4">Overview</h3>
                                                <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">{project.overview}</p>
                                            </div>
                                        )}

                                        {/* PROBLEM & KPIs SECTION */}
                                        <div>
                                            <h3 className="text-sm sm:text-xs font-bold tracking-widest uppercase border-b border-black pb-2 mb-4">Problem & Baseline</h3>
                                            <ul className="space-y-4 mb-6">
                                                {project.problem.map((item, i) => (
                                                    <li key={i} className="flex gap-3 sm:gap-4">
                                                        <span className="text-sm sm:text-xs font-bold shrink-0 mt-1">0{i + 1}</span>
                                                        <span className="text-sm sm:text-base text-gray-600 font-light">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {project.baselineKPIs && (
                                                <div className="bg-gray-50 p-4 sm:p-6 rounded-sm border border-gray-100">
                                                    <h4 className="text-sm sm:text-xs font-bold uppercase mb-4 text-gray-400">Baseline KPIs</h4>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {project.baselineKPIs.map((kpi, i) => (
                                                            <div key={i} className="text-xs sm:text-sm font-mono text-gray-600 border-l-2 border-gray-200 pl-3">
                                                                {kpi}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* SOLUTION & APPROACH SECTION */}
                                        <div>
                                            <h3 className="text-sm sm:text-xs font-bold tracking-widest uppercase border-b border-black pb-2 mb-4">Solution</h3>
                                            {project.solution && (
                                                <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed mb-6">{project.solution}</p>
                                            )}

                                            {project.keyCapabilities && (
                                                <div className="mb-8">
                                                    <h4 className="text-sm sm:text-xs font-bold uppercase mb-3 text-gray-400">Key Capabilities</h4>
                                                    <ul className="space-y-2">
                                                        {project.keyCapabilities.map((cap, i) => (
                                                            <li key={i} className="flex gap-3 text-xs sm:text-sm text-gray-600 font-light">
                                                                <span className="text-black">•</span>
                                                                {cap}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <h4 className="text-sm sm:text-xs font-bold uppercase mb-3 text-gray-400">Approach</h4>
                                                {project.approach.map((step, i) => (
                                                    <p key={i} className="text-xs sm:text-sm text-gray-600 font-light border-l border-black pl-4 py-1">
                                                        {step}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>

                                        {/* TECHNICAL ARCHITECTURE SECTION */}
                                        {(project.architectureDiagram || project.architectureComponents) && (
                                            <div>
                                                <h3 className="text-sm sm:text-xs font-bold tracking-widest uppercase border-b border-black pb-2 mb-8">Technical Architecture</h3>

                                                {/* Creative Visual Diagram */}
                                                <div className="mb-0">
                                                    {renderArchitectureVisual()}
                                                </div>

                                                {project.architectureComponents && (
                                                    <ul className="grid grid-cols-1 gap-3 mt-4">
                                                        {project.architectureComponents.map((comp, i) => (
                                                            <li key={i} className="text-xs sm:text-sm border border-gray-100 p-3 bg-white shadow-sm">
                                                                <span className="font-semibold block text-xs uppercase text-gray-400 mb-1">{comp.split(':')[0]}</span>
                                                                <span className="text-gray-700 font-light">{comp.split(':')[1]}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}

                                        {/* GOVERNANCE SECTION */}
                                        {project.governance && (
                                            <div>
                                                <h3 className="text-sm sm:text-xs font-bold tracking-widest uppercase border-b border-black pb-2 mb-4">Governance & Reliability</h3>
                                                <ul className="grid grid-cols-1 gap-4">
                                                    {project.governance.map((item, i) => (
                                                        <li key={i} className="flex gap-3 text-xs sm:text-sm text-gray-600 font-light items-start">
                                                            <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* IMPACT / VALUE DELIVERED SECTION */}
                                        <div>
                                            <h3 className="text-sm sm:text-xs font-bold tracking-widest uppercase border-b border-black pb-2 mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                <span>Value Delivered</span>
                                                <span className="text-[10px] text-gray-400 normal-case font-normal border border-gray-200 px-2 py-0.5 rounded-full self-start sm:self-auto"> ROI Verified </span>
                                            </h3>
                                            <ul className="grid grid-cols-1 gap-4">
                                                {project.impact.map((result, i) => (
                                                    <li key={i} className="bg-gray-50 p-3 sm:p-4 flex flex-col gap-2 border-l-2 border-black">
                                                        <span className="text-xs font-bold uppercase tracking-widest text-black/50">Result {i + 1}</span>
                                                        <span className="text-sm sm:text-base text-gray-800 font-medium">{result}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* TECH STACK & LINKS */}
                                        <div className="pt-8 border-t border-gray-100">
                                            <div className="flex flex-wrap gap-2 justify-center mb-8">
                                                {project.techStack.map((tech) => (
                                                    <span key={tech} className="px-3 py-1 bg-gray-100 text-xs tracking-wider uppercase">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex justify-center gap-8">
                                                {project.links.demo && (
                                                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-xs font-bold tracking-widest hover:underline uppercase">
                                                        LIVE DEMO
                                                    </a>
                                                )}
                                                {project.links.repo && (
                                                    <a href={project.links.repo} target="_blank" rel="noopener noreferrer" className="text-xs font-bold tracking-widest hover:underline uppercase">
                                                        VIEW CODE
                                                    </a>
                                                )}
                                                {project.links.pdf && (
                                                    <a href={project.links.pdf} target="_blank" rel="noopener noreferrer" className="text-xs font-bold tracking-widest hover:underline uppercase">
                                                        CASE STUDY
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Back Button */}
                                        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
                                            <button
                                                onClick={onClose}
                                                className="text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors font-medium"
                                            >
                                                ← BACK TO PROJECTS
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
