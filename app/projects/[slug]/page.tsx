import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import React from "react";

export async function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.id,
    }));
}

export default function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = React.use(params);
    const project = projects.find((p) => p.id === resolvedParams.slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-32 px-6 pb-20">
            <article className="max-w-3xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <p className="text-xs font-bold tracking-widest text-gray-500 mb-4 uppercase">{project.code}</p>
                    <h1 className="text-4xl md:text-5xl font-light mb-6">
                        {project.title}
                    </h1>
                    <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                        {project.shortDescription}
                    </p>
                </div>

                {/* Links */}
                <div className="flex justify-center gap-6 mb-20">
                    {project.links.demo && (
                        <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold tracking-widest uppercase hover:text-gray-600 border-b border-black pb-1"
                        >
                            Live Demo
                        </a>
                    )}
                    {project.links.repo && (
                        <a
                            href={project.links.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold tracking-widest uppercase hover:text-gray-600 border-b border-black pb-1"
                        >
                            View Code
                        </a>
                    )}
                    {project.links.pdf && (
                        <a
                            href={project.links.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold tracking-widest uppercase hover:text-gray-600 border-b border-black pb-1"
                        >
                            Case Study
                        </a>
                    )}
                </div>

                {/* Content Sections */}
                <div className="space-y-16">
                    {/* Overview */}
                    {project.overview && (
                        <section>
                            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-gray-200 pb-4 mb-6">Overview</h2>
                            <p className="text-gray-600 font-light leading-relaxed text-lg">
                                {project.overview}
                            </p>
                        </section>
                    )}

                    {/* Problem */}
                    {project.problem && project.problem.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-gray-200 pb-4 mb-6">The Problem</h2>
                            <ul className="space-y-4">
                                {project.problem.map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <span className="text-xs font-bold shrink-0 mt-1.5 opacity-50">0{i + 1}</span>
                                        <span className="text-gray-600 font-light leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Solution & Approach */}
                    {(project.solution || project.approach) && (
                        <section>
                            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-gray-200 pb-4 mb-6">Solution & Approach</h2>
                            {project.solution && (
                                <p className="text-gray-600 font-light leading-relaxed mb-8 text-lg">
                                    {project.solution}
                                </p>
                            )}
                            {project.approach && (
                                <div className="space-y-4">
                                    {project.approach.map((step, i) => (
                                        <div key={i} className="pl-6 border-l border-gray-200">
                                            <p className="text-gray-600 font-light italic">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Impact */}
                    {project.impact && project.impact.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold tracking-widest uppercase border-b border-gray-200 pb-4 mb-6">Impact</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {project.impact.map((result, i) => (
                                    <div key={i} className="bg-gray-50 p-6">
                                        <p className="text-gray-800 font-medium text-lg text-center">
                                            {result}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Tech Stack */}
                    <section>
                        <h2 className="text-xs font-bold tracking-widest uppercase border-b border-gray-200 pb-4 mb-6">Technologies</h2>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-4 py-2 bg-gray-100 text-xs tracking-wider uppercase text-gray-600 mix-blend-multiply"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </article>
        </div>
    );
}
