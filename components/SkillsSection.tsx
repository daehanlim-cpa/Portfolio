export default function SkillsSection() {
    const skills = [
        "SQL",
        "Python",
        "Docker",
        "Snowflake",
        "Databricks",
        "dbt",
        "Power BI",
        "AWS",
        "Azure",
    ];

    return (
        <section className="w-full py-20 px-6 bg-gray-50">
            <div className="max-w-content mx-auto">
                <h2 className="text-2xl md:text-3xl font-light mb-10">Core Skills</h2>
                <div className="flex flex-wrap gap-3">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-700"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
