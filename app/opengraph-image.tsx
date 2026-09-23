import { ImageResponse } from "next/og";

export const alt = "Daehan Lim — Production AI, built to pass the audit.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card. Replaces /images/og-image.png, which the metadata pointed
 * at but which never existed, so every shared link previewed blank.
 */
export default function OpenGraphImage() {
    const dot = (x: number, color = "#1d1d1f") => (
        <div style={{ position: "absolute", left: x, top: 471, width: 18, height: 18, borderRadius: 9, background: color }} />
    );

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px 80px",
                    background: "#fdfdfc",
                    color: "#1d1d1f",
                    fontFamily: "sans-serif",
                    position: "relative",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#6e6e73" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#1d1d1f", display: "flex" }} />
                    Daehan Lim, CPA
                </div>
                <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.02, letterSpacing: -3, fontWeight: 300 }}>
                    <span>Production AI,</span>
                    <span>built to pass the audit.</span>
                </div>
                <div style={{ display: "flex", fontSize: 26, color: "#6e6e73" }}>
                    Senior Forward Deployed Engineer · GenAI · Data platforms · Regulated finance
                </div>
                {/* A single rule with nodes along it: the hero pipeline, reduced. */}
                <div style={{ position: "absolute", left: 800, right: 80, top: 479, height: 2, background: "rgba(0,0,0,0.12)" }} />
                {dot(800, "#c7c7cc")}
                {dot(900, "#c7c7cc")}
                {dot(1000, "#d9480f")}
                {dot(1102)}
            </div>
        ),
        size
    );
}
