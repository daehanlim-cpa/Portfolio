/**
 * A synthetic sanctions list.
 *
 * Every name here is invented. This is deliberately NOT a copy of the real OFAC
 * SDN list: shipping a stale copy of a list that changes weekly would be worse
 * than useless, and a demo that appears to screen against real sanctions data
 * invites someone to treat its output as a real screening result.
 *
 * The names are shaped like real list entries — aliases, transliteration
 * variants, corporate suffixes — because those are exactly what makes fuzzy
 * matching hard, and demonstrating that difficulty is the point.
 */

export interface WatchlistEntry {
    id: string;
    name: string;
    aliases: string[];
    type: "individual" | "entity" | "vessel";
    program: string;
    jurisdiction: string;
    /** Individuals only. Used to break a name-only match. */
    dateOfBirth?: string;
}

export const WATCHLIST_SOURCE = "Synthetic list — fictional entries, not OFAC data";

export const watchlist: WatchlistEntry[] = [
    {
        id: "SYN-0001",
        name: "Volkoff Maritime Holding LLC",
        aliases: ["Volkoff Maritime", "VMH Group"],
        type: "entity",
        program: "SYN-SHIPPING",
        jurisdiction: "Cyprus",
    },
    {
        id: "SYN-0002",
        name: "Aurelian Petrochemical PJSC",
        aliases: ["Aurelian Petchem", "APC Holdings"],
        type: "entity",
        program: "SYN-ENERGY",
        jurisdiction: "United Arab Emirates",
    },
    {
        id: "SYN-0003",
        name: "Dmitri Karsanov",
        aliases: ["Dimitri Karsanov", "D. Karsanov", "Karsanov, Dmitriy"],
        type: "individual",
        program: "SYN-PEP",
        jurisdiction: "Kazakhstan",
        dateOfBirth: "1968-04-11",
    },
    {
        id: "SYN-0004",
        name: "Meridian Trade Financing Ltd",
        aliases: ["Meridian Trade Finance", "MTF Ltd"],
        type: "entity",
        program: "SYN-TRADE",
        jurisdiction: "Seychelles",
    },
    {
        id: "SYN-0005",
        name: "Ana Sofia Reyes-Bustamante",
        aliases: ["Ana S. Reyes", "Sofia Bustamante"],
        type: "individual",
        program: "SYN-NARCO",
        jurisdiction: "Panama",
        dateOfBirth: "1981-09-30",
    },
    {
        id: "SYN-0006",
        name: "Northern Star Logistics OOO",
        aliases: ["Northern Star Logistics", "NS Logistics"],
        type: "entity",
        program: "SYN-SHIPPING",
        jurisdiction: "Belarus",
    },
    {
        id: "SYN-0007",
        name: "MV Silver Kestrel",
        aliases: ["Silver Kestrel"],
        type: "vessel",
        program: "SYN-SHIPPING",
        jurisdiction: "Liberia",
    },
    {
        id: "SYN-0008",
        name: "Halcyon Bay Investments SA",
        aliases: ["Halcyon Bay", "HBI SA"],
        type: "entity",
        program: "SYN-CORRUPT",
        jurisdiction: "Switzerland",
    },
    {
        id: "SYN-0009",
        name: "Ibrahim Al-Mansouri",
        aliases: ["Ibraheem Al Mansouri", "I. Almansouri"],
        type: "individual",
        program: "SYN-TERROR",
        jurisdiction: "Lebanon",
        dateOfBirth: "1975-01-22",
    },
    {
        id: "SYN-0010",
        name: "Blackthorn Metals Trading GmbH",
        aliases: ["Blackthorn Metals", "BMT GmbH"],
        type: "entity",
        program: "SYN-TRADE",
        jurisdiction: "Austria",
    },
];

/**
 * Jurisdictions that raise a geographic risk signal. Again synthetic — a real
 * programme would drive this from FATF lists plus its own risk assessment.
 */
export const HIGH_RISK_JURISDICTIONS = new Set([
    "Seychelles",
    "Panama",
    "Belarus",
    "Cyprus",
    "Marshall Islands",
    "Belize",
]);
