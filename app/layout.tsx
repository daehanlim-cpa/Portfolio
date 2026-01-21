import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CategoryNav from "@/components/CategoryNav";
import MusicPlayer from "@/components/MusicPlayer";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
    metadataBase: new URL("https://daehanlim.com"),
    title: {
        default: "Daehan Lim | Data & AI Engineering",
        template: "%s | Daehan Lim"
    },
    description: "Senior Manager at Ernst & Young specializing in Data Architecture, Cloud Engineering, and AI Solutions. Building enterprise-scale data platforms for Fortune 500 clients.",
    keywords: ["Data Engineering", "AI", "Snowflake", "dbt", "Azure", "Cloud Architecture", "Enterprise Analytics"],
    authors: [{ name: "Daehan Lim" }],
    creator: "Daehan Lim",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://daehanlim.com",
        siteName: "Daehan Lim Portfolio",
        title: "Daehan Lim | Data & AI Engineering",
        description: "Senior Manager at Ernst & Young specializing in Data Architecture, Cloud Engineering, and AI Solutions.",
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
        description: "Senior Manager at Ernst & Young specializing in Data Architecture, Cloud Engineering, and AI Solutions.",
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
                <MusicPlayer />
            </body>
        </html>
    );
}
