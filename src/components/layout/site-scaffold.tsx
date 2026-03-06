"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { siteScaffoldConfig } from "@/config/site-scaffold";
import { MachineModeController } from "@/components/machine/machine-mode-controller";
import { SiteNav } from "@/components/layout/site-nav";
import { cn } from "@/utils/cn";

type SiteScaffoldProps = {
  children: ReactNode;
  machineContent: ReactNode;
};

const ThemeToggle = dynamic(
  () =>
    import("@/components/theme/theme-toggle").then((mod) => mod.ThemeToggle),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-7 w-[96px] rounded-full border border-[var(--scaffold-line)]"
        aria-hidden
        data-oid="_np5p2q"
      />
    ),
  },
);

const sideRulerValues = (() => {
  const values: number[] = [];
  const { start, end, step } = siteScaffoldConfig.rulerSide;

  for (let value = start; value <= end; value += step) {
    values.push(value);
  }

  return values;
})();

type ScaffoldVars = CSSProperties & {
  "--scaffold-bg-light": string;
  "--scaffold-bg-dark": string;
  "--scaffold-surface-light": string;
  "--scaffold-surface-dark": string;
  "--scaffold-line-light": string;
  "--scaffold-line-dark": string;
  "--scaffold-ruler-light": string;
  "--scaffold-ruler-dark": string;
  "--scaffold-toggle-track-light": string;
  "--scaffold-toggle-track-dark": string;
  "--scaffold-toggle-thumb-light": string;
  "--scaffold-toggle-thumb-dark": string;
  "--scaffold-toggle-text-active-light": string;
  "--scaffold-toggle-text-active-dark": string;
  "--scaffold-toggle-text-inactive-light": string;
  "--scaffold-toggle-text-inactive-dark": string;
  "--scaffold-section-divider-width": string;
  "--machine-surface-bg-light": string;
  "--machine-surface-bg-dark": string;
};

