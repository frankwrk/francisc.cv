import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: "#07090D",
          color: "#F1F5F9",
          border: "1px solid #202735",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              fontSize: 18,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#9AA3B5",
            }}
          >
            francisc.cv
          </div>
          <div style={{ height: 1, flex: 1, background: "#202735" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 62,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {siteConfig.name}
          </h1>
          <p style={{ margin: 0, fontSize: 30, color: "#AAB2C2", maxWidth: "90%" }}>{siteConfig.description}</p>
        </div>

        <div style={{ fontSize: 22, color: "#79A8FF" }}>Projects · Writing · Resume</div>
      </div>
    ),
    {
      ...size,
    },
  );
}
