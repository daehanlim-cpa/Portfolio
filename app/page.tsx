"use client";

import { useState } from "react";
import { projects, categories } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { Project } from "@/data/projects";
import BlogSection from "@/components/BlogSection";

export default function HomePage() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeSkill, setActiveSkill] = useState<string>("ALL");

    const skillCategories = categories;

    // Filter by skill only
    const filteredProjects = projects.filter(p => {
        const matchesSkill = activeSkill === "ALL" || p.categories.includes(activeSkill);
        return matchesSkill;
    });

    // Navigation handlers for project modal
    const handleNextProject = () => {
        if (!selectedProject) return;
        const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id);
        const nextIndex = (currentIndex + 1) % filteredProjects.length;
        setSelectedProject(filteredProjects[nextIndex]);
    };

    const handlePreviousProject = () => {
        if (!selectedProject) return;
        const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id);
        const previousIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
        setSelectedProject(filteredProjects[previousIndex]);
    };

    return (
        <>
            <div className="min-h-screen px-4 sm:px-8 py-20">
                <div className="max-w-7xl mx-auto">
                    {/* Skill Filter - Smaller, Left-aligned */}
                    <div className="mb-12 flex justify-start">
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            {skillCategories.map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => setActiveSkill(skill)}
                                    className={`text-xs sm:text-[10px] uppercase tracking-wider transition-colors px-2 py-1 ${activeSkill === skill
                                        ? "text-black font-medium"
                                        : "text-gray-400 hover:text-black"
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Project Grid - All projects shown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => setSelectedProject(project)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Section */}
            <BlogSection />

            {/* Footer with Social Links */}
            <footer className="w-full px-4 sm:px-8 py-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">© 2026 Daehan Lim</p>
                    <div className="flex gap-6">
                        <a
                            href="https://www.linkedin.com/in/daehan-lim-cpa/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="/resume"
                            className="text-xs uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
                        >
                            Resume
                        </a>
                    </div>
                </div>
            </footer>

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                onNext={handleNextProject}
                onPrevious={handlePreviousProject}
            />
        </>
    );
}
