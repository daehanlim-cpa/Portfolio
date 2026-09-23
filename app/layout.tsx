import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { themeScript } from "@/components/site/ThemeToggle";
import { profile } from "@/data/site";

// Exposed as a CSS variable so globals.css and the Tailwind font stack can both
// reference it. Weights 200-600: the display sizes need the lighter cuts, and
// 600 exists only for the rare emphasis that 500 can't carry.
const inter = Inter({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600"],
    variable: "--font-inter",
    display: "swap",
});

// Display-only serif. It carries the editorial voice in headlines; Inter does
// everything else, so the two never compete in the same line of body text.
const serif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
    variable: "--font-serif",
    display: "swap",
});

const description =
    "Senior Forward Deployed Engineer at Deloitte and CPA. Builds production GenAI platforms, agentic workflows and governed data systems for regulated financial institutions.";

export const metadata: Metadata = {
    metadataBase: new URL(profile.site),
    title: {
        default: "Daehan Lim | Forward Deployed Engineer, AI & Data",
        template: "%s | Daehan Lim",
    },
    description,
    keywords: [
        "Forward Deployed Engineer",
        "GenAI",
        "Agentic AI",
        "Data Engineering",
        "Snowflake",
        "dbt",
        "Databricks",
        "AML",
        "Regulatory Reporting",
        "CPA",
    ],
    authors: [{ name: profile.name, url: profile.site }],
    creator: profile.name,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: profile.site,
        siteName: profile.name,
        title: "Daehan Lim | Forward Deployed Engineer, AI & Data",
        description,
    },
    twitter: {
        card: "summary_large_image",
        title: "Daehan Lim | Forward Deployed Engineer, AI & Data",
        description,
    },
    robots: { index: true, follow: true },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fdfdfc" },
        { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
    ],
};

/** Structured data, so search engines can attach the profile to the name. */
const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    worksFor: { "@type": "Organization", name: profile.employer },
    url: profile.site,
    sameAs: [profile.linkedin],
    hasCredential: "Certified Public Accountant",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // The theme script sets data-theme before hydration, which React would
        // otherwise report as a mismatch on this one element.
        <html lang="en" className={`${inter.variable} ${serif.variable}`} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
                />
            </head>
            <body className="flex min-h-dvh flex-col bg-surface font-sans antialiased">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-caption focus:text-on-ink"
                >
                    Skip to content
                </a>
                <SiteNav />
                <main id="main" className="flex-1">
                    {children}
                </main>
                <SiteFooter />
            </body>
        </html>
    );
}
