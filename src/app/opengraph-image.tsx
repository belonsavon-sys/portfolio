import { ImageResponse } from "next/og";

export const alt = "Pierre Belon Savon — AI Engineer";
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";
export const runtime = "edge";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-start",
          background:
            "linear-gradient(135deg, #0a0e1a 0%, #111827 60%, #1a4e9c 100%)",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          fontFamily: "sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 80px",
          position: "relative",
          width: "100%",
        }}
      >
        {/* Decorative blur orb */}
        <div
          style={{
            background:
              "radial-gradient(closest-side, rgba(91,155,244,0.45), rgba(41,110,214,0))",
            borderRadius: "50%",
            display: "flex",
            height: 720,
            left: -160,
            position: "absolute",
            top: -160,
            width: 720,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              color: "#5b9bf4",
              display: "flex",
              fontFamily: "monospace",
              fontSize: 22,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            Pierre Belon Savon
          </span>
          <span
            style={{
              color: "#94a3b8",
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            AI Engineer · Trilingual · Ocean Shores, WA
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <h1
            style={{
              color: "#f8fafc",
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              margin: 0,
              maxWidth: 980,
            }}
          >
            I build AI that ships.
          </h1>
          <p
            style={{
              color: "#94a3b8",
              display: "flex",
              fontSize: 30,
              lineHeight: 1.4,
              margin: 0,
              maxWidth: 940,
            }}
          >
            The hotel I was hired to supervise now runs on AI systems I built.
            Co-architect of Atlas at Blackdoor.
          </p>
        </div>

        <div
          style={{
            alignItems: "center",
            color: "#5b9bf4",
            display: "flex",
            fontFamily: "monospace",
            fontSize: 22,
            gap: 24,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>belonsavon-sys</span>
          <span style={{ color: "#296ed6" }}>·</span>
          <span>Atlas · Blackdoor</span>
          <span style={{ color: "#296ed6" }}>·</span>
          <span>EN · ES · IT</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
