export const Icons = {
    // PROFESSIONAL ICONS (First 6)
    // Liquidity/Reporting - Abstract bar graph/flow
    Liquidity: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20H20" stroke="currentColor" strokeWidth="1.5" />
            <rect x="6" y="12" width="3" height="4" fill="currentColor" />
            <rect x="10.5" y="8" width="3" height="8" fill="currentColor" />
            <rect x="15" y="4" width="3" height="12" fill="currentColor" />
        </svg>
    ),

    // Cloud Modernization - Geometric Cloud
    Cloud: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 16H4V13M7 16H17M7 16V13M17 16H20V13M17 16V10M17 10H14V7H10V10H7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
    ),

    // Operational Data Store - Stacked Layers
    Database: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="14" height="4" stroke="currentColor" strokeWidth="1.5" />
            <rect x="5" y="10" width="14" height="4" stroke="currentColor" strokeWidth="1.5" />
            <rect x="5" y="15" width="14" height="4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),

    // Migration - Abstract Arrow/Transition
    Migration: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            <rect x="4" y="4" width="6" height="16" stroke="currentColor" strokeWidth="1.5" fill="white" className="group-hover:fill-transparent transition-colors" />
        </svg>
    ),

    // Regulatory - Structured/Compliance Document
    Regulatory: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="4" width="14" height="16" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 9H15" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 13H15" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 17H12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),

    // Governance - Shield/Lock abstract
    Governance: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),

    // Strategy - Compass/Decision making
    Strategy: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 3V5M12 19V21M21 12H19M5 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            <path d="M12 8L14 12L12 16L10 12L12 8Z" fill="currentColor" />
        </svg>
    ),

    // Audit - Checklist/Inspection
    Audit: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="3" width="12" height="18" rx="1" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 8L11 10L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M9 18H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),

    // Compliance - Document with seal/stamp
    Compliance: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="4" width="14" height="16" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="15" cy="15" r="4" stroke="currentColor" strokeWidth="1.5" fill="white" />
            <path d="M13 15L14.5 16.5L17 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 9H12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),

    // Investigation - Magnifying glass for forensic/investigative work
    Investigation: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14.5 14.5L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 10H12M10 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),

    // PROJECT ICONS (6 total)
    // Code/Terminal - For coding projects
    Code: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8L4 12L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            <path d="M16 8L20 12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            <path d="M14 6L10 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
    ),

    // Neural Network - For AI/ML projects
    Neural: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 12L16 6M8 12L16 18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),

    // Mobile/App - For mobile/web apps
    App: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 6H18" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 18H18" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="19.5" r="0.5" fill="currentColor" />
        </svg>
    ),

    // API/Network - For backend/API projects
    API: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7L10.5 10.5M16 7L13.5 10.5M8 17L10.5 13.5M16 17L13.5 13.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),

    // Blockchain/Crypto - For blockchain projects
    Blockchain: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
            <rect x="14" y="4" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
            <rect x="4" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
            <rect x="14" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 7H14M7 10V14M17 10V14M10 17H14" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),

    // Data Visualization - For analytics/dashboard projects
    Chart: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="17" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8.5 15.5L10.5 11.5M13.5 8.5L15.5 8.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 20H20" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),

    // Education - For learning/certification projects
    Education: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M2 16L12 21L22 16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    ),

    // PURPOSE/PHILANTHROPY ICONS (2 total)
    // Heart - For charitable/giving projects
    Heart: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C12 21 3 15 3 9C3 6.5 4.5 4 7 4C9 4 11 5 12 7C13 5 15 4 17 4C19.5 4 21 6.5 21 9C21 15 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    ),

    // Community - For community service/education
    Community: () => (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="15" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 18C5 15 7 13 9 13C11 13 13 15 13 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M11 18C11 15 13 13 15 13C17 13 19 15 19 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
};
