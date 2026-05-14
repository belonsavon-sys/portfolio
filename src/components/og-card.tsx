 
import { ImageResponse } from "next/og";

export const OG_SIZE = { height: 630, width: 1200 } as const;
export const OG_CONTENT_TYPE = "image/png";

export type OgCardProps = {
  /** Mono eyebrow above the headline — e.g. "/ai · what I build". */
  eyebrow: string;
  /** Display headline — the route's hero statement. */
  headline: string;
  /** Supporting prose below the headline. */
  description: string;
  /** Footer mono pills, left to right. */
  footer: string[];
};

/**
 * Shared OG card renderer used by per-route opengraph-image.tsx
 * files. Keeps the visual brand consistent across routes while
 * letting each route own its eyebrow / headline / description.
 */
export function renderOgCard({
  description,
  eyebrow,
  footer,
  headline,
}: OgCardProps) {
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

        {/* TOP — mono eyebrow + signature */}
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
              fontFamily: "monospace",
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
        </div>

        {/* MIDDLE — headline + supporting prose */}
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
            {headline}
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
            {description}
          </p>
        </div>

        {/* BOTTOM — mono pill rail */}
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
          {footer.map((label, index) => (
            <span key={label} style={{ display: "flex", gap: 24 }}>
              {index > 0 ? <span style={{ color: "#296ed6" }}>·</span> : null}
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
