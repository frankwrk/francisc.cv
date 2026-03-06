import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const { meta } = await getArticleBySlug(slug);

  const formattedDate = meta.date
    ? new Date(meta.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

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
        data-oid="xh69dn0"
      >
        {/* Frame */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
          }}
          data-oid="b65hx07"
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
          data-oid="d9raou3"
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
          data-oid="a3ur9xc"
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
          data-oid="63-ds13"
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
          data-oid="_mbjje_"
        />

        {/* Breadcrumb */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
          data-oid="4hf::sb"
        >
          <span
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "11px",
              letterSpacing: "0.22em",
            }}
            data-oid="i:z056_"
          >
            FRANCISC.CV
          </span>
          <span
            style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px" }}
            data-oid="bnteayn"
          >
            /
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "11px",
              letterSpacing: "0.22em",
            }}
            data-oid="i_9z6se"
          >
            THINKING
          </span>
          {formattedDate && (
            <>
              <span
                style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px" }}
                data-oid="49.jj40"
              >
                /
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.2)",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                }}
                data-oid="zxjztzl"
              >
                {formattedDate.toUpperCase()}
              </span>
            </>
          )}
        </div>

        {/* Title + description */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          data-oid="_hy5eqp"
        >
          <div
            style={{
              color: "#ffffff",
              fontSize: meta.title.length > 40 ? "44px" : "56px",
              fontWeight: "600",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: "1000px",
            }}
            data-oid="uh9bjzf"
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
            data-oid="6u-ll0-"
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
          data-oid="frdum7s"
        >
          <div style={{ display: "flex", gap: "8px" }} data-oid="-r77m1m">
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
                data-oid="zoq4r0j"
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
            data-oid="l7th:e8"
          >
            francisc.cv
          </span>
        </div>
      </div>
    ),

    { ...size },
  );
}
