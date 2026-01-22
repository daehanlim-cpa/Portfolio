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
        categories: ["Data Architecture & Engineering"],
        iconKey: "Liquidity",
        heroImage: "/images/project1.png",
        galleryImages: ["/images/project1.png"],
        shortDescription: "Automated liquidity reporting for large government pension fund",
        overview: "A large government pension fund relied on manual, Excel-based workflows to produce critical investment and operational reports. These processes were time-consuming, error-prone, and limited leadership visibility due to delayed data availability. The initiative focused on modernizing reporting through automated data ingestion, SQL-based transformations, and orchestrated pipelines to improve reliability, reduce operational risk, and enable faster decision-making.",
        problem: [
            "Manual execution: Weekly Excel workflows required significant analyst effort and manual validation.",
            "Limited cadence: Reports ran once per week, with data unavailable until T+2.",
            "High rework risk: Errors were common and required manual fixes, increasing operational friction.",
            "Key-person dependency: Reporting execution relied on a single analyst, creating continuity risk.",
            "No controlled environments: Lack of DEV/TEST/PROD separation led to data silos and inconsistent outputs."
        ],
        baselineKPIs: [
            "Reporting cadence: Weekly",
            "Analyst effort: ~6 hours per run (1 FTE)",
            "Data latency: T+2",
            "Error handling: Manual fixes after reports were produced",
            "Visibility: Limited ability to detect issues early"
        ],
        solution: "Designed and implemented an automated, production-grade reporting platform with governance, monitoring, and scalability built in.",
        keyCapabilities: [
            "Automated ingestion from 8 source systems (30–40 files)",
            "SQL-driven transformations using dbt",
            "Orchestrated pipelines with retry logic and dependency management",
            "Controlled DEV / STG / PROD environments with CI/CD approvals",
            "Centralized semantic layer powering leadership dashboards",
            "Data quality checks and early-warning detection before reports are consumed"
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
            "Structured data ingestion pipelines",
            "SQL transformations with dbt",
            "Orchestrated workflows in cloud environment"
        ],
        impact: [
            "Reporting effort reduced from 6 hours → ~1 hour per run (~5 analyst hours saved weekly)",
            "Reporting cadence improved from weekly → daily (Data available T+1 by 8:00 AM PT)",
            "Eliminated key-person dependency through automation",
            "Daily pipelines run with ~90% on-time SLA",
            "Errors detected before leadership consumption, not after"
        ],
        techStack: ["Azure", "Snowflake", "dbt", "Prefect", "Power BI", "GitHub"],
        links: {}
    },
    {
        id: "cloud-modernization",
        code: "DL-02",
        title: "Enterprise Analytics Factory",
        type: "professional",
        categories: ["Data Architecture & Engineering"],
        iconKey: "Database",
        heroImage: "/images/project2.png",
        galleryImages: ["/images/project2.png"],
        shortDescription: "Scaling a Snowflake consumption layer for enterprise analytics",
        overview: "A top-tier U.S. regional financial institution executed a multi-year Data Factory initiative to modernize enterprise analytics and standardize how data is consumed across the organization. The Snowflake Hydration Pod served as the centralized execution team responsible for delivering approved enterprise data elements into Snowflake.",
        problem: [
            "Enterprise data elements were identified by multiple upstream teams, but no centralized execution owner existed to move them into production analytics platforms",
            "Snowflake consumption assets were delivered inconsistently and at risk of backlog as demand increased",
            "High coordination overhead across teams slowed time-to-availability for analytics consumers",
            "Production delivery required tight release management across domains and environments"
        ],
        solution: "Led the Snowflake Hydration Pod, the centralized execution team responsible for delivering approved enterprise data elements into Snowflake. Implemented automated data validation using Gherkinator to ensure production quality.",
        keyCapabilities: [
            "Established a repeatable intake, mapping, build, test, and release process for all analytics-ready data",
            "Automated data quality testing using Gherkinator framework",
            "Served as the primary interface between engineering teams, product owners, and senior stakeholders",
            "Managed formal RFC and approval processes for production releases"
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
            "CI/CD: GitLab with automated deployment pipelines",
            "Testing: Gherkinator for data validation",
            "Project Management: JIRA for intake and tracking"
        ],
        governance: [
            "Formal RFC and approval processes for all production releases",
            "Repeatable intake, mapping, build, test, and release workflow",
            "Cross-domain coordination with engineering and product teams",
            "Tier-1 and federated domain ownership with clear accountability"
        ],
        baselineKPIs: [
            "Delivery Backlog: High & Accumulating",
            "Production Reliability: Inconsistent",
            "Release Cycle: Ad-hoc / Slow",
            "Data Trust: Low due to lack of automated testing"
        ],
        approach: [
            "Centralized execution ownership for enterprise data elements",
            "Global team management across time zones",
            "Standardized intake-to-production workflow",
            "Formal release management with RFC approvals"
        ],
        impact: [
            "Eliminated delivery bottlenecks, clearing 435+ requests with zero backlog",
            "Guaranteed 100% availability for 265 Tier-1 critical reporting assets",
            "Democratized data access by delivering 338+ consumption views across the enterprise",
            "Ensured production capability with 28 net-new data pipelines deployed",
            "Set the organizational standard for high-velocity data engineering execution"
        ],
        techStack: ["Snowflake", "GitLab CI/CD", "Gherkinator", "JIRA"],
        links: {}
    },
    {
        id: "certification-center",
        code: "DL-03",
        title: "EY Certification Center",
        type: "professional",
        categories: ["Data Architecture & Engineering", "AI & ML"],
        iconKey: "Community",
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
        title: "Teradata to Cloud Migration",
        type: "professional",
        categories: ["Data Architecture & Engineering"],
        iconKey: "Migration",
        heroImage: "/images/project4.png",
        galleryImages: ["/images/project4.png"],
        shortDescription: "Legacy system modernization for regulatory reporting",
        problem: [
            "Legacy Teradata limiting agility",
            "High maintenance costs",
            "Scalability constraints"
        ],
        approach: [
            "Ingestion design and validation",
            "Data quality testing framework",
            "Downstream analytics readiness"
        ],
        impact: [
            "Successful cloud migration",
            "Maintained data integrity",
            "Enhanced reporting capabilities"
        ],
        techStack: ["Teradata", "Cloud", "Data Quality", "SQL"],
        links: {}
    },
    {
        id: "regulatory-reporting",
        code: "DL-05",
        title: "Regulatory Reporting Models",
        type: "professional",
        categories: ["Data Governance"],
        iconKey: "Regulatory",
        heroImage: "/images/project5.png",
        galleryImages: ["/images/project5.png"],
        shortDescription: "FR-Y14, NSFR, HQLA reporting for top-5 financial institution",
        problem: [
            "Complex regulatory requirements",
            "Data model inconsistencies",
            "Manual reporting processes"
        ],
        approach: [
            "Designed standardized data models",
            "Aligned with regulatory frameworks",
            "Automated reporting workflows"
        ],
        impact: [
            "Accurate supervisory compliance",
            "Supported risk oversight",
            "Foundation for ongoing reporting"
        ],
        techStack: ["Data Modeling", "Regulatory", "Compliance"],
        links: {}
    },
    {
        id: "data-governance",
        code: "DL-06",
        title: "Global Data Governance",
        type: "professional",
        categories: ["Data Governance"],
        iconKey: "Governance",
        heroImage: "/images/project6.png",
        galleryImages: ["/images/project6.png"],
        shortDescription: "Governance framework for 12-person global team",
        problem: [
            "Inconsistent data practices",
            "Limited auditability",
            "Operational inefficiencies"
        ],
        approach: [
            "Established governance standards",
            "Implemented operational controls",
            "Created auditability frameworks"
        ],
        impact: [
            "Improved reporting reliability",
            "Clear governance standards",
            "Enhanced operational controls"
        ],
        techStack: ["AWS", "Snowflake", "Power BI", "Governance"],
        links: {}
    },

    // PERSONAL PROJECTS (New 5)
    {
        id: "ai-portfolio",
        code: "P-01",
        title: "AI-Powered Portfolio",
        type: "project",
        categories: ["AI & ML"],
        iconKey: "Neural",
        heroImage: "/images/project7.png",
        galleryImages: ["/images/project7.png"],
        shortDescription: "Personal portfolio with RAG-based resume chat",
        problem: [
            "Static portfolios lack interactivity",
            "Recruiters need quick answers",
            "Traditional resumes are one-dimensional"
        ],
        approach: [
            "Built with Next.js and TypeScript",
            "Implemented RAG with Google Gemini",
            "Yeezy-inspired minimal design"
        ],
        impact: [
            "Interactive resume exploration",
            "Instant answers to recruiter questions",
            "Modern, memorable presentation"
        ],
        techStack: ["Next.js", "TypeScript", "Gemini AI", "Framer Motion"],
        links: {
            repo: "https://github.com/daehanlim-cpa/portfolio"
        }
    },
    {
        id: "blockchain-explorer",
        code: "P-02",
        title: "Blockchain Analytics",
        type: "project",
        categories: ["AI & ML"],
        iconKey: "Blockchain",
        heroImage: "/images/project8.png",
        galleryImages: ["/images/project8.png"],
        shortDescription: "Real-time blockchain transaction analyzer",
        problem: [
            "Blockchain data is complex and opaque",
            "Difficult to track transaction patterns",
            "Limited visualization tools"
        ],
        approach: [
            "Real-time data ingestion from blockchain nodes",
            "Pattern recognition algorithms",
            "Interactive visualization dashboard"
        ],
        impact: [
            "Clear transaction flow visibility",
            "Anomaly detection capabilities",
            "User-friendly blockchain insights"
        ],
        techStack: ["Python", "Web3.py", "React", "D3.js"],
        links: {}
    },
    {
        id: "mobile-fintech",
        code: "P-03",
        title: "Personal Finance Tracker",
        type: "project",
        categories: ["Data Architecture & Engineering"],
        iconKey: "App",
        heroImage: "/images/project9.png",
        galleryImages: ["/images/project9.png"],
        shortDescription: "Mobile app for expense tracking and budgeting",
        problem: [
            "Existing apps are too complex",
            "Privacy concerns with cloud storage",
            "Lack of customization"
        ],
        approach: [
            "Local-first data architecture",
            "Intuitive gesture-based UI",
            "Customizable budget categories"
        ],
        impact: [
            "Simple, privacy-focused tracking",
            "Improved spending awareness",
            "Flexible budget management"
        ],
        techStack: ["React Native", "SQLite", "TypeScript"],
        links: {}
    },
    {
        id: "api-gateway",
        code: "P-04",
        title: "Microservices API Gateway",
        type: "project",
        categories: ["Data Architecture & Engineering"],
        iconKey: "API",
        heroImage: "/images/project10.png",
        galleryImages: ["/images/project10.png"],
        shortDescription: "Scalable API gateway with rate limiting and auth",
        problem: [
            "Microservices need unified entry point",
            "Rate limiting and auth scattered across services",
            "Monitoring and logging inconsistent"
        ],
        approach: [
            "Built centralized gateway with Kong",
            "Implemented JWT authentication",
            "Unified logging and metrics"
        ],
        impact: [
            "Simplified service access",
            "Consistent security policies",
            "Centralized monitoring"
        ],
        techStack: ["Kong", "Docker", "Redis", "Prometheus"],
        links: {}
    },
    {
        id: "ml-pipeline",
        code: "P-05",
        title: "AutoML Pipeline",
        type: "project",
        categories: ["AI & ML"],
        iconKey: "Code",
        heroImage: "/images/project11.png",
        galleryImages: ["/images/project11.png"],
        shortDescription: "Automated machine learning pipeline for model training",
        problem: [
            "Manual ML workflows are time-consuming",
            "Hyperparameter tuning is tedious",
            "Model versioning is complex"
        ],
        approach: [
            "Automated feature engineering",
            "Hyperparameter optimization with Optuna",
            "MLflow for experiment tracking"
        ],
        impact: [
            "10x faster model iteration",
            "Reproducible experiments",
            "Simplified deployment"
        ],
        techStack: ["Python", "PyTorch", "MLflow", "Optuna"],
        links: {}
    },
    {
        id: "data-dashboard",
        code: "P-06",
        title: "Real-Time Analytics Dashboard",
        type: "project",
        categories: ["Data Architecture & Engineering"],
        iconKey: "Chart",
        heroImage: "/images/project12.png",
        galleryImages: ["/images/project12.png"],
        shortDescription: "Interactive dashboard for real-time business metrics",
        problem: [
            "Business metrics scattered across multiple tools",
            "No real-time visibility into KPIs",
            "Static reports lack interactivity"
        ],
        approach: [
            "Built streaming data pipeline",
            "Created interactive visualizations with D3.js",
            "Implemented WebSocket for real-time updates"
        ],
        impact: [
            "Real-time business insights",
            "Reduced reporting time by 80%",
            "Improved decision-making speed"
        ],
        techStack: ["React", "D3.js", "WebSocket", "PostgreSQL"],
        links: {}
    },

    // PURPOSE/PHILANTHROPY WORK (2 entries)
    {
        id: "youth-mentorship",
        code: "PH-01",
        title: "Youth Tech Mentorship",
        type: "purpose",
        categories: ["AI & ML"],
        iconKey: "Community",
        heroImage: "/images/purpose1.png",
        galleryImages: ["/images/purpose1.png"],
        shortDescription: "Teaching coding and data science to underserved youth",
        problem: [
            "Limited tech education access in underserved communities",
            "Lack of diverse role models in STEM",
            "Skills gap preventing career opportunities"
        ],
        approach: [
            "Volunteer instructor at local coding bootcamp",
            "Developed beginner-friendly Python curriculum",
            "1-on-1 mentorship for aspiring data scientists"
        ],
        impact: [
            "Mentored 20+ students over 2 years",
            "5 students secured tech internships",
            "Increased diversity in local tech pipeline"
        ],
        techStack: ["Python", "Jupyter", "Teaching"],
        links: {}
    },
    {
        id: "nonprofit-data",
        code: "PH-02",
        title: "Pro Bono Data Analytics",
        type: "purpose",
        categories: ["Data Architecture & Engineering"],
        iconKey: "Heart",
        heroImage: "/images/purpose2.png",
        galleryImages: ["/images/purpose2.png"],
        shortDescription: "Free data infrastructure for nonprofit organizations",
        problem: [
            "Nonprofits lack resources for data systems",
            "Manual processes limiting impact measurement",
            "Difficulty demonstrating outcomes to donors"
        ],
        approach: [
            "Built donation tracking dashboard",
            "Automated impact reporting workflows",
            "Trained staff on data-driven decision making"
        ],
        impact: [
            "Helped 3 nonprofits optimize operations",
            "Increased donor retention by 25%",
            "Enabled data-driven program improvements"
        ],
        techStack: ["SQL", "Power BI", "Excel", "Automation"],
        links: {}
    }
];

export const categories = [
    "ALL",
    "Data Architecture & Engineering",
    "Data Governance",
    "AI & ML"
];
