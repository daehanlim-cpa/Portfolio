import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** The nav mark — an aperture "D" on an ink tile. */
export default function Icon() {
    return new ImageResponse(
        (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1d1d1f", borderRadius: 16 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M8.5 6.5h4.25a5.25 5.25 0 0 1 0 10.5H8.5V6.5Z" stroke="#ffffff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        ),
        size
    );
}
