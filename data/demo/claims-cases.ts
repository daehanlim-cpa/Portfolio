/**
 * Synthetic claim denials.
 *
 * No real patient data. Every name, member ID, claim number and date of service
 * is invented, and the clinical detail is written at the level a remittance
 * advice would actually carry — enough to reason about, nowhere near a record.
 *
 * As with the AML cases, the four are chosen so the correct answers differ: one
 * clean win, one that is not appealable at all and should be routed to process
 * improvement instead, one that turns on documentation, and one where the
 * economics say write it off.
 */

export interface ClaimsCase {
    id: string;
    label: string;
    summary: string;
    claim: {
        claimNumber: string;
        payer: string;
        planType: string;
        /** Synthetic member reference. Not a real identifier format. */
        memberRef: string;
        dateOfService: string;
        dateReceived: string;
        dateDenied: string;
        placeOfService: string;
        billedAmount: number;
        allowedAmount: number;
        cptCodes: { code: string; description: string; modifiers?: string[] }[];
        diagnosisCodes: { code: string; description: string }[];
        renderingProvider: string;
        priorAuthNumber?: string;
    };
    denial: {
        carc: string;
        rarc?: string;
        payerRemark: string;
    };
    /** Free-text context a biller would have from the chart or the payer portal. */
    context: string[];
}

export const claimsCases: ClaimsCase[] = [
    {
        id: "missing-modifier",
        label: "Modifier missing on a bilateral procedure",
        summary: "$3,180 denied because a required modifier never made it onto the claim.",
        claim: {
            claimNumber: "CLM-2025-0041782",
            payer: "Cascade Health Plan",
            planType: "Commercial PPO",
            memberRef: "SYN-MBR-44821",
            dateOfService: "2025-04-08",
            dateReceived: "2025-04-15",
            dateDenied: "2025-04-29",
            placeOfService: "22 — On-campus outpatient hospital",
            billedAmount: 3180,
            allowedAmount: 0,
            cptCodes: [{ code: "64483", description: "Injection, anesthetic/steroid, transforaminal epidural, lumbar or sacral, single level" }],
            diagnosisCodes: [{ code: "M54.16", description: "Radiculopathy, lumbar region" }],
            renderingProvider: "Dr. A. Whitfield, Pain Medicine",
        },
        denial: {
            carc: "CO-4",
            rarc: "M51",
            payerRemark: "Procedure code inconsistent with modifier used or required modifier missing.",
        },
        context: [
            "Operative note documents bilateral injections at L4-L5.",
            "Claim was submitted with a single line, no modifier 50 and no LT/RT designation.",
            "Payer policy CP-114 requires modifier 50 for bilateral transforaminal injections.",
            "Corrected-claim window for this payer is 180 days from the date of service.",
        ],
    },
    {
        id: "no-prior-auth",
        label: "Prior authorization absent for an advanced imaging study",
        summary: "$2,450 denied for no auth — but the order predates the auth requirement.",
        claim: {
            claimNumber: "CLM-2025-0038119",
            payer: "Meridian Mutual",
            planType: "Commercial HMO",
            memberRef: "SYN-MBR-90117",
            dateOfService: "2025-03-19",
            dateReceived: "2025-03-24",
            dateDenied: "2025-04-06",
            placeOfService: "11 — Office",
            billedAmount: 2450,
            allowedAmount: 0,
            cptCodes: [{ code: "70553", description: "MRI brain without and with contrast" }],
            diagnosisCodes: [
                { code: "G43.109", description: "Migraine with aura, not intractable, without status migrainosus" },
                { code: "R51.9", description: "Headache, unspecified" },
            ],
            renderingProvider: "Northside Imaging Center",
        },
        denial: {
            carc: "CO-197",
            payerRemark: "Precertification/authorization absent for the service billed.",
        },
        context: [
            "Order was placed 2025-02-24, before the payer added CPT 70553 to its auth list effective 2025-03-01.",
            "Payer bulletin 2025-04 states orders placed prior to the effective date are exempt.",
            "No auth number was obtained; scheduling staff checked the auth list on the date of service, not the date of order.",
            "Appeal deadline is 90 days from the denial date.",
        ],
    },
    {
        id: "timely-filing",
        label: "Timely filing expired on a secondary claim",
        summary: "$860 denied for late filing after the primary payer sat on it.",
        claim: {
            claimNumber: "CLM-2025-0029640",
            payer: "Statewide Care Alliance",
            planType: "Medicaid MCO (secondary)",
            memberRef: "SYN-MBR-13355",
            dateOfService: "2024-11-02",
            dateReceived: "2025-05-21",
            dateDenied: "2025-05-30",
            placeOfService: "11 — Office",
            billedAmount: 860,
            allowedAmount: 0,
            cptCodes: [{ code: "99214", description: "Office visit, established patient, moderate complexity" }],
            diagnosisCodes: [{ code: "E11.9", description: "Type 2 diabetes mellitus without complications" }],
            renderingProvider: "Dr. P. Ramachandran, Internal Medicine",
        },
        denial: {
            carc: "CO-29",
            rarc: "MA04",
            payerRemark: "The time limit for filing has expired.",
        },
        context: [
            "Primary payer remittance is dated 2025-05-14 — 193 days after the date of service.",
            "Secondary filing limit is 180 days from the date of service, with no stated COB exception in the provider manual.",
            "Clearinghouse record shows the claim was held pending the primary EOB, not misrouted.",
            "Similar denials on this payer have been overturned when the primary EOB date is documented.",
        ],
    },
    {
        id: "contractual-writeoff",
        label: "Charge exceeds the contracted rate",
        summary: "$1,020 adjustment on a contractual allowable — not a denial to appeal.",
        claim: {
            claimNumber: "CLM-2025-0044907",
            payer: "Cascade Health Plan",
            planType: "Commercial PPO",
            memberRef: "SYN-MBR-77204",
            dateOfService: "2025-05-12",
            dateReceived: "2025-05-16",
            dateDenied: "2025-05-27",
            placeOfService: "11 — Office",
            billedAmount: 2400,
            allowedAmount: 1380,
            cptCodes: [{ code: "29881", description: "Arthroscopy, knee, surgical, with meniscectomy" }],
            diagnosisCodes: [{ code: "M23.221", description: "Derangement of posterior horn of medial meniscus" }],
            renderingProvider: "Dr. L. Okonkwo, Orthopedic Surgery",
            priorAuthNumber: "AUTH-8841903",
        },
        denial: {
            carc: "CO-45",
            payerRemark: "Charge exceeds fee schedule/maximum allowable or contracted arrangement.",
        },
        context: [
            "Contracted rate for 29881 under the 2025 fee schedule is $1,380.",
            "Payer paid $1,380 in full; the $1,020 difference is the contractual adjustment.",
            "Prior authorization was obtained and is on file.",
            "The charge master rate for this code has not been updated since 2022.",
        ],
    },
];
