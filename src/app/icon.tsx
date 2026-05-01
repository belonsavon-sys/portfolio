import { ImageResponse } from "next/og";

export const size = { height: 32, width: 32 };
export const contentType = "image/png";
export const runtime = "edge";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#296ed6",
          borderRadius: 8,
          color: "#ffffff",
          display: "flex",
          fontFamily: "monospace",
          fontSize: 18,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.05em",
          width: "100%",
        }}
      >
        P
      </div>
    ),
    { ...size },
  );
}
