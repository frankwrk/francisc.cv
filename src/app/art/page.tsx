"use client";

import { useRef, useEffect, useState } from "react";
import { useDialKit } from "dialkit";
import {
  drawWaveformBars,
  drawGridBlocks,
  drawNoiseLines,
  drawPixelScatter,
  drawFluidGrid,
} from "@/lib/art-variants";
import {
  saveAssignment,
  removeAssignment,
  getAssignment,
  CONTENT_SLUGS,
  type ArtConfig,
} from "@/lib/art-assignments";

// ─── Hex → OKLCH display ─────────────────────────────────────────────────────

function hexToOklch(hex: string): string {
  if (!hex?.startsWith("#") || hex.length < 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lr = lin(r), lg = lin(g), lb = lin(b);
  const lc = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const mc = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const sc = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L  =  0.2104542553 * lc + 0.7936177850 * mc - 0.0040720468 * sc;
  const a  =  1.9779984951 * lc - 2.4285922050 * mc + 0.4505937099 * sc;
  const bv =  0.0259040371 * lc + 0.7827717662 * mc - 0.8086757660 * sc;
  const C = Math.sqrt(a * a + bv * bv);
  const H = Math.atan2(bv, a) * 180 / Math.PI;
  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(4)} ${(H < 0 ? H + 360 : H).toFixed(1)})`;
}

// ─── Extract ArtConfig from current DialKit controls ─────────────────────────

type Controls = ReturnType<typeof useArtControls>;

function useArtControls() {
  return useDialKit("Art Generator", {
    variant: {
      type:    "select" as const,
      options: ["waveform-bars", "grid-blocks", "noise-lines", "pixel-scatter", "fluid-grid"],
      default: "waveform-bars",
    },
    colors: {
      foreground: { type: "color" as const, default: "#e0ca8c" },
      background: { type: "color" as const, default: "#c94c1c" },
    },
    animation: {
      enabled: false as boolean,
      speed:   [1, 0.1, 5, 0.1] as [number, number, number, number],
    },
    layout: {
      count:   [24,  2,  200, 1] as [number, number, number, number],
      columns: [12,  1,  60,  1] as [number, number, number, number],
    },
    waveformBars: {
      waveType:    { type: "select" as const, options: ["sine", "square", "sawtooth", "triangle", "noise"], default: "sine" },
      amplitude:   [0.75, 0.05, 1.0,  0.01] as [number, number, number, number],
      frequency:   [1.5,  0.1,  8.0,  0.1]  as [number, number, number, number],
      phaseOffset: [0,    0,    6.28, 0.01]  as [number, number, number, number],
      fromBottom:  true as boolean,
    },
    gridBlocks: {
      gap:        [4,   0, 30,  1]    as [number, number, number, number],
      noiseScale: [1.5, 0.1, 5, 0.1]  as [number, number, number, number],
      roundness:  [0,   0, 20,  1]    as [number, number, number, number],
    },
    noiseLines: {
      lineWidth:    [2,  1, 12,  1]    as [number, number, number, number],
      displacement: [30, 0, 200, 1]    as [number, number, number, number],
      direction:    { type: "select" as const, options: ["horizontal", "vertical"], default: "horizontal" },
      noiseScale:   [1.5, 0.1, 5, 0.1] as [number, number, number, number],
    },
    pixelScatter: {
      size:      [6,   1,  30,   1]    as [number, number, number, number],
      density:   [0.6, 0.1, 1.0, 0.01] as [number, number, number, number],
      roundness: [0,   0,  20,   1]    as [number, number, number, number],
    },
    fluidGrid: {
      gap:        [3,   0, 20,  1]    as [number, number, number, number],
      flowAmount: [20,  0, 80,  1]    as [number, number, number, number],
      noiseScale: [1.0, 0.1, 4, 0.1]  as [number, number, number, number],
    },
  });
}

function controlsToConfig(c: Controls): ArtConfig {
  return {
    variant: c.variant,
    fg:      c.colors.foreground,
    bg:      c.colors.background,
    layout:  { count: c.layout.count, columns: c.layout.columns },
    waveformBars: {
      waveType:    c.waveformBars.waveType,
      amplitude:   c.waveformBars.amplitude,
      frequency:   c.waveformBars.frequency,
      phaseOffset: c.waveformBars.phaseOffset,
      fromBottom:  c.waveformBars.fromBottom,
    },
    gridBlocks: {
      gap:        c.gridBlocks.gap,
      noiseScale: c.gridBlocks.noiseScale,
      roundness:  c.gridBlocks.roundness,
    },
    noiseLines: {
      lineWidth:    c.noiseLines.lineWidth,
      displacement: c.noiseLines.displacement,
      direction:    c.noiseLines.direction,
      noiseScale:   c.noiseLines.noiseScale,
    },
    pixelScatter: {
      size:      c.pixelScatter.size,
      density:   c.pixelScatter.density,
      roundness: c.pixelScatter.roundness,
    },
    fluidGrid: {
      gap:        c.fluidGrid.gap,
      flowAmount: c.fluidGrid.flowAmount,
      noiseScale: c.fluidGrid.noiseScale,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ArtPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const needsRedraw  = useRef(true);

  const controls     = useArtControls();
  const controlsRef  = useRef<Controls>(controls);
  controlsRef.current = controls;
  needsRedraw.current = true;

  // Assignment state: track which slugs have stored configs
  const [assigned, setAssigned] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const state: Record<string, boolean> = {};
    CONTENT_SLUGS.forEach(({ slug }) => {
      state[slug] = getAssignment(slug) !== null;
    });
    setAssigned(state);
  }, []);

  function handleAssign(slug: string) {
    saveAssignment(slug, controlsToConfig(controlsRef.current));
    setAssigned((prev) => ({ ...prev, [slug]: true }));
  }

  function handleRemove(slug: string) {
    removeAssignment(slug);
    setAssigned((prev) => ({ ...prev, [slug]: false }));
  }

  // Canvas setup + RAF loop
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      const cw = container!.clientWidth;
      const ch = container!.clientHeight;
      canvas!.width  = cw * dpr;
      canvas!.height = ch * dpr;
      needsRedraw.current = true;
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let frameId: number;
    let time   = 0;
    let lastTs = 0;

    function draw(ts: number) {
      const dt = Math.min(ts - lastTs, 100);
      lastTs = ts;

      const c  = controlsRef.current;
      const cw = container!.clientWidth;
      const ch = container!.clientHeight;

      if (c.animation.enabled) {
        time += (dt / 1000) * c.animation.speed;
        needsRedraw.current = true;
      }

      if (needsRedraw.current) {
        needsRedraw.current = false;
        const ctx = canvas!.getContext("2d");
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          const fg      = c.colors.foreground;
          const bg      = c.colors.background;
          const count   = c.layout.count;
          const columns = c.layout.columns;

          switch (c.variant) {
            case "waveform-bars":
              drawWaveformBars(ctx, cw, ch, fg, bg, { count, ...c.waveformBars }, time);
              break;
            case "grid-blocks":
              drawGridBlocks(ctx, cw, ch, fg, bg, { columns, ...c.gridBlocks }, time);
              break;
            case "noise-lines":
              drawNoiseLines(ctx, cw, ch, fg, bg, { count, ...c.noiseLines }, time);
              break;
            case "pixel-scatter":
              drawPixelScatter(ctx, cw, ch, fg, bg, { count: count * 20, ...c.pixelScatter }, time);
              break;
            case "fluid-grid":
              drawFluidGrid(ctx, cw, ch, fg, bg, { columns, ...c.fluidGrid }, time);
              break;
          }
        }
      }

      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fgOklch = hexToOklch(controls.colors.foreground);
  const bgOklch = hexToOklch(controls.colors.background);

  return (
    <div className="flex flex-col gap-5 pb-12 pt-2 [font-family:var(--font-geist-sans)]">
      <header className="space-y-1">
        <p className="text-[10px] tracking-[0.22em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
          ART / PATTERN LAB
        </p>
        <h1 className="text-2xl tracking-tight text-[var(--scaffold-toggle-text-active)]">
          Pattern lab
        </h1>
        <p className="text-[14px] leading-relaxed text-[var(--scaffold-ruler)]">
          Select a variant and tune it from the floating control panel.
          OKLCH values update live as you pick colors.
        </p>
      </header>

      {/* Main canvas */}
      <div
        ref={containerRef}
        className="overflow-hidden border border-[var(--scaffold-line)]"
        style={{ height: 420 }}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>

      {/* Color readout */}
      <div className="border border-[var(--scaffold-line)] p-3 space-y-2.5">
        <p className="text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
          COLOR — OKLCH
        </p>
        {(
          [
            { label: "FG", hex: controls.colors.foreground, oklch: fgOklch },
            { label: "BG", hex: controls.colors.background, oklch: bgOklch },
          ] as const
        ).map(({ label, hex, oklch }) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="h-5 w-5 shrink-0 border border-[var(--scaffold-line)]"
              style={{ backgroundColor: hex }}
            />
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-0.5">
              <span className="font-mono text-[11px] font-medium text-[var(--scaffold-toggle-text-active)]">
                {label}
              </span>
              <span className="font-mono text-[11px] text-[var(--scaffold-ruler)]">{hex}</span>
              <span className="select-all font-mono text-[11px] text-[var(--scaffold-toggle-text-active)]">
                {oklch}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment panel */}
      <div className="space-y-3">
        <div className="flex items-baseline gap-4">
          <p className="text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
            ASSIGN TO CONTENT
          </p>
          <p className="text-[12px] text-[var(--scaffold-ruler)]">
            Saves the current design to the selected article or project. Applied on the work and thinking pages.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CONTENT_SLUGS.map(({ slug, type }) => (
            <div
              key={slug}
              className="flex items-center justify-between gap-3 border border-[var(--scaffold-line)] px-3 py-2.5"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="truncate text-[13px] text-[var(--scaffold-toggle-text-active)]">
                  {slug}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] tracking-[0.14em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
                    {type.toUpperCase()}
                  </span>
                  {assigned[slug] && (
                    <span className="text-[9px] tracking-[0.14em] text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-square)]">
                      ✦ ASSIGNED
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {assigned[slug] && (
                  <button
                    onClick={() => handleRemove(slug)}
                    className="text-[11px] text-[var(--scaffold-ruler)] underline hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]"
                  >
                    Remove
                  </button>
                )}
                <button
                  onClick={() => handleAssign(slug)}
                  className="border border-[var(--scaffold-line)] px-3 py-1 text-[11px] tracking-[0.08em] text-[var(--scaffold-toggle-text-active)] hover:border-[var(--scaffold-ruler)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]"
                >
                  {assigned[slug] ? "Update" : "Assign"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
