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
                <div className={`w-1/2 h-1/2 transition-all duration-300 group-hover:scale-110 ${isEmphasized
                    ? "text-gray-800 group-hover:text-black"
                    : "text-gray-400"
                    }`}>
                    {IconComponent && <IconComponent />}
                </div>
            </div>

            {/* Code Label */}
            <div className="text-center">
                <p className={`text-sm sm:text-xs uppercase tracking-widest transition-colors mb-1 ${isEmphasized
                    ? "text-gray-500 font-medium group-hover:text-black"
                    : "text-gray-400"
                    }`}>
                    {project.code}
                </p>
                <p className={`text-xs sm:text-[10px] transition-colors ${isEmphasized
                    ? "text-gray-400 group-hover:text-gray-600"
                    : "text-gray-300"
                    }`}>
                    {project.title}
                </p>
            </div>
        </button>
    );
}
