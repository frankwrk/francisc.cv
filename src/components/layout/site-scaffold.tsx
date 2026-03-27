"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { AssistantProvider } from "@/components/ai/assistant-context";
import { useAssistant } from "@/components/ai/assistant-context";
import { siteScaffoldConfig } from "@/config/site-scaffold";
import { MachineModeController } from "@/components/machine/machine-mode-controller";
import { NavSocialLinks, SiteNav } from "@/components/layout/site-nav";
import { AssistantShell } from "@/components/ai/assistant-shell";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { buildShellVars } from "@/components/layout/shell-vars";
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
        className="h-7 w-[96px] rounded-full border border-(--scaffold-line)"
        aria-hidden
      />
    ),
  },
);

/** Opacity for a tick: full opacity above fade zone; linear fade over fadeZonePx at bottom. */
function sideRulerOpacity(
  value: number,
  height: number,
  fadeZonePx: number
): number {
  if (height <= 0 || fadeZonePx <= 0) {
    return 1;
  }

  const halfFade = fadeZonePx / 2;
  const distanceToTop = value;
  const distanceToBottom = height - value;
  const distanceToNearestEdge = Math.min(distanceToTop, distanceToBottom);

  if (distanceToNearestEdge >= halfFade) {
    return 1;
  }

  return distanceToNearestEdge / halfFade;
}

