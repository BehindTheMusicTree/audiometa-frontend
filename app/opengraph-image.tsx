import { ImageResponse } from "next/og";

export const alt = "Audiometa — audio metadata manager";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0f172a 0%, #1e293b 45%, #0f172a 100%)",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          Audiometa
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 28,
            fontWeight: 500,
            color: "#fbbf24",
          }}
        >
          Audio metadata manager
        </div>
      </div>
    ),
    { ...size },
  );
}
