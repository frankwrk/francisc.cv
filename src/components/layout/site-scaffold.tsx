"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { AssistantProvider } from "@/components/ai/assistant-context";
import { useAssistant } from "@/components/ai/assistant-context";
import { siteScaffoldConfig } from "@/config/site-scaffold";
import { MachineModeController } from "@/components/machine/machine-mode-controller";
import { SiteNav } from "@/components/layout/site-nav";
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
        className="h-7 w-[96px] rounded-full border border-[var(--scaffold-line)]"
        aria-hidden
       
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
     
    >
      <ul
        className="relative h-full w-full"
        style={{ marginTop: `-${siteScaffoldConfig.borderWidth}px` }}
       
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
            <span className="opacity-70">
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

function TopOuterRuler() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-8 z-20 hidden md:block"
     
    >
      <ol
        className="flex items-start justify-between px-6"
        style={{ color: "var(--scaffold-ruler)" }}
       
      >
        {siteScaffoldConfig.rulerTopValues.map((value) => (
          <li
            key={`top-outer-${value}`}
            className="flex flex-col items-center gap-1 font-mono tracking-[0.22em] [font-family:var(--font-geist-pixel-grid)]"
           
          >
            <span className="text-[10px] leading-none">
              {value}
            </span>
            <span
              className="h-1.5 w-px bg-[var(--scaffold-ruler)] opacity-70"
             
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

function TopRuler() {
  const { openAssistant } = useAssistant();
  const { trigger } = useWebHaptics();

  return (
    <header
      className="flex h-[50px] items-center justify-between border-b px-4 md:px-6"
      style={{ borderColor: "var(--scaffold-line)" }}
     
    >
      <SiteNav />
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => {
            trigger([20, 30]);
            openAssistant();
          }}
          className="group hidden items-center gap-2 px-1 py-1 text-[10px] tracking-[0.14em] text-[var(--scaffold-ruler)] transition-colors hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-circle)] md:inline-flex"
          aria-label="Ask about my work"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <AnimatedShinyText className="transition-colors group-hover:text-[var(--scaffold-toggle-text-active)]">
            Ask about my work
          </AnimatedShinyText>
        </button>
        <ThemeToggle />
      </div>
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
     
    >
      <div
        className="absolute left-0 top-0 h-px -translate-x-full"
        style={{
          width: horizontalLength,
          background:
            "linear-gradient(to left, var(--scaffold-line), transparent)",
        }}
       
      />

      <div
        className="absolute right-0 top-0 h-px translate-x-full"
        style={{
          width: horizontalLength,
          background:
            "linear-gradient(to right, var(--scaffold-line), transparent)",
        }}
       
      />

      <div
        className="absolute left-0 bottom-0 h-px -translate-x-full"
        style={{
          width: horizontalLength,
          background:
            "linear-gradient(to left, var(--scaffold-line), transparent)",
        }}
       
      />

      <div
        className="absolute right-0 bottom-0 h-px translate-x-full"
        style={{
          width: horizontalLength,
          background:
            "linear-gradient(to right, var(--scaffold-line), transparent)",
        }}
       
      />

      <div
        className="absolute left-0 top-0 w-px -translate-y-full"
        style={{
          height: verticalLengthTop,
          background:
            "linear-gradient(to top, var(--scaffold-line), transparent)",
        }}
       
      />

      <div
        className="absolute right-0 top-0 w-px -translate-y-full"
        style={{
          height: verticalLengthTop,
          background:
            "linear-gradient(to top, var(--scaffold-line), transparent)",
        }}
       
      />

      <div
        className="absolute bottom-0 left-0 w-px translate-y-full"
        style={{
          height: verticalLengthBottom,
          background:
            "linear-gradient(to bottom, var(--scaffold-line), transparent)",
        }}
       
      />

      <div
        className="absolute bottom-0 right-0 w-px translate-y-full"
        style={{
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
      className="pointer-events-none absolute inset-0 z-20"
     
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

  const scaffoldVars = buildShellVars();

  return (
    <MachineModeController machineContent={machineContent}>
      <AssistantProvider>
        <div
          className="site-scaffold relative min-h-screen w-full"
          style={scaffoldVars}
         
        >
          <AssistantShell />
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 bg-[var(--scaffold-bg)]"
           
          />

          <div
            className="mx-auto grid w-full grid-cols-1 grid-rows-[1fr] px-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-0"
            style={{
              maxWidth: siteScaffoldConfig.canvasMaxWidth + 128,
              paddingTop: siteScaffoldConfig.pageTopPadding,
              minHeight: "100dvh",
            }}
           
          >
            <SideRuler align="left" />

          <div
            className="relative flex h-full flex-col overflow-visible"
            style={{
              background: "var(--scaffold-surface)",
              borderStyle: "solid",
              borderWidth: siteScaffoldConfig.borderWidth,
              borderColor: "var(--scaffold-line)",
            }}
           
          >
            <CornerMarkers />
            <TopOuterRuler />
            <BorderExtensions />
            <a
              href="#main-content"
              className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-[54px] focus-visible:z-[100] focus-visible:rounded focus-visible:bg-[var(--scaffold-surface)] focus-visible:px-4 focus-visible:py-2 focus-visible:text-[10px] focus-visible:tracking-[0.18em] focus-visible:text-[var(--scaffold-toggle-text-active)] focus-visible:ring-2 focus-visible:ring-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-circle)]"
             
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
                    index === 0 ? "flex-1 p-0" : "px-4 py-4 md:px-6 md:py-6",
                  )}
                  style={{
                    minHeight: section.minHeight,
                  }}
                 
                >
                  {index > 0 ? (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-0 w-screen -translate-x-1/2"
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
                        className="h-full overflow-y-auto px-5 py-6 outline-none md:px-10 md:py-10"
                       
                      >
                        {children}
                      </main>
                    ) : (
                      <div
                        className="h-full min-h-24 p-4 md:p-8"
                       
                      >
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

            <SideRuler align="right" />
          </div>
        </div>
      </AssistantProvider>
    </MachineModeController>
  );
}
