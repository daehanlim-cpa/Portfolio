import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

export async function generateStaticParams() {
    return projects.map((project) => ({
        id: project.id,
    }));
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const project = projects.find((p) => p.id === resolvedParams.id);

    if (!project) {
        notFound();
    }

    const currentIndex = projects.findIndex(p => p.id === project.id);
    const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
    const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-8 md:px-16 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left - Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative aspect-square">
                            <Image
                                src={project.heroImage}
                                alt={project.code}
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        {project.galleryImages && project.galleryImages.length > 1 && (
                            <div className="grid grid-cols-3 gap-4">
                                {project.galleryImages.slice(1).map((img, idx) => (
                                    <div key={idx} className="relative aspect-square">
                                        <Image
                                            src={img}
                                            alt={`${project.code} - ${idx + 1}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right - Details */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                                {project.code}
                            </p>
                            <h1 className="text-2xl font-light mb-4">{project.title}</h1>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {project.shortDescription}
                            </p>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-2">
                            {project.categories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={`/skill/${encodeURIComponent(cat)}`}
                                    className="text-xs px-3 py-1 border border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>

                        {/* Problem */}
                        <div>
                            <h2 className="text-xs uppercase tracking-wider text-gray-900 mb-3">
                                Problem
                            </h2>
                            <ul className="space-y-2">
                                {project.problem.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                        <span className="text-gray-400">—</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Approach */}
                        <div>
                            <h2 className="text-xs uppercase tracking-wider text-gray-900 mb-3">
                                Approach
                            </h2>
                            <ul className="space-y-2">
                                {project.approach.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                        <span className="text-gray-400">—</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Impact */}
                        <div>
                            <h2 className="text-xs uppercase tracking-wider text-gray-900 mb-3">
                                Impact
                            </h2>
                            <ul className="space-y-2">
                                {project.impact.map((item, idx) => (
                                    <li key={idx} className="text-sm text-gray-600 flex gap-2">
                                        <span className="text-gray-400">—</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <h2 className="text-xs uppercase tracking-wider text-gray-900 mb-3">
                                Tech Stack
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="text-xs px-3 py-1 bg-gray-100 text-gray-700"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        {(project.links.demo || project.links.repo || project.links.pdf) && (
                            <div className="flex gap-4 pt-4">
                                {project.links.demo && (
                                    <a
                                        href={project.links.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 border border-black bg-black text-white text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                                    >
                                        View Demo
                                    </a>
                                )}
                                {project.links.repo && (
                                    <a
                                        href={project.links.repo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                                    >
                                        View Repo
                                    </a>
                                )}
                                {project.links.pdf && (
                                    <a
                                        href={project.links.pdf}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                                    >
                                        Case Study
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Next/Previous Navigation */}
                <div className="flex justify-between items-center mt-24 pt-8 border-t border-gray-200">
                    {prevProject ? (
                        <Link
                            href={`/project/${prevProject.id}`}
                            className="text-xs uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity"
                        >
                            ← {prevProject.code}
                        </Link>
                    ) : (
                        <div />
                    )}

                    <Link
                        href="/"
                        className="text-xs uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity"
                    >
                        All Projects
                    </Link>

                    {nextProject ? (
                        <Link
                            href={`/project/${nextProject.id}`}
                            className="text-xs uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity"
                        >
                            {nextProject.code} →
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        </main>
    );
}

import React from "react";
