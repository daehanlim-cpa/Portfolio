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

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </>
    );
}