function SideRuler({
  align,
  height,
}: {
  align: "left" | "right";
  height: number | null;
}) {
  const { stepPx, fadeZonePx } = siteScaffoldConfig.rulerSide;

  const tickValues: number[] = [];
  const minorTickValues: number[] = [];
  if (height !== null && height > 0) {
    for (let value = stepPx; value <= height; value += stepPx) {
      tickValues.push(value);
    }
    for (let value = stepPx / 2; value <= height; value += stepPx) {
      minorTickValues.push(value);
    }
  }

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
    >
      <ul className="relative h-full w-full">
        {minorTickValues.map((value) => {
          const opacity = sideRulerOpacity(value, height ?? 0, fadeZonePx);
          return (
            <li
              key={`${align}-minor-${value}`}
              className={cn(
                "absolute flex -translate-y-1/2 items-center",
                align === "left" ? "right-0" : "left-0",
              )}
              style={{ top: `${value}px`, opacity }}
            >
              <span className="block h-px w-1 bg-current opacity-50" />
            </li>
          );
        })}
        {tickValues.map((value) => {
          const opacity = sideRulerOpacity(value, height ?? 0, fadeZonePx);
          const tick = <span className="block h-px w-2 bg-current opacity-70" />;

          return (
            <li
              key={`${align}-${value}`}
              className={cn(
                "absolute flex -translate-y-1/2 items-center gap-1.5",
                align === "left"
                  ? "right-0 justify-end"
                  : "left-0 justify-start",
              )}
              style={{
                top: `${value}px`,
                opacity,
              }}
            >
              {align === "left" ? (
                <>
                  <span>{String(value)}</span>
                  {tick}
                </>
              ) : (
                <>
                  {tick}
                  <span>{String(value)}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function TopRuler() {
  const { openAssistant } = useAssistant();
  const { trigger } = useWebHaptics();

  return (
    <header
      className="flex shrink-0 items-center justify-between border-b px-(--scaffold-top-bar-padding-x) md:px-(--scaffold-top-bar-padding-x-md)"
      style={{
        borderColor: "var(--scaffold-line)",
        height: `${siteScaffoldConfig.topBarHeightPx}px`,
        minHeight: `${siteScaffoldConfig.topBarHeightPx}px`,
      }}
    >
      <SiteNav />
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => {
            trigger([20, 30]);
            openAssistant();
          }}
          className="flex items-center gap-1 px-1 py-1 text-[11px] uppercase tracking-[0.2em] text-(--scaffold-ruler) transition-colors hover:text-(--scaffold-toggle-text-active) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--scaffold-ruler) md:hidden"
          aria-label="Ask about my work"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>ASK</span>
        </button>
        <div className="md:hidden">
          <NavSocialLinks variant="mobile" />
        </div>
        <button
          type="button"
          onClick={() => {
            trigger([20, 30]);
            openAssistant();
          }}
          className="group hidden items-center gap-2 px-1 py-1 text-[10px] tracking-[0.14em] text-(--scaffold-ruler) transition-colors hover:text-(--scaffold-toggle-text-active) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--scaffold-ruler) md:inline-flex"
          aria-label="Ask about my work"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <AnimatedShinyText className="transition-colors group-hover:text-(--scaffold-toggle-text-active)">
            Ask about my work
          </AnimatedShinyText>
        </button>
        <div className="hidden md:block">
          <NavSocialLinks variant="desktop" />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

/** Horizontal extension reaches viewport edge; vertical top uses pageTopPadding, bottom uses pageBottomPadding or extends to viewport bottom when canvas is shorter. */
function BorderExtensions() {
  const { pageTopPadding, pageBottomPadding, borderWidth } =
    siteScaffoldConfig;
  const horizontalLength = "calc((100vw - 100%) / 2)";
  const verticalLengthTop = `${pageTopPadding}px`;
  const verticalLengthBottom = `max(${pageBottomPadding}px, calc(100dvh - 100%))`;
  const leftEdge = -borderWidth;
  const rightEdge = -borderWidth;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 hidden md:block"
    >
      <div
        className="absolute top-0 h-px -translate-x-full"
        style={{
          left: leftEdge,
          width: horizontalLength,
          background:
            "linear-gradient(to left, var(--scaffold-line), transparent)",
        }}
      />

      <div
        className="absolute top-0 h-px translate-x-full"
        style={{
          right: rightEdge,
          width: horizontalLength,
          background:
            "linear-gradient(to right, var(--scaffold-line), transparent)",
        }}
      />

      <div
        className="absolute bottom-0 h-px -translate-x-full"
        style={{
          left: leftEdge,
          width: horizontalLength,
          background:
            "linear-gradient(to left, var(--scaffold-line), transparent)",
        }}
      />

      <div
        className="absolute bottom-0 h-px translate-x-full"
        style={{
          right: rightEdge,
          width: horizontalLength,
          background:
            "linear-gradient(to right, var(--scaffold-line), transparent)",
        }}
      />

      <div
        className="absolute top-0 w-px -translate-y-full"
        style={{
          left: leftEdge,
          height: verticalLengthTop,
          background:
            "linear-gradient(to top, var(--scaffold-line), transparent)",
        }}
      />

      <div
        className="absolute top-0 w-px -translate-y-full"
        style={{
          right: rightEdge,
          height: verticalLengthTop,
          background:
            "linear-gradient(to top, var(--scaffold-line), transparent)",
        }}
      />

      <div
        className="absolute bottom-0 w-px translate-y-full"
        style={{
          left: leftEdge,
          height: verticalLengthBottom,
          background:
            "linear-gradient(to bottom, var(--scaffold-line), transparent)",
        }}
      />

      <div
        className="absolute bottom-0 w-px translate-y-full"
        style={{
          right: rightEdge,
          height: verticalLengthBottom,
          background:
            "linear-gradient(to bottom, var(--scaffold-line), transparent)",
        }}
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
      className="pointer-events-none absolute inset-0 z-20 hidden md:block"
    >
      <div
        className="absolute rounded-full border"
        style={{ ...markerStyle, left: -marker.offset, top: -marker.offset }}
      />

      <div
        className="absolute rounded-full border"
        style={{ ...markerStyle, right: -marker.offset, top: -marker.offset }}
      />

      <div
        className="absolute rounded-full border"
        style={{ ...markerStyle, left: -marker.offset, bottom: -marker.offset }}
      />

      <div
        className="absolute rounded-full border"
        style={{
          ...markerStyle,
          right: -marker.offset,
          bottom: -marker.offset,
        }}
      />
    </div>
  );
}

export function SiteScaffold({ children, machineContent }: SiteScaffoldProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [rulerHeight, setRulerHeight] = useState<number | null>(null);

  // Polyfill navigator.clipboard for non-secure contexts (HTTP, network IP)
  // so copy UIs do not throw when navigator.clipboard is undefined.
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
            // @ts-ignore -- execCommand is deprecated but is the only option in non-secure contexts where navigator.clipboard is unavailable
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

  // Measure canvas height for side ruler tick positioning (real pixel height).
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setRulerHeight(entry.contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaffoldVars = buildShellVars();

  return (
    <MachineModeController machineContent={machineContent}>
      <AssistantProvider>
        <div
          className="site-scaffold relative min-h-screen w-full overflow-x-hidden"
          style={scaffoldVars}
        >
          <AssistantShell />
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 bg-(--scaffold-bg)"
          />

          <div
            className="mx-auto grid w-full grid-cols-1 px-4 pt-5 pb-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-0 md:pt-(--scaffold-page-top-padding) md:pb-(--scaffold-page-bottom-padding)"
            style={{
              maxWidth: siteScaffoldConfig.canvasMaxWidth + 128,
            }}
          >
            <SideRuler align="left" height={rulerHeight} />

            <div
              ref={canvasRef}
              className="relative flex h-full flex-col overflow-visible border-0 md:border-(--scaffold-line) md:[border-width:var(--scaffold-border-width)]"
              style={{
                background: "var(--scaffold-surface)",
              }}
            >
              <CornerMarkers />
              <BorderExtensions />
              <a
                href="#main-content"
                className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-(--scaffold-skip-link-top) focus-visible:z-100 focus-visible:rounded focus-visible:bg-(--scaffold-surface) focus-visible:px-4 focus-visible:py-2 focus-visible:text-[10px] focus-visible:tracking-[0.18em] focus-visible:text-(--scaffold-toggle-text-active) focus-visible:ring-2 focus-visible:ring-(--scaffold-ruler)"
              >
                Skip to main content
              </a>
              <TopRuler />

              <div className="flex flex-1 flex-col">
                {siteScaffoldConfig.sections.map((section, index) => (
                  <section
                    key={section.id}
                    className={cn(
                      "relative",
                      index === 0
                        ? "flex-1 p-0"
                        : "px-(--scaffold-section-padding-x) py-(--scaffold-section-padding-y) md:px-(--scaffold-section-padding-x-md) md:py-(--scaffold-section-padding-y-md)",
                    )}
                    style={{
                      minHeight: section.minHeight,
                    }}
                  >
                    {index > 0 ? (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 w-full"
                        style={{
                          height: "var(--scaffold-section-divider-width)",
                          background: "var(--scaffold-section-divider)",
                        }}
                      />
                    ) : null}

                    <div
                      className="mx-auto h-full"
                      style={{
                        maxWidth: section.maxInnerWidth ?? undefined,
                      }}
                    >
                      {index === 0 ? (
                        <main
                          id="main-content"
                          tabIndex={-1}
                          className="px-(--scaffold-main-padding-x) py-(--scaffold-main-padding-y) outline-none md:px-(--scaffold-main-padding-x-md) md:py-(--scaffold-main-padding-y-md)"
                        >
                          {children}
                        </main>
                      ) : (
                        <div className="h-full min-h-24 p-4 md:p-8">
                          <div
                            className="h-px w-full"
                            style={{ background: "var(--scaffold-line)" }}
                          />
                        </div>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </div>

            <SideRuler align="right" height={rulerHeight} />
          </div>
        </div>
      </AssistantProvider>
    </MachineModeController>
  );
}
