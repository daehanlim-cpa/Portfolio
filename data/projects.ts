export interface Project {
    id: string;
    code: string;
    title: string;
    type: "professional" | "project" | "purpose";
    categories: string[];
    iconKey: string;
    heroImage: string;
    galleryImages?: string[];
    shortDescription: string;
    // Enhanced Case Study Fields
    overview?: string;
    baselineKPIs?: string[];
    problem: string[];
    solution?: string;
    keyCapabilities?: string[];
    architectureDiagram?: string;
    architectureComponents?: string[];
    governance?: string[];
    approach: string[];
    impact: string[];
    techStack: string[];
    links: {
        demo?: string;
        repo?: string;
        pdf?: string;
    };
}

export const projects: Project[] = [
    // PROFESSIONAL WORK (First 6)
    {
        id: "liquidity-platform",
        code: "DL-01",
        title: "Enterprise Liquidity Reporting",
        type: "professional",
        categories: ["Data", "Governance & Compliance"],
        iconKey: "Liquidity",
        heroImage: "/images/project1.png",
        galleryImages: ["/images/project1.png"],
        shortDescription: "Automated liquidity reporting for large government pension fund",
        overview: "A large government pension fund relied on manual, Excel-based workflows to produce critical investment and operational reports used by leadership. These processes were time-consuming, error-prone, and limited decision-making due to delayed data availability. The initiative focused on modernizing reporting through automated ingestion, SQL-based transformations, and orchestrated pipelines to improve reliability, reduce operational risk, and enable faster, data-driven decisions.",
        problem: [
            "Manual execution: Weekly Excel workflows required significant analyst effort and manual validation, creating inefficiency and operational fragility.",
            "Limited cadence: Reports ran once per week, with data unavailable sometimes until T+2, limiting leadership's ability to monitor conditions proactively.",
            "High rework risk: Errors were frequently discovered late, requiring manual fixes and reprocessing.",
            "Key-person dependency: Reporting execution relied on a single analyst, creating continuity and operational risk.",
            "Lack of environment controls: No DEV / TEST / PROD separation resulted in data silos and inconsistent outputs."
        ],
        baselineKPIs: [
            "Reporting cadence: Weekly",
            "Analyst effort: ~6 hours per run (1 FTE)",
            "Error handling: Manual fixes post-report generation",
            "Early issue detection: Limited"
        ],
        solution: "Designed and delivered an automated, production-grade reporting platform with governance, monitoring, and scalability built into the architecture.",
        keyCapabilities: [
            "Automated ingestion from 8 upstream source systems (30–40 files per cycle)",
            "SQL-driven transformations using dbt",
            "Orchestrated workflows with dependency management and retry logic",
            "Controlled DEV / STG / PROD environments with CI/CD approvals",
            "Centralized semantic layer powering leadership dashboards",
            "Embedded data quality checks with early-warning detection prior to consumption"
        ],
        architectureDiagram: `graph TD
    subgraph Sources
        S1[8 Source Systems]
        S2[30-40 Files]
    end

    subgraph Ingestion
        P[Prefect Orchestration]
        ADL[Azure Data Lake]
    end

    subgraph Transformation
        SF[Snowflake Data Warehouse]
        DBT[dbt Transformations]
    end

    subgraph Consumption
        PBI[Power BI App]
        Users[Leadership Dashboards]
    end

    S1 --> P
    S2 --> P
    P --> ADL
    ADL --> SF
    SF --> DBT
    DBT --> PBI
    PBI --> Users`,
        architectureComponents: [
            "Cloud & Platform: Azure, Snowflake",
            "Transformation: dbt Cloud (materialized models, artifacts-driven tuning)",
            "Orchestration: Prefect",
            "BI & Distribution: Power BI App (16 dashboards, ~700 datasets)",
            "CI/CD: GitHub with approval-based promotion to higher environments"
        ],
        governance: [
            "Schema validation, null checks, and business rule enforcement",
            "Central Data Readiness Dashboard for issue visibility",
            "Snowflake RBAC and Power BI row-level security",
            "Ability to overwrite or suppress bad data early, preventing downstream impact"
        ],
        approach: [
            "Structured ingestion pipelines to standardize raw data intake",
            "Modular SQL transformations using dbt for maintainability and transparency",
            "Orchestrated execution in a cloud-native environment",
            "Incremental rollout to production with validation checkpoints"
        ],
        impact: [
            "Reduced reporting effort from ~6 hours → ~1 hour per run, saving ~5 analyst hours weekly",
            "Improved reporting cadence from weekly → daily, with data available T+1 by 8:00 AM PT",
            "Eliminated key-person dependency through automated execution",
            "Achieved ~90% on-time SLA for daily production pipelines",
            "Shifted error detection upstream, preventing issues from reaching leadership dashboards"
        ],
        techStack: ["Azure", "Snowflake", "dbt", "Prefect", "Power BI", "GitHub"],
        links: {}
    },
    {
        id: "cloud-modernization",
        code: "DL-02",
        title: "Enterprise Analytics Factory",
        type: "professional",
        categories: ["Data"],
        iconKey: "Database",
        heroImage: "/images/project2.png",
        galleryImages: ["/images/project2.png"],
        shortDescription: "Scaling a Snowflake consumption layer for enterprise analytics",
        overview: "A top-tier U.S. regional financial institution launched a multi-year Data Factory initiative to modernize enterprise analytics and standardize how data is delivered to downstream consumers. The Snowflake Hydration Pod served as the centralized execution team responsible for delivering approved enterprise data elements into Snowflake with production-grade quality and reliability.",
        problem: [
            "Fragmented execution ownership: Enterprise data elements were identified by multiple upstream teams, but no single team owned execution into analytics platforms.",
            "Inconsistent delivery: Snowflake consumption assets were delivered unevenly, creating risk of backlog as demand increased.",
            "High coordination overhead: Significant effort was required to align across teams, slowing time-to-availability for analytics consumers.",
            "Release complexity: Production deployments required careful coordination across domains and environments without standardized release patterns."
        ],
        solution: "Led the Snowflake Hydration Pod as the centralized execution layer responsible for delivering approved enterprise data elements into Snowflake. Implemented standardized workflows, automated data validation, and formal release governance to ensure production-quality analytics at scale.",
        keyCapabilities: [
            "Centralized ownership of Snowflake consumption delivery",
            "Repeatable intake, mapping, build, test, and release workflow",
            "Automated data quality testing using Gherkin framework",
            "Formal RFC-based production release management",
            "Executive-facing delivery reporting and stakeholder communication"
        ],
        architectureDiagram: `graph TD
    subgraph Intake
        REQ[Enterprise Data Requests]
        JIRA[JIRA Tickets]
    end

    subgraph Build
        MAP[Data Mapping]
        DEV[View Development]
        TEST[Gherkinator Testing]
    end

    subgraph Release
        CI[GitLab CI/CD]
        PROD[Production Deploy]
    end

    subgraph Consumption
        T1[Tier-1 Views]
        FED[Federated Domains]
        ANALYTICS[Enterprise Analytics]
    end

    REQ --> JIRA
    JIRA --> MAP
    MAP --> DEV
    DEV --> TEST
    TEST --> CI
    CI --> PROD
    PROD --> T1
    PROD --> FED
    T1 --> ANALYTICS
    FED --> ANALYTICS`,
        architectureComponents: [
            "Platform: Snowflake Data Cloud",
            "CI/CD: GitLab automated deployment pipelines",
            "Testing: Gherkin data validation framework",
            "Project Management: JIRA for intake and delivery governance"
        ],
        governance: [
            "Formal RFC and approval processes for all production deployments",
            "Standardized intake-to-production workflow with clear accountability",
            "Cross-team dependency management to ensure release readiness",
            "Tier-1 and federated domain ownership with defined responsibilities"
        ],
        baselineKPIs: [
            "Delivery backlog: High and accumulating",
            "Production reliability: Inconsistent",
            "Release cycle: Ad-hoc / slow",
            "Data trust: Low due to limited automated validation"
        ],
        approach: [
            "Intake-driven execution using structured JIRA workflows",
            "Standardized intake-to-production lifecycle",
            "Embedded automated validation in CI/CD pipelines",
            "Global team coordination across time zones",
            "Formal approval checkpoints for production readiness"
        ],
        impact: [
            "Eliminated delivery bottlenecks by completing 435+ requests with zero backlog",
            "Guaranteed 100% production availability for 265 Tier-1 critical analytics assets",
            "Expanded enterprise analytics access by delivering 338+ Snowflake consumption views",
            "Enabled scalable production delivery with 28 net-new data pipelines deployed",
            "Established the organizational benchmark for high-velocity, production-grade data execution"
        ],
        techStack: ["Snowflake", "GitLab CI/CD", "Gherkin", "JIRA"],
        links: {}
    },
    {
        id: "certification-center",
        code: "DL-03",
        title: "EY Certification Center",
        type: "professional",
        categories: [],
        iconKey: "Education",
        heroImage: "/images/project3.png",
        galleryImages: ["/images/project3.png"],
        shortDescription: "Building a scalable learning platform to upskill enterprise data talent",
        overview: "Within EY, rapid growth in data and cloud engagements created demand for certified talent across modern platforms—but learning efforts were fragmented, hard to scale, and difficult to track. The Certification Center was established as a centralized learning and talent enablement platform to address this gap.",
        problem: [
            "No centralized learning community or platform for certification preparation",
            "Alliance-led certifications (Snowflake, Databricks, Azure, AWS, Neo4j) were siloed and difficult to manage",
            "Professionals lacked visibility into certification paths and progress",
            "Leadership could not easily identify or staff engagement opportunities with certified talent",
            "Training focused on theory, with limited hands-on application"
        ],
        solution: "Co-founded and scaled the Certification Center as a centralized learning and talent enablement platform. Built a community-driven model combining structured certification prep, participating-led experience sharing, and hands-on coding challenges.",
        keyCapabilities: [
            "Centralized learning and talent enablement platform",
            "Community-driven model with participant-led experience sharing",
            "Hands-on coding challenges to complement certifications",
            "Structured tracking for participation, progress, and readiness",
            "Leadership pipeline cultivation to scale delivery"
        ],
        governance: [
            "Unified operating model for all data & cloud certifications",
            "Structured tracking of participant progress and readiness",
            "Alliance-aligned learning tracks",
            "Consistent certification pipelines for engagement staffing"
        ],
        baselineKPIs: [
            "Learning Model: Fragmented & Siloed",
            "Visibility: None into talent pool",
            "Scalability: Limited by manual effort",
            "Hands-on Practice: Theory-focused only"
        ],
        approach: [
            "Co-founded the Certification Center from ground up",
            "Designed alliance-aligned learning tracks",
            "Introduced hands-on coding challenges",
            "Established leadership cultivation program"
        ],
        impact: [
            "Upskilled 600+ professionals across data and cloud certifications",
            "Cultivated 30+ leaders to run cohorts, bootcamps, and learning tracks",
            "Awarded AI & Data Learning Champion of the Year for impact and leadership",
            "Transformed upskilling into a scalable capability, increasing the firm's certified talent pool",
            "Improved engagement staffing efficiency and delivery readiness"
        ],
        techStack: ["Snowflake", "Databricks", "Azure", "AWS", "Neo4j"],
        links: {}
    },
    {
        id: "teradata-migration",
        code: "DL-04",
        title: "Low-Latency Operational Data Store",
        type: "professional",
        categories: ["Data", "Governance & Compliance"],
        iconKey: "Migration",
        heroImage: "/images/project4.png",
        galleryImages: ["/images/project4.png"],
        shortDescription: "Designing a low-latency operational data store for customer support APIs",
        overview: "A Caribbean financial institution experienced slow and costly API calls when customer support systems queried customer data in real time. Each customer inquiry triggered direct calls to analytical systems, creating latency, reliability issues, and unnecessary cost at scale. The objective was to improve response time and reduce per-call cost while maintaining secure, consistent access to operational customer data.",
        problem: [
            "Customer support workflows depended on real-time API calls to retrieve customer information",
            "API calls were slow, degrading agent experience and customer satisfaction",
            "API calls were expensive, as every request incurred platform and compute costs",
            "Analytical platforms were being used for operational workloads, which is an architectural anti-pattern"
        ],
        solution: "Designed and delivered a cloud-based Operational Data Store (ODS) purpose-built for customer support APIs. Shifted API read traffic away from analytical systems into an AWS-backed operational model with structured ingestion and transformation pipelines to keep operational data current.",
        keyCapabilities: [
            "AWS Aurora as primary operational read store",
            "Amazon Redshift for downstream analytics and reporting",
            "Modeled customer entities for read-optimized access",
            "Defined update cadence aligned to business SLAs rather than real-time overengineering",
            "Validated API response times and failure modes under load"
        ],
        architectureComponents: [
            "Cloud & Platform: AWS Aurora, Amazon Redshift",
            "API Testing: Postman for validation and performance testing",
            "Security: Access controls aligned with financial data requirements"
        ],
        governance: [
            "Separated operational reads from analytical workloads",
            "Optimized for low-latency, high-concurrency access",
            "Maintained data consistency without over-engineering real-time sync",
            "Ensured security and access controls aligned with financial data requirements"
        ],
        approach: [
            "Identified architectural mismatch between operational and analytical workloads",
            "Designed systems aligned to workload characteristics",
            "Implemented read-optimized customer entity models",
            "Validated performance under load with Postman"
        ],
        impact: [
            "Reduced API response latency, improving agent productivity",
            "Lowered per-call infrastructure cost by removing unnecessary analytical queries",
            "Improved reliability and consistency of customer support workflows",
            "Established a scalable pattern for future operational data use cases"
        ],
        techStack: ["AWS Aurora", "Amazon Redshift", "Postman", "SQL"],
        links: {}
    },
    {
        id: "regulatory-reporting",
        code: "DL-05",
        title: "Enterprise Platform Evaluation: Snowflake vs Databricks",
        type: "professional",
        categories: ["Strategy", "Data"],
        iconKey: "Strategy",
        heroImage: "/images/project5.png",
        galleryImages: ["/images/project5.png"],
        shortDescription: "Strategic platform selection POC for Teradata migration",
        overview: "A large enterprise was migrating off Teradata, which had become a bottleneck for both analytics and advanced use cases. Leadership needed to decide between Snowflake and Databricks as the strategic data platform. This decision would influence years of delivery, cost structure, and capability.",
        problem: [
            "Existing Teradata environment suffered from long query runtimes",
            "Limited scalability for modern workloads",
            "Poor fit for machine learning and API-based integrations",
            "Leadership needed clarity on which platform best supports current and future data needs"
        ],
        solution: "Structured a comprehensive POC around real decision drivers, not feature checklists. Evaluated both platforms across external API integration, complex enterprise data modeling, and machine learning workflows. Assessed performance, developer experience, operational complexity, security and governance, and cost considerations.",
        keyCapabilities: [
            "Designed evaluation criteria and success metrics",
            "Coordinated hands-on platform testing across use cases",
            "Led stakeholder sessions with engineering, data science, and IT security",
            "Guided vendor onboarding and platform enablement",
            "Acted as project manager and technical lead"
        ],
        approach: [
            "Structured POC around three use cases: API integration, data modeling, ML workflows",
            "Evaluated platforms across performance, developer experience, operational complexity, security, and cost",
            "Coordinated hands-on testing and stakeholder alignment",
            "Provided executive decision support under uncertainty"
        ],
        impact: [
            "Databricks selected as the strategic platform",
            "Resulted in the firm winning multi-year cloud transformation work",
            "Delivered 3,000+ hours of platform training",
            "Completed infrastructure and environment setup",
            "Achieved security approvals with IT and InfoSec",
            "Successfully onboarded the platform to production"
        ],
        techStack: ["Snowflake", "Databricks", "Teradata", "Machine Learning"],
        links: {}
    },
    {
        id: "data-governance",
        code: "DL-06",
        title: "Liquidity Reporting Data Controls Assessment",
        type: "professional",
        categories: ["Governance & Compliance"],
        iconKey: "Governance",
        heroImage: "/images/project6.png",
        galleryImages: ["/images/project6.png"],
        shortDescription: "Data controls assessment for regulatory liquidity reporting",
        overview: "Major U.S. financial institutions are required to maintain highly reliable liquidity reporting under regulatory scrutiny. The engagement focused on assessing data controls supporting liquidity reporting, including completeness, accuracy, and change detection.",
        problem: [
            "Liquidity reporting is among the most scrutinized regulatory reporting domains",
            "Errors in liquidity data can lead to regulatory findings, capital restrictions, or loss of supervisory confidence",
            "Need to assess whether controls could detect and prevent data issues",
            "Required evaluation of 200+ critical data elements"
        ],
        solution: "Performed comprehensive assessment of data controls supporting liquidity reporting. Reviewed data sourcing, transformation logic, control design, and control effectiveness. Evaluated gaps in detection and prevention controls.",
        keyCapabilities: [
            "Reviewed 200+ critical data fields",
            "Assessed data sourcing and lineage",
            "Evaluated transformation logic and control points",
            "Identified where breakdowns could occur",
            "Assessed whether controls were preventative, detective, or merely compensating"
        ],
        governance: [
            "Traced data from source to report",
            "Evaluated severity and likelihood of potential failures",
            "Prepared documentation suitable for regulatory review",
            "Clearly articulated residual risk for leadership"
        ],
        approach: [
            "Performed current-state assessment",
            "Documented data flows and control points",
            "Identified failure modes and control weaknesses",
            "Proposed improvements aligned to regulatory expectations"
        ],
        impact: [
            "Delivered defensible documentation for leadership and regulators",
            "Improved clarity on data lineage and control ownership",
            "Reduced regulatory and operational risk",
            "Strengthened control frameworks supporting regulatory reporting",
            "Improved transparency into liquidity data risks"
        ],
        techStack: ["Data Controls", "Regulatory Reporting", "SQL", "Compliance"],
        links: {}
    },
    {
        id: "aml-framework",
        code: "DL-07",
        title: "AML Framework & Model Assessment",
        type: "professional",
        categories: ["Governance & Compliance"],
        iconKey: "Audit",
        heroImage: "/images/project7.png",
        galleryImages: ["/images/project7.png"],
        shortDescription: "Independent AML framework assessment for major crypto institution",
        overview: "A large crypto institution engaged an independent assessment of its AML framework and transaction monitoring systems amid increasing regulatory scrutiny on digital asset platforms. The work directly supported executive and regulatory-facing decisions, where gaps or misstatements could result in enforcement actions, remediation mandates, or operational restrictions.",
        problem: [
            "Leadership needed to understand whether existing AML systems were fit for purpose",
            "Required assessment of whether transaction monitoring models were conceptually sound",
            "Need to verify whether controls were operating as intended under real-world conditions",
            "Core question: Can this institution defend its AML posture to regulators with evidence, not assumptions?"
        ],
        solution: "Applied independent challenge and critical assessment, focusing on framework-level evaluation, model assumption examination, and independent test case execution to validate whether models would trigger when expected or miss material risk scenarios.",
        keyCapabilities: [
            "Reviewed end-to-end AML architecture (data ingestion → monitoring → escalation)",
            "Assessed alignment between business risk profile and control coverage",
            "Examined model assumptions and rule logic",
            "Evaluated whether scenarios aligned with known crypto-specific risks",
            "Designed and executed independent test cases to validate model effectiveness"
        ],
        governance: [
            "Applied skepticism and independent judgment",
            "Compared expected vs actual outcomes in model testing",
            "Identified gaps between theoretical design and operational reality",
            "All findings written with assumption that reports could be read by regulators"
        ],
        approach: [
            "Framework-level assessment of AML architecture",
            "Model evaluation of assumptions and rule logic",
            "Independent test case design and execution",
            "Authored formal audit-style assessment reports"
        ],
        impact: [
            "Enabled leadership to make informed decisions on AML investment and remediation",
            "Strengthened the defensibility of AML controls",
            "Reduced regulatory exposure through early identification of weaknesses",
            "Delivered executive-ready summaries for Chief Compliance Officer",
            "Produced documentation suitable for regulatory examination"
        ],
        techStack: ["AML", "Compliance", "Model Validation", "Regulatory"],
        links: {}
    },
    {
        id: "internal-audit",
        code: "DL-08",
        title: "AML / BSA / OFAC Controls Assessment",
        type: "professional",
        categories: ["Governance & Compliance"],
        iconKey: "Investigation",
        heroImage: "/images/project8.png",
        galleryImages: ["/images/project8.png"],
        shortDescription: "AML, BSA, and OFAC controls assessment across multiple financial institutions",
        overview: "Served as a co-sourced internal auditor embedded within financial institutions' audit functions to assess the design and operating effectiveness of AML, BSA, and OFAC controls supporting regulatory compliance. The work supported management assurance and regulatory readiness, requiring a balance of independence and professional skepticism, deep understanding of AML regulatory expectations, and clear, defensible communication with audit leadership and business stakeholders.",
        problem: [
            "Financial institutions must demonstrate that their AML programs are not only documented, but operating effectively in practice",
            "Controls needed evaluation across customer due diligence, transaction monitoring, sanctions screening, and escalation processes",
            "Core question: Are AML / BSA / OFAC controls designed appropriately, operating as intended, and defensible under regulatory review?"
        ],
        solution: "Conducted end-to-end evaluation of AML program components including Suspicious Activity Reporting (SARs), Enhanced Due Diligence (EDD), transaction monitoring alerts, case reviews & investigations, and PEP & sanctions screening (OFAC). Applied independent challenge through substantive testing and control evaluation.",
        keyCapabilities: [
            "Evaluated Suspicious Activity Reporting (SARs): case escalation logic, timeliness and completeness of filings, alignment between alerts, investigations, and SAR decisions",
            "Assessed Enhanced Due Diligence (EDD): risk-based customer segmentation, documentation sufficiency, ongoing review and refresh controls",
            "Reviewed Transaction Monitoring Alerts: alert generation and triage processes, case prioritization and analyst workflows, coverage relative to customer and product risk",
            "Evaluated Case Reviews & Investigations: consistency of investigative procedures, evidence retention and decision rationale, quality of analyst judgment",
            "Assessed PEP & Sanctions Screening (OFAC): screening logic and match resolution, escalation and disposition controls, governance over false positives and true matches"
        ],
        governance: [
            "Built AML-focused Risk & Control Matrices (RCMs)",
            "Mapped regulatory requirements to specific control activities",
            "Reviewed case files, alert histories, investigation narratives, and supporting documentation",
            "Challenged management assertions where evidence was incomplete or control execution did not align with documented procedures",
            "All reporting written with explicit assumption that audit workpapers and conclusions may be reviewed by regulators or external examiners"
        ],
        approach: [
            "Applied independent challenge through substantive testing",
            "Designed test cases to assess control design effectiveness (is the control sufficient?) and control operating effectiveness (is it executed consistently?)",
            "Documented findings in audit-ready language",
            "Communicated findings to Chief Audit Executives (CAEs), AML compliance leadership, and business stakeholders"
        ],
        impact: [
            "Strengthened AML, BSA, and OFAC control environments",
            "Improved clarity around control ownership and accountability",
            "Enabled management to remediate control gaps before regulatory escalation",
            "Increased defensibility of AML programs under supervisory scrutiny",
            "Delivered written outputs that support governance, audit, and regulatory confidence"
        ],
        techStack: ["AML", "BSA", "OFAC", "Internal Audit", "Risk Management"],
        links: {}
    },
    {
        id: "liquidity-controls",
        code: "DL-09",
        title: "Liquidity Data Controls & Regulatory Reporting",
        type: "professional",
        categories: ["Governance & Compliance"],
        iconKey: "Compliance",
        heroImage: "/images/project9.png",
        galleryImages: ["/images/project9.png"],
        shortDescription: "Data controls assessment for liquidity regulatory reporting",
        overview: "Liquidity reporting is among the most scrutinized regulatory reporting domains in financial services. Errors in liquidity data can lead to regulatory findings, capital restrictions, or loss of supervisory confidence. This engagement focused on assessing data controls supporting liquidity reporting, including accuracy, completeness, and change management.",
        problem: [
            "Liquidity reporting errors can lead to regulatory findings and capital restrictions",
            "Need to assess data controls across 200+ critical data elements",
            "Required evaluation of whether controls could detect and prevent data issues",
            "Need to assess severity and likelihood of potential failures"
        ],
        solution: "Performed comprehensive assessment of data controls supporting liquidity reporting. Traced data from source to report, identified where breakdowns could occur, and evaluated whether controls were preventative, detective, or merely compensating.",
        keyCapabilities: [
            "Reviewed 200+ critical data elements used in liquidity reporting",
            "Assessed data sourcing and lineage",
            "Evaluated transformation logic and control points across data lifecycle",
            "Traced data from source to report to identify potential breakdown points",
            "Assessed severity and likelihood of potential failures"
        ],
        governance: [
            "Evaluated whether controls were preventative, detective, or merely compensating",
            "Assessed control effectiveness beyond documented controls at face value",
            "Prepared documentation to standard suitable for regulatory review and supervisory examination",
            "Clearly articulated residual risk for leadership"
        ],
        approach: [
            "Current-state assessment documentation",
            "Identification of control gaps and weaknesses",
            "Proposed enhancements to improve detection and prevention",
            "Traced data lineage from source to final report"
        ],
        impact: [
            "Improved transparency into liquidity data risks",
            "Strengthened control frameworks supporting regulatory reporting",
            "Reduced the risk of inaccurate or unsupported liquidity submissions",
            "Delivered defensible documentation for regulatory review",
            "Enhanced clarity on data lineage and control ownership"
        ],
        techStack: ["Regulatory Reporting", "Data Controls", "Liquidity", "SQL", "Compliance"],
        links: {}
    },

    // PERSONAL PROJECTS (1 entry)
    {
        id: "ai-portfolio",
        code: "P-01",
        title: "BSA/AML & OFAC Auditor Agent",
        type: "project",
        categories: ["AI & ML"],
        iconKey: "Neural",
        heroImage: "/images/project10.png",
        galleryImages: ["/images/project10.png"],
        shortDescription: "RAG-based AI system for assessing analyst review quality using structured and unstructured data",
        overview: "Built an AI-powered system that combines Retrieval-Augmented Generation (RAG) and Large Language Models (LLMs) to assess the quality of analyst dispositions on transaction monitoring alerts. The system integrates structured data (analyst reviews, alert details, case outcomes) with unstructured data (business policies, procedures, semantic context) to answer complex business questions about analyst decision-making quality and consistency.",
        problem: [
            "Analyst disposition quality is difficult to assess at scale across thousands of alerts",
            "Business policies and procedures are scattered across unstructured documents",
            "No systematic way to evaluate whether analyst decisions align with documented policies",
            "Manual quality reviews are time-consuming and inconsistent",
            "Difficult to identify patterns in analyst behavior or systemic quality issues"
        ],
        solution: "Designed and implemented a RAG-based AI system that ingests structured analyst review data and unstructured policy documents, creates semantic embeddings, and uses LLMs to answer business questions about disposition quality, policy alignment, and decision consistency.",
        keyCapabilities: [
            "Structured Data Integration: Ingested analyst reviews, alert metadata, and case outcomes from transaction monitoring systems",
            "Unstructured Data Processing: Parsed and embedded business policies, procedures, and regulatory guidance documents",
            "Semantic Search: Built vector database with embeddings for efficient retrieval of relevant policy context",
            "RAG Pipeline: Combined retrieved policy context with structured alert data to provide LLM with comprehensive context",
            "Quality Assessment: LLM evaluates analyst dispositions against policies and identifies gaps or inconsistencies"
        ],
        architectureComponents: [
            "Data Sources: Transaction monitoring system (structured), policy documents (unstructured)",
            "Embedding Model: Text embeddings for semantic search across policies and procedures",
            "Vector Database: Stored embeddings for efficient similarity search",
            "LLM: Google Gemini for natural language understanding and quality assessment",
            "RAG Framework: Orchestrated retrieval and generation pipeline"
        ],
        approach: [
            "Ingested structured analyst review data (alert ID, analyst decision, rationale, outcome)",
            "Processed unstructured policy documents and created semantic embeddings",
            "Built RAG pipeline to retrieve relevant policy context for each analyst decision",
            "Used LLM to evaluate disposition quality by comparing analyst rationale against retrieved policies",
            "Generated insights on policy alignment, decision consistency, and quality patterns"
        ],
        impact: [
            "Enabled automated quality assessment of analyst dispositions at scale",
            "Identified policy gaps and areas where analyst decisions diverged from documented procedures",
            "Reduced manual quality review time by providing AI-assisted assessments",
            "Improved analyst training by highlighting common decision-making gaps",
            "Demonstrated practical application of RAG for combining structured and unstructured data in compliance use cases"
        ],
        techStack: ["Python", "Google Gemini", "RAG", "Vector Embeddings", "LangChain", "Semantic Search"],
        links: {}
    },

    // PURPOSE/PHILANTHROPY WORK (1 entry)
    {
        id: "youth-mentorship",
        code: "PH-01",
        title: "School Finance & Mission Sustainability",
        type: "purpose",
        categories: ["Strategy", "Impact"],
        iconKey: "Community",
        heroImage: "/images/purpose1.png",
        galleryImages: ["/images/purpose1.png"],
        shortDescription: "Strategic advisor to Cambodia Hope Foundation supporting 500+ students",
        overview: "Served as a Strategic Advisor to the founders of the Cambodia Hope Foundation, supporting long-term financial sustainability and strategic direction for a mission-driven education organization. The foundation provides affordable, values-based education to 500+ students and employs 40 faculty and staff, operating in a resource-constrained environment where financial decisions directly affect access, quality, and continuity of education.",
        problem: [
            "Mission sustainability risk: As the organization scaled, there was a growing risk that financial pressures could dilute or unintentionally shift the founder-led mission",
            "Affordability constraints: Maintaining low-cost access to education required careful tradeoffs between operating expenses, staffing, and program expansion",
            "Founder dependency: Strategic decision-making was heavily centered on founders, creating risk as the organization matured",
            "Limited financial structure: Financial planning needed to balance day-to-day operations with long-term sustainability without adopting corporate-first incentives misaligned with the mission"
        ],
        baselineKPIs: [
            "Student population: 500+",
            "Faculty & staff: 40",
            "Cost sensitivity: High",
            "Margin for error: Low",
            "Mission alignment risk: Increasing with scale"
        ],
        solution: "Acted as a strategic thought partner to the founders, focusing on school finance and cost structure evaluation, long-term strategic direction, governance and decision-making discipline, and ensuring the founder mission remained central as the organization scaled.",
        keyCapabilities: [
            "Worked directly with founders to clarify non-negotiable mission principles",
            "Evaluated financial decisions through a mission-first lens, not pure growth optimization",
            "Advised on tradeoffs between tuition affordability, faculty compensation and retention, and infrastructure and program investments",
            "Introduced structured thinking around cost sustainability, scenario-based planning, and long-term impact vs short-term pressure"
        ],
        governance: [
            "School Finance: Assessed affordability thresholds to ensure continued access for students, evaluated operating costs to avoid mission drift",
            "Strategic Direction: Supported founders in translating mission values into operational decisions, helped prioritize initiatives that reinforced educational quality",
            "Mission Continuity: Ensured growth decisions did not undermine founding principles, reinforced alignment between leadership intent and on-the-ground execution"
        ],
        approach: [
            "Applied strategic and financial thinking in high-constraint environments",
            "Advised founders without imposing misaligned corporate frameworks",
            "Balanced sustainability, affordability, and human impact",
            "Operated as a trusted advisor where decisions affect real lives, not abstract metrics"
        ],
        impact: [
            "500+ students continue to receive affordable, mission-driven education",
            "40 faculty and staff benefit from sustainable, values-aligned organizational direction",
            "Improved clarity and confidence in long-term decision-making",
            "Reduced risk of mission dilution as the organization evolves"
        ],
        techStack: ["Strategic Planning", "Finance", "Nonprofit Management", "Governance"],
        links: {}
    }
];

export const categories = [
    "ALL",
    "Strategy",
    "Data",
    "Governance & Compliance",
    "AI & ML",
    "Impact"
];
