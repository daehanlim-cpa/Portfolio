import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Replaces /apple-touch-icon.png, which was referenced but never existed. */
export default function AppleIcon() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1d1d1f" }}>
                <svg width="104" height="104" viewBox="0 0 24 24" fill="none">
                    <path d="M8.5 6.5h4.25a5.25 5.25 0 0 1 0 10.5H8.5V6.5Z" stroke="#ffffff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        ),
        size
    );
}
