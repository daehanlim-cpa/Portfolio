import AiIndex from "@/components/AiIndex";
import { aiApps } from "@/data/ai-apps";

/*
 * Server shell, client body. The grid wants framer-motion and therefore "use
 * client", but a client page cannot export metadata — which is why /experience
 * has none. Splitting the two keeps the animation and the title.
 */
export const metadata = {
    title: "AI applications",
    description:
        "Two live proof-of-concept AI applications: AML alert triage with SAR drafting, and claim denial triage with appeal drafting.",
};

export default function AiPage() {
    return <AiIndex apps={aiApps} />;
}
