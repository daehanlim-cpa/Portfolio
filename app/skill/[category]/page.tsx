import ProjectGrid from "@/components/ProjectGrid";
import { projects } from "@/data/projects";

export async function generateStaticParams() {
    const categories = Array.from(
        new Set(projects.flatMap(p => p.categories))
    );
    return categories.map(category => ({
        category: encodeURIComponent(category)
    }));
}

export default function SkillPage({ params }: { params: Promise<{ category: string }> }) {
    const resolvedParams = React.use(params);
    const category = decodeURIComponent(resolvedParams.category);

    const filteredProjects = projects.filter(project =>
        project.categories.includes(category)
    );

    return (
        <main className="min-h-screen bg-white py-16 px-8 md:px-16">
            <ProjectGrid projects={filteredProjects} />
        </main>
    );
}

import React from "react";
