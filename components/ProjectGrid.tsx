"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/data/projects";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8">
            {projects.map((project, index) => (
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                    <ProjectCard project={project} />
                </motion.div>
            ))}
        </div>
    );
}
