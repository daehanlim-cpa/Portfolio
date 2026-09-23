"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/data/site";

const COLUMNS = [
    {
        title: "Site",
        links: [
            { href: "/work", label: "Work" },
            { href: "/writing", label: "Writing" },
            { href: "/resume", label: "Resume" },
            { href: "/ask", label: "Ask AI" },
        ],
    },
    {
        title: "Elsewhere",
        links: [
            { href: profile.linkedin, label: "LinkedIn" },
            { href: `mailto:${profile.email}`, label: "Email" },
        ],
    },
];

export default function SiteFooter() {
    // /ask is a full-height app view; a footer under it would only be reachable
    // by scrolling past the composer.
    if (usePathname() === "/ask") return null;

    return (
        <footer className="border-t border-line-soft px-6 pb-12 pt-16 sm:px-10">
            <div className="mx-auto grid max-w-content gap-12 sm:grid-cols-[1fr_auto_auto] sm:gap-20">
                <div>
                    <p className="text-body-lg font-semibold tracking-[-0.02em] text-ink">{profile.name}</p>
                    <p className="mt-2 max-w-xs text-caption text-ink-tertiary">
                        {profile.role} at {profile.employer}. {profile.location}.
                    </p>
                </div>
                {COLUMNS.map((column) => (
                    <nav key={column.title} aria-label={column.title}>
                        <p className="mb-4 text-label uppercase text-ink-quaternary">{column.title}</p>
                        <ul className="space-y-2.5">
                            {column.links.map(({ href, label }) => {
                                const external = href.startsWith("http");
                                return (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                            className="text-caption text-ink-secondary transition-colors hover:text-ink"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                ))}
            </div>
            <div className="mx-auto mt-16 flex max-w-content flex-col justify-between gap-2 border-t border-line-soft pt-6 text-label text-ink-quaternary sm:flex-row">
                <span>© {new Date().getFullYear()} {profile.name}</span>
                <span>Built with Next.js. The assistant answers from his resume and case studies only.</span>
            </div>
        </footer>
    );
}
