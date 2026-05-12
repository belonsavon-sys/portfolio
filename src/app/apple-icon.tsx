import { ImageResponse } from "next/og";

export const size = { height: 180, width: 180 };
export const contentType = "image/png";
export const runtime = "edge";

/**
 * Apple touch icon — 180x180 PNG that iOS uses for "Add to Home
 * Screen". Same brand mark as the favicon (icon.tsx) but at the
 * iOS-required size + a slightly bolder treatment so it reads
 * well as a tappable tile.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, #1a4e9c 0%, #296ed6 60%, #5b9bf4 100%)",
          borderRadius: 36,
          boxShadow: "inset 0 -8px 24px rgba(15,23,42,0.25)",
          color: "#ffffff",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 124,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.06em",
          width: "100%",
        }}
      >
        P
      </div>
    ),
    { ...size },
  );
}
