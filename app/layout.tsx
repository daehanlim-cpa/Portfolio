import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CategoryNav from "@/components/CategoryNav";
import MusicPlayer from "@/components/MusicPlayer";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
    title: "Daehan Lim",
    description: "Data & AI Engineering Portfolio",
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
