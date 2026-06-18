import { ImageResponse } from "next/og";

export const alt = "G-Stack Digital Agency - Client Portal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0B1221 0%, #1a2744 50%, #2563EB 100%)",
        position: "relative",
        fontFamily: '"Inter", "Noto Sans", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #2563EB, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            fontWeight: 700,
            color: "white",
          }}
        >
          G
        </div>
        <span
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          G-Stack
        </span>
      </div>
      <span
        style={{
          fontSize: "28px",
          color: "#93c5fd",
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
        }}
      >
        Agency Client Portal
      </span>
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          display: "flex",
          gap: "24px",
        }}
      >
        {["Projects", "Files", "Invoices", "Messages"].map((label) => (
          <div
            key={label}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.1)",
              fontSize: "16px",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
