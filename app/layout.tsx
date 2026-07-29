import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CategoryNav from "@/components/CategoryNav";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
    metadataBase: new URL("https://daehanlim.com"),
    title: {
        default: "Daehan Lim | Data & AI Engineering",
        template: "%s | Daehan Lim"
    },
    description: "Senior Forward Deployed Engineer at Deloitte specializing in GenAI platforms, agentic workflows, and enterprise data architecture. Building production AI and data systems for Fortune 500 clients.",
    keywords: ["Forward Deployed Engineer", "GenAI", "Agentic AI", "Data Engineering", "AI", "Snowflake", "dbt", "Databricks", "Azure", "Cloud Architecture", "Enterprise Analytics"],
    authors: [{ name: "Daehan Lim" }],
    creator: "Daehan Lim",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://daehanlim.com",
        siteName: "Daehan Lim Portfolio",
        title: "Daehan Lim | Data & AI Engineering",
        description: "Senior Forward Deployed Engineer at Deloitte specializing in GenAI platforms, agentic workflows, and enterprise data architecture.",
        images: [
            {
                url: "/images/og-image.png",
                width: 1200,
                height: 630,
                alt: "Daehan Lim Portfolio"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Daehan Lim | Data & AI Engineering",
        description: "Senior Forward Deployed Engineer at Deloitte specializing in GenAI platforms, agentic workflows, and enterprise data architecture.",
        images: ["/images/og-image.png"]
    },
    robots: {
        index: true,
        follow: true
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png"
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <CategoryNav />
                {children}
            </body>
        </html>
    );
}
