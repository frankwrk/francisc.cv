import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const { meta } = await getProjectBySlug(slug);

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
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        data-oid="kdagvo0"
      >
        {/* Frame */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
          }}
          data-oid="avc0h:g"
        />

        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            width: "12px",
            height: "12px",
            borderTop: "2px solid rgba(255,255,255,0.2)",
            borderLeft: "2px solid rgba(255,255,255,0.2)",
            display: "flex",
          }}
          data-oid="e5p9p4p"
        />

        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "12px",
            height: "12px",
            borderTop: "2px solid rgba(255,255,255,0.2)",
            borderRight: "2px solid rgba(255,255,255,0.2)",
            display: "flex",
          }}
          data-oid="a:yn3b7"
        />

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            width: "12px",
            height: "12px",
            borderBottom: "2px solid rgba(255,255,255,0.2)",
            borderLeft: "2px solid rgba(255,255,255,0.2)",
            display: "flex",
          }}
          data-oid="2sbd9q-"
        />

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "12px",
            height: "12px",
            borderBottom: "2px solid rgba(255,255,255,0.2)",
            borderRight: "2px solid rgba(255,255,255,0.2)",
            display: "flex",
          }}
          data-oid="r-_d:i6"
        />

        {/* Breadcrumb */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
          data-oid="ng2tk4k"
        >
          <span
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "11px",
              letterSpacing: "0.22em",
            }}
            data-oid="3vin4n."
          >
            FRANCISC.CV
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.15)",
              fontSize: "11px",
              letterSpacing: "0.1em",
            }}
            data-oid="b6vqhon"
          >
            /
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "11px",
              letterSpacing: "0.22em",
            }}
            data-oid="_:jrhm4"
          >
            WORK
          </span>
        </div>

        {/* Title + description */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          data-oid="w4dlkt0"
        >
          {meta.role && (
            <span
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "12px",
                letterSpacing: "0.2em",
                fontFamily: "monospace",
              }}
              data-oid="u78cj9q"
            >
              {meta.role.toUpperCase()}
            </span>
          )}
          <div
            style={{
              color: "#ffffff",
              fontSize: meta.title.length > 40 ? "44px" : "56px",
              fontWeight: "600",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
            }}
            data-oid="w5.gt17"
          >
            {meta.title}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "20px",
              lineHeight: 1.5,
              maxWidth: "860px",
            }}
            data-oid="9xm1nxg"
          >
            {meta.description}
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
          data-oid="o78w00h"
        >
          <div style={{ display: "flex", gap: "8px" }} data-oid="_rg1k0a">
            {(meta.tags ?? []).slice(0, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  color: "rgba(255,255,255,0.2)",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  border: "1px solid rgba(255,255,255,0.08)",
                  padding: "4px 10px",
                  display: "flex",
                }}
                data-oid="wnog4ge"
              >
                {tag.toUpperCase()}
              </span>
            ))}
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.15)",
              fontSize: "10px",
              letterSpacing: "0.12em",
            }}
            data-oid="aaqvfbl"
          >
            francisc.cv
          </span>
        </div>
      </div>
    ),

    { ...size },
  );
}
