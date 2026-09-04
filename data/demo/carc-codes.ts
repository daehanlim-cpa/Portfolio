/**
 * Claim Adjustment Reason Codes and Remittance Advice Remark Codes.
 *
 * The code numbers and their short descriptions come from the X12 standard code
 * lists, which are public. Everything else on each row — category, preventable,
 * owning department, `typicalOverturnRate` — is a synthetic risk model written
 * for this demo. A real revenue-cycle team would derive those from its own
 * historical appeal outcomes by payer, and they would differ.
 *
 * `typicalOverturnRate` is the single most load-bearing invented number here, so
 * it is surfaced in the UI as a stated assumption rather than presented as fact.
 */

export type DenialCategory =
    | "Eligibility"
    | "Authorization"
    | "Coding"
    | "Medical necessity"
    | "Timely filing"
    | "Documentation"
    | "Coordination of benefits"
    | "Contractual";

export interface CarcCode {
    code: string;
    description: string;
    category: DenialCategory;
    /** Whether a front-end process change could have stopped this denial. */
    preventable: boolean;
    /** Where the fix belongs, if it is preventable. */
    owner: string;
    /** Synthetic. Share of appeals on this code that succeed. */
    typicalOverturnRate: number;
    /** Set where an appeal is not the right remedy at all. */
    appealable: boolean;
}

export const carcCodes: CarcCode[] = [
    { code: "CO-4", description: "Procedure code inconsistent with the modifier used, or a required modifier is missing", category: "Coding", preventable: true, owner: "Coding", typicalOverturnRate: 0.72, appealable: true },
    { code: "CO-11", description: "The diagnosis is inconsistent with the procedure", category: "Coding", preventable: true, owner: "Coding", typicalOverturnRate: 0.64, appealable: true },
    { code: "CO-15", description: "The authorization number is missing, invalid, or does not apply to the billed services", category: "Authorization", preventable: true, owner: "Pre-service / scheduling", typicalOverturnRate: 0.48, appealable: true },
    { code: "CO-16", description: "Claim/service lacks information or has submission/billing error(s)", category: "Documentation", preventable: true, owner: "Billing", typicalOverturnRate: 0.81, appealable: true },
    { code: "CO-18", description: "Exact duplicate claim/service", category: "Documentation", preventable: true, owner: "Billing", typicalOverturnRate: 0.15, appealable: false },
    { code: "CO-22", description: "This care may be covered by another payer per coordination of benefits", category: "Coordination of benefits", preventable: true, owner: "Registration", typicalOverturnRate: 0.69, appealable: true },
    { code: "CO-27", description: "Expenses incurred after coverage terminated", category: "Eligibility", preventable: true, owner: "Registration", typicalOverturnRate: 0.22, appealable: true },
    { code: "CO-29", description: "The time limit for filing has expired", category: "Timely filing", preventable: true, owner: "Billing", typicalOverturnRate: 0.31, appealable: true },
    { code: "CO-45", description: "Charge exceeds fee schedule/maximum allowable or contracted arrangement", category: "Contractual", preventable: false, owner: "Contracting", typicalOverturnRate: 0.04, appealable: false },
    { code: "CO-50", description: "These are non-covered services because this is not deemed a medical necessity by the payer", category: "Medical necessity", preventable: false, owner: "Clinical documentation", typicalOverturnRate: 0.53, appealable: true },
    { code: "CO-96", description: "Non-covered charge(s)", category: "Eligibility", preventable: false, owner: "Registration", typicalOverturnRate: 0.27, appealable: true },
    { code: "CO-97", description: "The benefit for this service is included in the payment for another service already adjudicated", category: "Coding", preventable: true, owner: "Coding", typicalOverturnRate: 0.58, appealable: true },
    { code: "CO-109", description: "Claim not covered by this payer/contractor", category: "Eligibility", preventable: true, owner: "Registration", typicalOverturnRate: 0.44, appealable: true },
    { code: "CO-140", description: "Patient/insured health identification number and name do not match", category: "Eligibility", preventable: true, owner: "Registration", typicalOverturnRate: 0.88, appealable: true },
    { code: "CO-151", description: "Payment adjusted because the payer deems the information submitted does not support this many services", category: "Medical necessity", preventable: false, owner: "Clinical documentation", typicalOverturnRate: 0.46, appealable: true },
    { code: "CO-167", description: "This diagnosis is not covered", category: "Medical necessity", preventable: false, owner: "Clinical documentation", typicalOverturnRate: 0.35, appealable: true },
    { code: "CO-197", description: "Precertification/authorization/notification/pre-treatment absent", category: "Authorization", preventable: true, owner: "Pre-service / scheduling", typicalOverturnRate: 0.41, appealable: true },
    { code: "CO-198", description: "Precertification/notification/authorization exceeded", category: "Authorization", preventable: true, owner: "Utilization management", typicalOverturnRate: 0.37, appealable: true },
    { code: "PR-1", description: "Deductible amount", category: "Contractual", preventable: false, owner: "Patient financial services", typicalOverturnRate: 0.02, appealable: false },
    { code: "PR-204", description: "This service is not covered under the patient's current benefit plan", category: "Eligibility", preventable: true, owner: "Registration", typicalOverturnRate: 0.19, appealable: true },
];

export interface RarcCode {
    code: string;
    description: string;
}

export const rarcCodes: RarcCode[] = [
    { code: "M51", description: "Missing/incomplete/invalid procedure code(s)" },
    { code: "MA04", description: "Secondary payment cannot be considered without the identity of or payment information from the primary payer" },
    { code: "MA130", description: "Your claim contains incomplete and/or invalid information; no appeal rights are afforded" },
    { code: "N30", description: "Patient ineligible for this service" },
    { code: "N56", description: "Procedure code billed is not correct for the services billed or the date of service billed" },
    { code: "N115", description: "This decision was based on a Local Coverage Determination (LCD)" },
    { code: "N265", description: "Missing/incomplete/invalid ordering provider primary identifier" },
    { code: "N290", description: "Missing/incomplete/invalid rendering provider primary identifier" },
    { code: "N657", description: "This should be billed with the appropriate code for these services" },
];

export function findCarc(code: string): CarcCode | undefined {
    return carcCodes.find((c) => c.code.toUpperCase() === code.toUpperCase());
}

export function findRarc(code: string): RarcCode | undefined {
    return rarcCodes.find((c) => c.code.toUpperCase() === code.toUpperCase());
}
