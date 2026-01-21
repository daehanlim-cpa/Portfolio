"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import ProjectModal from "@/components/ProjectModal";
import { Project } from "@/data/projects";

export default function PurposePage() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeSkill, setActiveSkill] = useState<string>("ALL");

    const skillCategories = ["ALL", "Data Architecture & Engineering", "Data Governance", "AI & ML"];

    // Filter by skill only
    const filteredProjects = projects.filter(p => {
        const matchesSkill = activeSkill === "ALL" || p.categories.includes(activeSkill);
        return matchesSkill;
    });

    return (
        <>
            <div className="min-h-screen px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    {/* Skill Filter - Smaller, Left-aligned */}
                    <div className="mb-12 flex justify-start">
                        <div className="flex gap-4">
                            {skillCategories.map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => setActiveSkill(skill)}
                                    className={`text-[10px] uppercase tracking-wider transition-colors ${activeSkill === skill
                                            ? "text-black font-medium"
                                            : "text-gray-400 hover:text-black"
                                        }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Project Grid - All projects with visual emphasis */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className={`transition-opacity ${project.type === "purpose" ? "opacity-100" : "opacity-30"
                                    }`}
                            >
                                <ProjectCard
                                    project={project}
                                    onClick={() => setSelectedProject(project)}
                                    isEmphasized={project.type === "purpose"}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </>
    );
}
