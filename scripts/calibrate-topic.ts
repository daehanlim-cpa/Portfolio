/**
 * Prints per-question retrieval scores for the topic-gate probes against the
 * committed index. `npm run build:embeddings` already stores thresholds; use
 * this to inspect them, or after editing lib/topic-probes.ts.
 *
 * Usage: npm run calibrate:topic
 */
import { loadIndex } from "../lib/embeddings";
import { embed } from "../lib/llm";
import { EMBEDDING_MODEL } from "../lib/models";
import { TOPIC_PROBES, calibrate } from "../lib/topic-probes";

async function main() {
    const index = loadIndex();
    if (index.model !== EMBEDDING_MODEL) {
        console.error(`Index was built with ${index.model}, but ${EMBEDDING_MODEL} is configured. Run npm run build:embeddings.`);
        process.exit(1);
    }

    const vectors = await embed(TOPIC_PROBES.map(([, q]) => q), "query");
    const { scores, bands, thresholds } = calibrate(vectors, index.chunks);

    for (const { label, score, question } of scores) {
        console.log(`${label.padEnd(10)} ${score.toFixed(3)}  ${question}`);
    }
    console.log("\nBands:");
    for (const [label, band] of Object.entries(bands)) {
        console.log(`  ${label.padEnd(10)} ${band.min.toFixed(3)} – ${band.max.toFixed(3)}`);
    }
    console.log(`\nMeasured: confident ≥ ${thresholds.confident}, floor ${thresholds.floor}`);
    console.log(`Stored:   ${JSON.stringify(index.thresholds ?? "none")}`);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
