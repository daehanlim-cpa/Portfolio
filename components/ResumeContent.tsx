export default function ResumeContent() {
    return (
        <div className="space-y-8 bg-white rounded-lg border border-gray-200 p-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-light mb-2">Daehan Lim, CPA</h2>
                <div className="text-sm text-gray-600 space-y-1">
                    <p>daehanlim1@gmail.com</p>
                    <div className="flex gap-4">
                        <a
                            href="https://www.linkedin.com/in/daehan-lim-cpa/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="https://github.com/daehanlim-cpa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div>
                <h3 className="text-lg font-normal mb-3">Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                    Forward deployed data and analytics professional with 6+ years of experience owning enterprise customer engagements from discovery through deployment. Leads executive conversations, shapes ambiguous business problems into practical solutions, and personally builds production workflows to deliver measurable results in regulated environments. Brings a CPA background with strong hands-on execution across data modernization and reporting platforms.
                </p>
            </div>

            {/* Professional Experience */}
            <div>
                <h3 className="text-lg font-normal mb-4">Professional Experience</h3>
                <div className="space-y-8">
                    {/* Manager Role */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium text-sm">
                                    Financial Services Tech Consulting AI & Data Manager
                                </p>
                                <p className="text-sm text-gray-600">Ernst & Young | Los Angeles, California</p>
                            </div>
                            <p className="text-sm text-gray-500 whitespace-nowrap">2019 – Present</p>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-gray-700">
                            <li>
                                Serve as forward-deployed technical owner across multiple enterprise customers, leading executive discovery, business walkthroughs, and solution design, then building and deploying production data platforms directly with client teams.
                            </li>
                            <li>
                                Design end-to-end modernization architectures spanning data ingestion, governance, analytics, and BI, translating business workflows into operational systems covering metadata, lineage, data quality, and reporting layers.
                            </li>
                            <li>
                                Hands-on delivery with data operations (analytics engineering and governance) and development operations (CI/CD, environment management) validating solutions and conducting demonstration with users.
                            </li>
                            <li>
                                Helped clients establish metadata management practices by defining business terms, aligning data definitions across teams, and leverage available data lineage features to improve trust, discovery, and analytics adoption.
                            </li>
                            <li>
                                Acted as primary technical advisor across engagements, partnering with platform partners to scope solutions, support account growth, and own outcomes from discovery through value realization.
                            </li>
                        </ul>
                    </div>

                    {/* Senior Role */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium text-sm">
                                    Financial Services Tech Consulting AI & Data Senior
                                </p>
                                <p className="text-sm text-gray-600">Ernst & Young | Los Angeles, California</p>
                            </div>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-gray-700">
                            <li>
                                Served as on-site lead for multiple customer engagements, running walkthroughs with business teams to understand workflows and pain points, translating requirements into data architectures, and building production data models and analytics pipelines.
                            </li>
                            <li>
                                Led hands-on proof-of-concepts to evaluate cloud data platforms, designing ingestion frameworks and analytics layers to guide client modernization decisions.
                            </li>
                            <li>
                                Partnered with business and privacy teams to identify PII across enterprise datasets, translate regulatory and business requirements into technical controls, and personally implement data masking solutions in production environments.
                            </li>
                            <li>
                                Owned delivery of cloud operational data platforms end-to-end, from discovery and schema design through implementation, deployment, and user enablement.
                            </li>
                            <li>
                                Hands-on work to transform source data into analytics-ready datasets, integrated APIs for upstream data ingestion, and deployed working solutions within the defined SLA.
                            </li>
                        </ul>
                    </div>

                    {/* Staff Role */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium text-sm">
                                    Financial Services Business Consulting Enterprise Risk Staff
                                </p>
                                <p className="text-sm text-gray-600">Ernst & Young | Los Angeles, California</p>
                            </div>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-gray-700">
                            <li>
                                Led independent AML, BSA, and OFAC risk and controls assessments across financial institutions and digital asset platforms, evaluating end-to-end AML frameworks, transaction monitoring, sanctions screening, and escalation processes for design and operating effectiveness.
                            </li>
                            <li>
                                Built testing frameworks and reporting workflows to support AML and sanctions engagements, working directly with business stakeholders through implementation.
                            </li>
                            <li>
                                Authored audit-ready AML framework and model validation reports, translating complex findings into clear risk assessments and prioritized remediation actions; presented results to Chief Compliance Officers (CCOs), Chief Audit Executives (CAEs), and senior compliance leadership, and supported remediation tracking through issue closure.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Certifications */}
            <div>
                <h3 className="text-lg font-normal mb-3">Licenses & Certifications</h3>
                <div className="flex flex-wrap gap-2">
                    {[
                        "Certified Public Accountant (CPA)",
                        "Snowpro Advanced: Data Engineer",
                        "Snowpro Advanced: Data Architect",
                        "SnowPro Core Certification",
                        "Databricks Certified Data Engineer Associate",
                    ].map((cert) => (
                        <span
                            key={cert}
                            className="px-3 py-1 bg-gray-100 text-xs text-gray-700 rounded border border-gray-200"
                        >
                            {cert}
                        </span>
                    ))}
                </div>
            </div>

            {/* Skills */}
            <div>
                <h3 className="text-lg font-normal mb-3">Languages & Tools</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded border border-gray-200">
                    SQL, Python, Docker, Spark, Snowflake, Databricks, dbt, Prefect, AWS, Azure
                </p>
            </div>

            {/* Education */}
            <div>
                <h3 className="text-lg font-normal mb-4">Education</h3>
                <div className="space-y-6">
                    <div>
                        <p className="font-medium text-sm italic">University of the Cumberlands, Graduate School of Business</p>
                        <div className="mt-2 space-y-2">
                            <div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium">Doctor of Philosophy in IT (Artificial Intelligence)</p>
                                    <p className="text-xs text-gray-500">2024 – Current</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium">Master of Science in Business Administration</p>
                                    <p className="text-xs text-gray-500">August 2024</p>
                                </div>
                                <p className="text-xs text-gray-600 ml-2 mt-0.5">• Global Business with Blockchain Technology</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between">
                            <p className="font-medium text-sm italic">University of Arizona, Eller College of Management</p>
                            <p className="text-xs text-gray-500">May 2019</p>
                        </div>
                        <p className="text-sm font-medium mt-1">Bachelor of Science in Business Administration</p>
                        <p className="text-xs text-gray-600 ml-2 mt-0.5">• Accounting and Management Information Systems</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
