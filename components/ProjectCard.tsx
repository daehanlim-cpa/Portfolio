"use client";

import { Project } from "@/data/projects";
import { Icons } from "@/components/ProjectIcons";

interface ProjectCardProps {
    project: Project;
    onClick?: () => void;
    isEmphasized?: boolean;
}

export default function ProjectCard({ project, onClick, isEmphasized = true }: ProjectCardProps) {
    const IconComponent = Icons[project.iconKey as keyof typeof Icons];

    return (
        <button
            onClick={onClick}
            disabled={!onClick}
            className={`group block text-left w-full ${!onClick ? 'cursor-default' : ''}`}
        >
            {/* Icon Container */}
            <div className="relative aspect-square mb-4 flex items-center justify-center bg-transparent">
                <div className={`w-1/3 h-1/3 transition-all duration-300 group-hover:scale-110 ${isEmphasized
                    ? "text-gray-800 group-hover:text-black"
                    : "text-gray-400"
                    }`}>
                    {IconComponent && <IconComponent />}
                </div>
            </div>

            {/* Code Label */}
            <div className="text-center">
                <p className={`text-xs uppercase tracking-widest transition-colors ${isEmphasized
                    ? "text-gray-500 font-medium group-hover:text-black"
                    : "text-gray-400"
                    }`}>
                    {project.code}
                </p>
            </div>
        </button>
    );
}
