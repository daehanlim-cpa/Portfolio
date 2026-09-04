/**
 * Name screening.
 *
 * Deliberately deterministic. An embedding-similarity search would score better
 * on paper, but a screening decision has to be reproducible and explainable
 * years later in an examination — "the vector said 0.83" is not an answer an
 * examiner accepts, and the same query against a re-embedded corpus may not
 * return the same score at all. Jaro-Winkler plus token-set matching produces
 * the same number forever and can be recomputed by hand.
 */

/** Corporate suffixes carry no discriminating signal and wreck token overlap. */
const SUFFIXES = new Set([
    "llc", "ltd", "limited", "inc", "incorporated", "corp", "corporation", "co",
    "company", "gmbh", "sa", "sas", "ag", "nv", "bv", "plc", "pjsc", "jsc",
    "ooo", "oao", "pte", "pty", "holdings", "holding", "group", "intl",
    "international", "mv", "the", "and",
]);

export function normalizeName(input: string): string {
    return input
        .toLowerCase()
        .normalize("NFKD")
        // Strip diacritics so "Müller" and "Muller" collide, as they should.
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function tokenize(input: string): string[] {
    return normalizeName(input)
        .split(" ")
        .filter((token) => token.length > 0 && !SUFFIXES.has(token));
}

/** Jaro similarity. */
function jaro(a: string, b: string): number {
    if (a === b) return 1;
    if (!a.length || !b.length) return 0;

    const matchWindow = Math.max(0, Math.floor(Math.max(a.length, b.length) / 2) - 1);
    const aMatched = new Array<boolean>(a.length).fill(false);
    const bMatched = new Array<boolean>(b.length).fill(false);

    let matches = 0;
    for (let i = 0; i < a.length; i++) {
        const start = Math.max(0, i - matchWindow);
        const end = Math.min(i + matchWindow + 1, b.length);
        for (let j = start; j < end; j++) {
            if (bMatched[j] || a[i] !== b[j]) continue;
            aMatched[i] = true;
            bMatched[j] = true;
            matches++;
            break;
        }
    }

    if (matches === 0) return 0;

    let transpositions = 0;
    let k = 0;
    for (let i = 0; i < a.length; i++) {
        if (!aMatched[i]) continue;
        while (!bMatched[k]) k++;
        if (a[i] !== b[k]) transpositions++;
        k++;
    }

    const t = transpositions / 2;
    return (matches / a.length + matches / b.length + (matches - t) / matches) / 3;
}

/**
 * Jaro-Winkler. The prefix bonus matters here: sanctions evasion by
 * transliteration usually preserves the opening characters ("Volkoff" for
 * "Volkov"), which is exactly what the bonus rewards.
 */
export function jaroWinkler(a: string, b: string, prefixScale = 0.1): number {
    const base = jaro(a, b);
    if (base < 0.7) return base;

    let prefix = 0;
    const max = Math.min(4, a.length, b.length);
    while (prefix < max && a[prefix] === b[prefix]) prefix++;

    return base + prefix * prefixScale * (1 - base);
}

/**
 * Token-set similarity: best pairwise match per token, averaged over the shorter
 * side. Handles reordering ("Reyes-Bustamante, Ana" vs "Ana Sofia Reyes") and
 * dropped middle names, which straight string distance handles badly.
 */
export function tokenSetSimilarity(a: string, b: string): number {
    const aTokens = tokenize(a);
    const bTokens = tokenize(b);
    if (!aTokens.length || !bTokens.length) return 0;

    const [shorter, longer] = aTokens.length <= bTokens.length ? [aTokens, bTokens] : [bTokens, aTokens];

    let total = 0;
    for (const token of shorter) {
        let best = 0;
        for (const candidate of longer) {
            const score = jaroWinkler(token, candidate);
            if (score > best) best = score;
        }
        total += best;
    }

    return total / shorter.length;
}

/**
 * The blended score. Whole-string distance alone over-penalises word order;
 * token-set alone over-rewards a single shared common word. Weighting token-set
 * higher reflects that entity names are bags of words more than they are strings.
 */
export function nameSimilarity(a: string, b: string): number {
    const whole = jaroWinkler(normalizeName(a), normalizeName(b));
    const tokens = tokenSetSimilarity(a, b);
    return 0.35 * whole + 0.65 * tokens;
}
