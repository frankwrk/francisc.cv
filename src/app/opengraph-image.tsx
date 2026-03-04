import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0c0c0d",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          fontFamily: "monospace",
          position: "relative",
          // Blueprint grid
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        {/* Outer border frame */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />
        {/* Corner marks */}
        <div style={{ position: "absolute", top: "20px", left: "20px", width: "12px", height: "12px", borderTop: "2px solid rgba(255,255,255,0.2)", borderLeft: "2px solid rgba(255,255,255,0.2)", display: "flex" }} />
        <div style={{ position: "absolute", top: "20px", right: "20px", width: "12px", height: "12px", borderTop: "2px solid rgba(255,255,255,0.2)", borderRight: "2px solid rgba(255,255,255,0.2)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: "20px", left: "20px", width: "12px", height: "12px", borderBottom: "2px solid rgba(255,255,255,0.2)", borderLeft: "2px solid rgba(255,255,255,0.2)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: "20px", right: "20px", width: "12px", height: "12px", borderBottom: "2px solid rgba(255,255,255,0.2)", borderRight: "2px solid rgba(255,255,255,0.2)", display: "flex" }} />

        {/* Top label */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "11px",
              letterSpacing: "0.22em",
              fontFamily: "monospace",
            }}
          >
            FRANCISC.CV
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: "72px",
              fontWeight: "600",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            francisc.cv
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "22px",
              lineHeight: 1.5,
              maxWidth: "760px",
            }}
          >
            Portfolio and systems-thinking artifact by Francisc Furdui.
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: "20px" }}>
            {["PRODUCT", "SYSTEMS", "DESIGN"].map((tag) => (
              <span
                key={tag}
                style={{
                  color: "rgba(255,255,255,0.18)",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  fontFamily: "monospace",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "4px 10px",
                  display: "flex",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.15)",
              fontSize: "10px",
              letterSpacing: "0.12em",
              fontFamily: "monospace",
            }}
          >
            francisc.cv
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
