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
                    Finance and Data Transformation Leader with Big 4 financial services
                    experience supporting treasury, liquidity, and regulatory reporting
                    functions within CFO organizations. Leads large-scale modernization of
                    data platforms, embedding automation, analytics, and control frameworks
                    to improve reporting reliability, governance, and decision support in
                    regulated environments. Brings a CPA foundation and advanced AI and
                    analytics skillsets to deliver scalable, audit-ready solutions aligned
                    with enterprise risk and assurance expectations.
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
                            <p className="text-sm text-gray-500 whitespace-nowrap">July 2024 – Present</p>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-gray-700">
                            <li>
                                Led delivery of enterprise liquidity and financial reporting
                                modernization for a $590B public pension fund, automating
                                previously manual Excel-based workflows through structured data
                                ingestion, SQL transformations, and orchestrated pipelines to
                                improve reporting reliability and reduce operational risk.
                            </li>
                            <li>
                                Led global delivery teams supporting a top-25 U.S. financial
                                institution’s cloud and data modernization program, implementing
                                CI/CD, monitoring, and control frameworks across Azure and
                                Snowflake to support treasury and payments reporting.
                            </li>
                            <li>
                                Directed cross-functional teams of engineers and analysts,
                                providing hands-on technical leadership while ensuring solutions
                                met enterprise standards for performance, governance, and
                                auditability.
                            </li>
                            <li>
                                Co-founded EY’s Certification Center, scaling cloud and data
                                engineering capabilities across AWS, Snowflake, Databricks, and
                                Azure to support secure and compliant delivery across financial
                                services engagements.
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
                            <p className="text-sm text-gray-500 whitespace-nowrap">July 2021 – July 2024</p>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-gray-700">
                            <li>
                                Designed and delivered a cloud-based operational data store to
                                support customer support and inquiry workflows for a Caribbean
                                financial institution, enabling secure ingestion, transformation,
                                and analytics across operational data sources.
                            </li>
                            <li>
                                Led Teradata-to-cloud migration initiatives, owning ingestion
                                design, data quality validation, testing, and downstream
                                analytical readiness for regulatory and risk reporting use cases.
                            </li>
                            <li>
                                Partnered with a top 5 U.S. financial institution to design and
                                assess regulatory and liquidity reporting data models (FR-Y14,
                                PRA-110, NSFR, HQLA), supporting supervisory compliance and
                                prudential risk oversight.
                            </li>
                            <li>
                                Managed a 12-person global delivery team across AWS, Snowflake,
                                and Power BI, establishing data governance practices, auditability
                                standards, and operational controls to improve reporting
                                reliability and resilience.
                            </li>
                            <li>
                                Acted as a liaison between engineering teams and business
                                stakeholders, translating regulatory, risk, and operational
                                requirements into implementable data and analytics solutions.
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
                            <p className="text-sm text-gray-500 whitespace-nowrap">Sept 2019 – July 2021</p>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-gray-700">
                            <li>
                                Conducted enterprise risk assessments and detailed controls
                                testing across AML and sanctions programs, evaluating design and
                                operating effectiveness, identifying control gaps, and supporting
                                management in developing and prioritizing remediation actions.
                            </li>
                            <li>
                                Authored formal audit and model validation reports, synthesizing
                                complex findings into clear risk assessments and recommendations,
                                and presented results to Chief Compliance Officers (CCOs) and
                                senior compliance stakeholders.
                            </li>
                            <li>
                                Worked closely with Chief Audit Executives (CAEs), internal audit,
                                and compliance teams to communicate audit observations, track
                                remediation progress, validate corrective actions, and support
                                timely audit issue closure.
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
                    SQL, Python, PyTorch, Docker, Spark, Snowflake, Databricks, dbt, Prefect, AWS, Azure
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