function SideRuler({ align }: { align: "left" | "right" }) {
  const range =
    siteScaffoldConfig.rulerSide.end - siteScaffoldConfig.rulerSide.start;
  const unitPx = siteScaffoldConfig.rulerSide.unitPx;

  return (
    <aside
      aria-hidden
      className={cn(
        "hidden h-full select-none overflow-visible text-[10px] leading-none tracking-[0.22em] md:flex",
        align === "left" ? "justify-end" : "justify-start",
      )}
      style={{
        width: siteScaffoldConfig.sideRailWidth,
        color: "var(--scaffold-ruler)",
      }}
      data-oid="vw5k_ez"
    >
      <ul
        className="relative h-full w-full"
        style={{ marginTop: `-${siteScaffoldConfig.borderWidth}px` }}
        data-oid="69wpjcc"
      >
        {sideRulerValues.map((value) => {
          const relativeValue = value - siteScaffoldConfig.rulerSide.start;
          if (relativeValue === 0) {
            return null;
          }

          const positionPx = relativeValue * unitPx;
          const ratio = range === 0 ? 0 : relativeValue / range;
          const opacity = Math.max(0.2, 0.95 - ratio * 0.72);
          const tick = (
            <span className="opacity-70" data-oid="yxp-rhe">
              -
            </span>
          );

          return (
            <li
              key={`${align}-${value}`}
              className={cn(
                "absolute flex items-center gap-1.5 font-mono [font-family:var(--font-geist-pixel-square)]",
                align === "left"
                  ? "right-0 justify-end"
                  : "left-0 justify-start",
              )}
              style={{
                top: `${positionPx}px`,
                opacity,
              }}
              data-oid="shelg9n"
            >
              {align === "left" ? (
                <>
                  <span data-oid="us12oyu">{String(value)}</span>
                  {tick}
                </>
              ) : (
                <>
                  {tick}
                  <span data-oid="n:hlfa_">{String(value)}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function TopOuterRuler() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-8 z-20 hidden md:block"
      data-oid="s8.grjw"
    >
      <ol
        className="flex items-start justify-between px-6"
        style={{ color: "var(--scaffold-ruler)" }}
        data-oid="4fi1:2."
      >
        {siteScaffoldConfig.rulerTopValues.map((value) => (
          <li
            key={`top-outer-${value}`}
            className="flex flex-col items-center gap-1 font-mono tracking-[0.22em] [font-family:var(--font-geist-pixel-grid)]"
            data-oid="..z_l3z"
          >
            <span className="text-[10px] leading-none" data-oid="58gy:d:">
              {value}
            </span>
            <span
              className="h-1.5 w-px bg-[var(--scaffold-ruler)] opacity-70"
              data-oid="qtp0jyo"
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

function TopRuler() {
  return (
    <header
      className="flex h-[50px] items-center justify-between border-b px-4 md:px-6"
      style={{ borderColor: "var(--scaffold-line)" }}
      data-oid="5jczr8k"
    >
      <SiteNav data-oid="ewgv63b" />
      <ThemeToggle data-oid="7m.k6vy" />
    </header>
  );
}

/** Horizontal extension reaches viewport edge; vertical top uses pageTopPadding, bottom uses pageBottomPadding or extends to viewport bottom when canvas is shorter. */
function BorderExtensions() {
  const { pageTopPadding, pageBottomPadding } = siteScaffoldConfig;
  const horizontalLength = "calc((100vw - 100%) / 2)";
  const verticalLengthTop = `${pageTopPadding}px`;
  const verticalLengthBottom = `max(${pageBottomPadding}px, calc(100dvh - 100%))`;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 hidden md:block"
      data-oid="ya:_to7"
    >
      <div
        className="absolute left-0 top-0 h-px -translate-x-full"
        style={{
          width: horizontalLength,
          background:
            "linear-gradient(to left, var(--scaffold-line), transparent)",
        }}
        data-oid="9xzf0ce"
      />

      <div
        className="absolute right-0 top-0 h-px translate-x-full"
        style={{
          width: horizontalLength,
          background:
            "linear-gradient(to right, var(--scaffold-line), transparent)",
        }}
        data-oid="6you_5d"
      />

      <div
        className="absolute left-0 bottom-0 h-px -translate-x-full"
        style={{
          width: horizontalLength,
          background:
            "linear-gradient(to left, var(--scaffold-line), transparent)",
        }}
        data-oid="siqbjbb"
      />

      <div
        className="absolute right-0 bottom-0 h-px translate-x-full"
        style={{
          width: horizontalLength,
          background:
            "linear-gradient(to right, var(--scaffold-line), transparent)",
        }}
        data-oid="w0jap97"
      />

      <div
        className="absolute left-0 top-0 w-px -translate-y-full"
        style={{
          height: verticalLengthTop,
          background:
            "linear-gradient(to top, var(--scaffold-line), transparent)",
        }}
        data-oid="rxg4r2h"
      />

      <div
        className="absolute right-0 top-0 w-px -translate-y-full"
        style={{
          height: verticalLengthTop,
          background:
            "linear-gradient(to top, var(--scaffold-line), transparent)",
        }}
        data-oid="h:12f:c"
      />

      <div
        className="absolute bottom-0 left-0 w-px translate-y-full"
        style={{
          height: verticalLengthBottom,
          background:
            "linear-gradient(to bottom, var(--scaffold-line), transparent)",
        }}
        data-oid="w6h-7:o"
      />

      <div
        className="absolute bottom-0 right-0 w-px translate-y-full"
        style={{
          height: verticalLengthBottom,
          background:
            "linear-gradient(to bottom, var(--scaffold-line), transparent)",
        }}
        data-oid="6u0lpl7"
      />
    </div>
  );
}

function CornerMarkers() {
  const marker = siteScaffoldConfig.cornerMarkers;
  const markerStyle = {
    width: marker.size,
    height: marker.size,
    borderWidth: marker.borderWidth,
    borderColor: "var(--scaffold-line)",
    background: "var(--scaffold-surface)",
  } as const;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      data-oid="owpl7ga"
    >
      <div
        className="absolute rounded-full border"
        style={{ ...markerStyle, left: -marker.offset, top: -marker.offset }}
        data-oid=".z3b50m"
      />

      <div
        className="absolute rounded-full border"
        style={{ ...markerStyle, right: -marker.offset, top: -marker.offset }}
        data-oid="8.ob8_z"
      />

      <div
        className="absolute rounded-full border"
        style={{ ...markerStyle, left: -marker.offset, bottom: -marker.offset }}
        data-oid="9y:i8cy"
      />

      <div
        className="absolute rounded-full border"
        style={{
          ...markerStyle,
          right: -marker.offset,
          bottom: -marker.offset,
        }}
        data-oid="ju3i3yl"
      />
    </div>
  );
}

export function SiteScaffold({ children, machineContent }: SiteScaffoldProps) {
  // Polyfill navigator.clipboard for non-secure contexts (HTTP, network IP)
  // so DialKit's Copy button doesn't throw "Cannot read properties of undefined".
  useEffect(() => {
    if (typeof navigator === "undefined" || navigator.clipboard) return;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText(text: string): Promise<void> {
          const el = document.createElement("textarea");
          el.value = text;
          el.style.cssText = "position:fixed;left:-9999px;opacity:0";
          document.body.appendChild(el);
          el.select();
          try {
            document.execCommand("copy");
          } catch {
            /* ignore */
          }
          el.remove();
          return Promise.resolve();
        },
      },
    });
  }, []);

  const scaffoldVars: ScaffoldVars = {
    "--scaffold-bg-light": siteScaffoldConfig.palette.light.background,
    "--scaffold-bg-dark": siteScaffoldConfig.palette.dark.background,
    "--scaffold-surface-light": siteScaffoldConfig.palette.light.surface,
    "--scaffold-surface-dark": siteScaffoldConfig.palette.dark.surface,
    "--scaffold-line-light": siteScaffoldConfig.palette.light.line,
    "--scaffold-line-dark": siteScaffoldConfig.palette.dark.line,
    "--scaffold-ruler-light": siteScaffoldConfig.palette.light.ruler,
    "--scaffold-ruler-dark": siteScaffoldConfig.palette.dark.ruler,
    "--scaffold-toggle-track-light":
      siteScaffoldConfig.palette.light.toggleTrack,
    "--scaffold-toggle-track-dark": siteScaffoldConfig.palette.dark.toggleTrack,
    "--scaffold-toggle-thumb-light":
      siteScaffoldConfig.palette.light.toggleThumb,
    "--scaffold-toggle-thumb-dark": siteScaffoldConfig.palette.dark.toggleThumb,
    "--scaffold-toggle-text-active-light":
      siteScaffoldConfig.palette.light.toggleTextActive,
    "--scaffold-toggle-text-active-dark":
      siteScaffoldConfig.palette.dark.toggleTextActive,
    "--scaffold-toggle-text-inactive-light":
      siteScaffoldConfig.palette.light.toggleTextInactive,
    "--scaffold-toggle-text-inactive-dark":
      siteScaffoldConfig.palette.dark.toggleTextInactive,
    "--scaffold-section-divider-width": `${siteScaffoldConfig.fullBleedSectionDividerWidth}px`,
    "--machine-surface-bg-light": "#FAFAFA",
    "--machine-surface-bg-dark": "#0A0A0A",
  };

  return (
    <MachineModeController machineContent={machineContent} data-oid="qjc9v6m">
      <div
        className="site-scaffold relative min-h-screen w-full"
        style={scaffoldVars}
        data-oid="3agt0b."
      >
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-[var(--scaffold-bg)]"
          data-oid="fa-a6lb"
        />

        <div
          className="mx-auto grid w-full grid-cols-1 grid-rows-[1fr] px-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-0"
          style={{
            maxWidth: siteScaffoldConfig.canvasMaxWidth + 128,
            paddingTop: siteScaffoldConfig.pageTopPadding,
            minHeight: "100dvh",
          }}
          data-oid="99hwvs7"
        >
          <SideRuler align="left" data-oid="683xp1t" />

          <div
            className="relative flex h-full flex-col overflow-visible"
            style={{
              background: "var(--scaffold-surface)",
              borderStyle: "solid",
              borderWidth: siteScaffoldConfig.borderWidth,
              borderColor: "var(--scaffold-line)",
            }}
            data-oid="d_k:s-4"
          >
            <CornerMarkers data-oid="::ym1gc" />
            <TopOuterRuler data-oid="ofitbx1" />
            <BorderExtensions data-oid="hfwg8c." />
            <a
              href="#main-content"
              className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-[54px] focus-visible:z-[100] focus-visible:rounded focus-visible:bg-[var(--scaffold-surface)] focus-visible:px-4 focus-visible:py-2 focus-visible:text-[10px] focus-visible:tracking-[0.18em] focus-visible:text-[var(--scaffold-toggle-text-active)] focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-circle)]"
              data-oid="2.:9sr-"
            >
              Skip to main content
            </a>
            <TopRuler data-oid="nf0:4yk" />

            <div className="flex flex-1 flex-col" data-oid="vdj7_hw">
              {siteScaffoldConfig.sections.map((section, index) => (
                <section
                  key={section.id}
                  className={cn(
                    "relative",
                    index === 0 ? "flex-1 p-0" : "px-4 py-4 md:px-6 md:py-6",
                  )}
                  style={{
                    minHeight: section.minHeight,
                  }}
                  data-oid=".hn_gx4"
                >
                  {index > 0 ? (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-0 w-screen -translate-x-1/2"
                      style={{
                        height: "var(--scaffold-section-divider-width)",
                        background: "var(--scaffold-section-divider)",
                      }}
                      data-oid="6oi6wvf"
                    />
                  ) : null}

                  <div
                    className="mx-auto h-full"
                    style={{
                      maxWidth: section.maxInnerWidth ?? undefined,
                    }}
                    data-oid="15iyxue"
                  >
                    {index === 0 ? (
                      <main
                        id="main-content"
                        tabIndex={-1}
                        className="h-full overflow-y-auto px-5 py-6 outline-none md:px-10 md:py-10"
                        data-oid="iokgfom"
                      >
                        {children}
                      </main>
                    ) : (
                      <div
                        className="h-full min-h-24 p-4 md:p-8"
                        data-oid="2pobn4j"
                      >
                        <div
                          className="h-px w-full"
                          style={{ background: "var(--scaffold-line)" }}
                          data-oid="fqfidir"
                        />
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>

          <SideRuler align="right" data-oid="foc6re8" />
        </div>
      </div>
    </MachineModeController>
  );
}
