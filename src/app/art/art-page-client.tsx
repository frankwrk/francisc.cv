"use client";

import { useRef, useEffect, useState } from "react";
import { useDialKit, DialStore } from "dialkit";
import {
  drawWaveformBars,
  drawGridBlocks,
  drawNoiseLines,
  drawPixelScatter,
  drawFluidGrid,
  drawContourLines,
  drawTruchetTiles,
  drawParticleFlow,
} from "@/lib/art-variants";
import {
  saveAssignment,
  removeAssignment,
  getAssignment,
  drawFromConfig,
  type ArtConfig,
} from "@/lib/art-assignments";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentSlug = { slug: string; type: "work" | "thinking" };

// All possible flat variant param values (shared key names reuse across variants)
interface AnyParams {
  // waveform-bars
  waveType?: string;
  amplitude?: number;
  frequency?: number;
  phaseOffset?: number;
  fromBottom?: boolean;
  // grid-blocks / noise-lines / fluid-grid / contour-lines / truchet-tiles
  gap?: number;
  noiseScale?: number;
  roundness?: number;
  // noise-lines / truchet-tiles
  lineWidth?: number;
  displacement?: number;
  direction?: string;
  // pixel-scatter
  size?: number;
  density?: number;
  // fluid-grid
  flowAmount?: number;
  // contour-lines
  bandCount?: number;
  contrast?: number;
  // truchet-tiles
  tileSize?: number;
  // particle-flow
  particleCount?: number;
  fieldScale?: number;
  stepLength?: number;
  trail?: number;
}

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

// ─── Variant param configs (drives the dynamic "Parameters" panel) ────────────

const ALL_VARIANTS = [
  "waveform-bars",
  "grid-blocks",
  "noise-lines",
  "pixel-scatter",
  "fluid-grid",
  "contour-lines",
  "truchet-tiles",
  "particle-flow",
] as const;

function getVariantConfig(variant: string) {
  switch (variant) {
    case "waveform-bars":
      return {
        waveType:    { type: "select" as const, options: ["sine", "square", "sawtooth", "triangle", "noise"], default: "sine" },
        amplitude:   [0.75, 0.05, 1.0,  0.01] as [number, number, number, number],
        frequency:   [1.5,  0.1,  8.0,  0.1]  as [number, number, number, number],
        phaseOffset: [0,    0,    6.28, 0.01]  as [number, number, number, number],
        fromBottom:  true as boolean,
      };
    case "grid-blocks":
      return {
        gap:        [4,   0, 30,  1]    as [number, number, number, number],
        noiseScale: [1.5, 0.1, 5, 0.1]  as [number, number, number, number],
        roundness:  [0,   0, 20,  1]    as [number, number, number, number],
      };
    case "noise-lines":
      return {
        lineWidth:    [2,  1, 12,  1]     as [number, number, number, number],
        displacement: [30, 0, 200, 1]     as [number, number, number, number],
        direction:    { type: "select" as const, options: ["horizontal", "vertical"], default: "horizontal" },
        noiseScale:   [1.5, 0.1, 5, 0.1]  as [number, number, number, number],
      };
    case "pixel-scatter":
      return {
        size:      [6,   1,  30,   1]    as [number, number, number, number],
        density:   [0.6, 0.1, 1.0, 0.01] as [number, number, number, number],
        roundness: [0,   0,  20,   1]    as [number, number, number, number],
      };
    case "fluid-grid":
      return {
        gap:        [3,   0, 20,  1]    as [number, number, number, number],
        flowAmount: [20,  0, 80,  1]    as [number, number, number, number],
        noiseScale: [1.0, 0.1, 4, 0.1]  as [number, number, number, number],
      };
    case "contour-lines":
      return {
        bandCount:  [8,   2,  24,  1]    as [number, number, number, number],
        noiseScale: [1.0, 0.2, 4, 0.1]  as [number, number, number, number],
        contrast:   [0.5, 0,  1,  0.01]  as [number, number, number, number],
      };
    case "truchet-tiles":
      return {
        tileSize:   [40,  8,  120, 4]    as [number, number, number, number],
        lineWidth:  [2,   0.5, 10, 0.5]  as [number, number, number, number],
        noiseScale: [1.0, 0.1, 3, 0.1]  as [number, number, number, number],
      };
    case "particle-flow":
      return {
        particleCount: [200, 20,  800, 10]  as [number, number, number, number],
        fieldScale:    [1.0, 0.1, 5,   0.1] as [number, number, number, number],
        stepLength:    [3,   0.5, 15,  0.5]  as [number, number, number, number],
        trail:         [30,  5,   100, 5]    as [number, number, number, number],
      };
    default:
      return {};
  }
}

// ─── Base controls hook ───────────────────────────────────────────────────────

const PANEL_BASE   = "Art Generator";
const PANEL_PARAMS = "Parameters";

function useBaseControls() {
  return useDialKit(PANEL_BASE, {
    variant: {
      type:    "select" as const,
      options: ALL_VARIANTS as unknown as string[],
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
  });
}

type BaseControls = ReturnType<typeof useBaseControls>;

// ─── Config builder ───────────────────────────────────────────────────────────

function buildConfig(base: BaseControls, p: AnyParams): ArtConfig {
  return {
    variant: base.variant,
    fg:      base.colors.foreground,
    bg:      base.colors.background,
    animation: { enabled: base.animation.enabled, speed: base.animation.speed },
    layout:    { count: base.layout.count, columns: base.layout.columns },
    waveformBars: {
      waveType:    p.waveType    ?? "sine",
      amplitude:   p.amplitude   ?? 0.75,
      frequency:   p.frequency   ?? 1.5,
      phaseOffset: p.phaseOffset ?? 0,
      fromBottom:  p.fromBottom  ?? true,
    },
    gridBlocks: {
      gap:        p.gap        ?? 4,
      noiseScale: p.noiseScale ?? 1.5,
      roundness:  p.roundness  ?? 0,
    },
    noiseLines: {
      lineWidth:    p.lineWidth    ?? 2,
      displacement: p.displacement ?? 30,
      direction:    p.direction    ?? "horizontal",
      noiseScale:   p.noiseScale   ?? 1.5,
    },
    pixelScatter: {
      size:      p.size      ?? 6,
      density:   p.density   ?? 0.6,
      roundness: p.roundness ?? 0,
    },
    fluidGrid: {
      gap:        p.gap        ?? 3,
      flowAmount: p.flowAmount ?? 20,
      noiseScale: p.noiseScale ?? 1,
    },
    contourLines: {
      bandCount:  p.bandCount  ?? 8,
      noiseScale: p.noiseScale ?? 1,
      contrast:   p.contrast   ?? 0.5,
    },
    truchetTiles: {
      tileSize:   p.tileSize   ?? 40,
      lineWidth:  p.lineWidth  ?? 2,
      noiseScale: p.noiseScale ?? 1,
    },
    particleFlow: {
      particleCount: p.particleCount ?? 200,
      fieldScale:    p.fieldScale    ?? 1,
      stepLength:    p.stepLength    ?? 3,
      trail:         p.trail         ?? 30,
    },
  };
}

// ─── Load config back into DialKit ────────────────────────────────────────────

function applyBaseToDialKit(config: ArtConfig) {
  DialStore.updateValue(PANEL_BASE, "variant", config.variant);
  DialStore.updateValue(PANEL_BASE, "colors.foreground", config.fg);
  DialStore.updateValue(PANEL_BASE, "colors.background", config.bg);
  if (config.animation) {
    DialStore.updateValue(PANEL_BASE, "animation.enabled", config.animation.enabled);
    DialStore.updateValue(PANEL_BASE, "animation.speed", config.animation.speed);
  }
  DialStore.updateValue(PANEL_BASE, "layout.count", config.layout.count);
  DialStore.updateValue(PANEL_BASE, "layout.columns", config.layout.columns);
}

function applyParamsToDialKit(config: ArtConfig) {
  const v = config.variant;
  if (v === "waveform-bars") {
    DialStore.updateValue(PANEL_PARAMS, "waveType",    config.waveformBars.waveType);
    DialStore.updateValue(PANEL_PARAMS, "amplitude",   config.waveformBars.amplitude);
    DialStore.updateValue(PANEL_PARAMS, "frequency",   config.waveformBars.frequency);
    DialStore.updateValue(PANEL_PARAMS, "phaseOffset", config.waveformBars.phaseOffset);
    DialStore.updateValue(PANEL_PARAMS, "fromBottom",  config.waveformBars.fromBottom);
  } else if (v === "grid-blocks") {
    DialStore.updateValue(PANEL_PARAMS, "gap",        config.gridBlocks.gap);
    DialStore.updateValue(PANEL_PARAMS, "noiseScale", config.gridBlocks.noiseScale);
    DialStore.updateValue(PANEL_PARAMS, "roundness",  config.gridBlocks.roundness);
  } else if (v === "noise-lines") {
    DialStore.updateValue(PANEL_PARAMS, "lineWidth",    config.noiseLines.lineWidth);
    DialStore.updateValue(PANEL_PARAMS, "displacement", config.noiseLines.displacement);
    DialStore.updateValue(PANEL_PARAMS, "direction",    config.noiseLines.direction);
    DialStore.updateValue(PANEL_PARAMS, "noiseScale",   config.noiseLines.noiseScale);
  } else if (v === "pixel-scatter") {
    DialStore.updateValue(PANEL_PARAMS, "size",      config.pixelScatter.size);
    DialStore.updateValue(PANEL_PARAMS, "density",   config.pixelScatter.density);
    DialStore.updateValue(PANEL_PARAMS, "roundness", config.pixelScatter.roundness);
  } else if (v === "fluid-grid") {
    DialStore.updateValue(PANEL_PARAMS, "gap",        config.fluidGrid.gap);
    DialStore.updateValue(PANEL_PARAMS, "flowAmount", config.fluidGrid.flowAmount);
    DialStore.updateValue(PANEL_PARAMS, "noiseScale", config.fluidGrid.noiseScale);
  } else if (v === "contour-lines" && config.contourLines) {
    DialStore.updateValue(PANEL_PARAMS, "bandCount",  config.contourLines.bandCount);
    DialStore.updateValue(PANEL_PARAMS, "noiseScale", config.contourLines.noiseScale);
    DialStore.updateValue(PANEL_PARAMS, "contrast",   config.contourLines.contrast);
  } else if (v === "truchet-tiles" && config.truchetTiles) {
    DialStore.updateValue(PANEL_PARAMS, "tileSize",   config.truchetTiles.tileSize);
    DialStore.updateValue(PANEL_PARAMS, "lineWidth",  config.truchetTiles.lineWidth);
    DialStore.updateValue(PANEL_PARAMS, "noiseScale", config.truchetTiles.noiseScale);
  } else if (v === "particle-flow" && config.particleFlow) {
    DialStore.updateValue(PANEL_PARAMS, "particleCount", config.particleFlow.particleCount);
    DialStore.updateValue(PANEL_PARAMS, "fieldScale",    config.particleFlow.fieldScale);
    DialStore.updateValue(PANEL_PARAMS, "stepLength",    config.particleFlow.stepLength);
    DialStore.updateValue(PANEL_PARAMS, "trail",         config.particleFlow.trail);
  }
}

// ─── Assignment thumbnail ─────────────────────────────────────────────────────

function AssignmentThumbnail({ config }: { config: ArtConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const w   = container.clientWidth;
    const h   = container.clientHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawFromConfig(ctx, w, h, config, 0);
  }, [config]);

  return (
    <div
      ref={containerRef}
      className="border-b border-[var(--scaffold-line)]"
      style={{ height: 48 }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ArtPageClient({ contentSlugs }: { contentSlugs: ContentSlug[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const needsRedraw  = useRef(true);

  // ── Hook 1: base controls (always present)
  const base = useBaseControls();

  // ── Track active variant in state to drive the params panel
  const [activeVariant, setActiveVariant] = useState("waveform-bars");
  useEffect(() => {
    if (base.variant !== activeVariant) setActiveVariant(base.variant);
  }, [base.variant, activeVariant]);

  // ── Hook 2: variant-specific params (dynamic — config changes per variant)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = useDialKit(PANEL_PARAMS, getVariantConfig(activeVariant) as any) as unknown as AnyParams;

  // Keep a ref to the latest base + params for the RAF loop
  const stateRef = useRef({ base, params });
  stateRef.current = { base, params };
  needsRedraw.current = true;

  // ── Pending load: apply params after the params panel switches to the right variant
  const [pendingLoad, setPendingLoad] = useState<ArtConfig | null>(null);
  useEffect(() => {
    if (!pendingLoad || activeVariant !== pendingLoad.variant) return;
    applyParamsToDialKit(pendingLoad);
    setPendingLoad(null);
  }, [activeVariant, pendingLoad]);

  // ── Assignments state
  const [assignedConfigs, setAssignedConfigs] = useState<Record<string, ArtConfig | null>>({});
  useEffect(() => {
    const state: Record<string, ArtConfig | null> = {};
    contentSlugs.forEach(({ slug }) => { state[slug] = getAssignment(slug); });
    setAssignedConfigs(state);
  }, [contentSlugs]);

  function handleAssign(slug: string) {
    const cfg = buildConfig(stateRef.current.base, stateRef.current.params);
    saveAssignment(slug, cfg);
    setAssignedConfigs((prev) => ({ ...prev, [slug]: cfg }));
  }

  function handleRemove(slug: string) {
    removeAssignment(slug);
    setAssignedConfigs((prev) => ({ ...prev, [slug]: null }));
  }

  function handleLoad(config: ArtConfig) {
    applyBaseToDialKit(config);
    // Params panel may not match the new variant yet — defer until it does
    if (activeVariant === config.variant) {
      applyParamsToDialKit(config);
    } else {
      setPendingLoad(config);
    }
  }

  // ── Canvas RAF loop
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

      const { base: b, params: p } = stateRef.current;
      const cw = container!.clientWidth;
      const ch = container!.clientHeight;

      if (b.animation.enabled) {
        time += (dt / 1000) * b.animation.speed;
        needsRedraw.current = true;
      }

      if (needsRedraw.current) {
        needsRedraw.current = false;
        const ctx = canvas!.getContext("2d");
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          const fg      = b.colors.foreground;
          const bg      = b.colors.background;
          const count   = b.layout.count;
          const columns = b.layout.columns;

          switch (b.variant) {
            case "waveform-bars":
              drawWaveformBars(ctx, cw, ch, fg, bg, {
                count, waveType: p.waveType ?? "sine", amplitude: p.amplitude ?? 0.75,
                frequency: p.frequency ?? 1.5, phaseOffset: p.phaseOffset ?? 0,
                fromBottom: p.fromBottom ?? true,
              }, time);
              break;
            case "grid-blocks":
              drawGridBlocks(ctx, cw, ch, fg, bg, {
                columns, gap: p.gap ?? 4, noiseScale: p.noiseScale ?? 1.5, roundness: p.roundness ?? 0,
              }, time);
              break;
            case "noise-lines":
              drawNoiseLines(ctx, cw, ch, fg, bg, {
                count, lineWidth: p.lineWidth ?? 2, displacement: p.displacement ?? 30,
                direction: p.direction ?? "horizontal", noiseScale: p.noiseScale ?? 1.5,
              }, time);
              break;
            case "pixel-scatter":
              drawPixelScatter(ctx, cw, ch, fg, bg, {
                count: count * 20, size: p.size ?? 6, density: p.density ?? 0.6, roundness: p.roundness ?? 0,
              }, time);
              break;
            case "fluid-grid":
              drawFluidGrid(ctx, cw, ch, fg, bg, {
                columns, gap: p.gap ?? 3, flowAmount: p.flowAmount ?? 20, noiseScale: p.noiseScale ?? 1,
              }, time);
              break;
            case "contour-lines":
              drawContourLines(ctx, cw, ch, fg, bg, {
                bandCount: p.bandCount ?? 8, noiseScale: p.noiseScale ?? 1, contrast: p.contrast ?? 0.5,
              }, time);
              break;
            case "truchet-tiles":
              drawTruchetTiles(ctx, cw, ch, fg, bg, {
                tileSize: p.tileSize ?? 40, lineWidth: p.lineWidth ?? 2, noiseScale: p.noiseScale ?? 1,
              }, time);
              break;
            case "particle-flow":
              drawParticleFlow(ctx, cw, ch, fg, bg, {
                particleCount: p.particleCount ?? 200, fieldScale: p.fieldScale ?? 1,
                stepLength: p.stepLength ?? 3, trail: p.trail ?? 30,
              }, time);
              break;
          }
        }
      }
      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frameId); ro.disconnect(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Export: merge committed + localStorage
  const [exportSnippet, setExportSnippet] = useState<string | null>(null);

  async function buildExport() {
    const committed = await fetch("/api/art-assignments")
      .then((r) => r.json() as Promise<Record<string, ArtConfig>>)
      .catch(() => ({} as Record<string, ArtConfig>));

    const merged: Record<string, ArtConfig> = { ...committed };
    contentSlugs.forEach(({ slug }) => {
      const cfg = getAssignment(slug);
      if (cfg) merged[slug] = cfg;
    });

    if (Object.keys(merged).length === 0) {
      setExportSnippet("// No assignments saved yet.");
      return;
    }
    const entries = Object.entries(merged).map(
      ([slug, cfg]) => `  "${slug}": ${JSON.stringify(cfg, null, 4).replace(/\n/g, "\n  ")},`,
    );
    setExportSnippet(`export const artAssignments = {\n${entries.join("\n")}\n};`);
  }

  function copyExport() {
    if (exportSnippet) navigator.clipboard.writeText(exportSnippet);
  }

  const fgOklch = hexToOklch(base.colors.foreground);
  const bgOklch = hexToOklch(base.colors.background);

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
          Pick a variant — the Parameters panel updates to show only its controls.
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
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      {/* Color readout */}
      <div className="border border-[var(--scaffold-line)] p-3 space-y-2.5">
        <p className="text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
          COLOR — OKLCH
        </p>
        {(
          [
            { label: "FG", hex: base.colors.foreground, oklch: fgOklch },
            { label: "BG", hex: base.colors.background, oklch: bgOklch },
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
            Assign the current design to an article or project. Load resumes editing a saved design.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {contentSlugs.map(({ slug, type }) => {
            const cfg = assignedConfigs[slug] ?? null;
            return (
              <div key={slug} className="overflow-hidden border border-[var(--scaffold-line)]">
                {cfg && <AssignmentThumbnail config={cfg} />}

                <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate text-[13px] text-[var(--scaffold-toggle-text-active)]">
                      {slug}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] tracking-[0.14em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
                        {type.toUpperCase()}
                      </span>
                      {cfg && (
                        <span className="text-[9px] tracking-[0.14em] text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-square)]">
                          ✦ ASSIGNED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {cfg && (
                      <>
                        <button
                          onClick={() => handleLoad(cfg)}
                          className="text-[11px] text-[var(--scaffold-ruler)] underline hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleRemove(slug)}
                          className="text-[11px] text-[var(--scaffold-ruler)] underline hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]"
                        >
                          Remove
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleAssign(slug)}
                      className="border border-[var(--scaffold-line)] px-3 py-1 text-[11px] tracking-[0.08em] text-[var(--scaffold-toggle-text-active)] hover:border-[var(--scaffold-ruler)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]"
                    >
                      {cfg ? "Update" : "Assign"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export panel */}
      <div className="space-y-3">
        <div className="flex items-baseline gap-4">
          <p className="text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-square)]">
            EXPORT CONFIG
          </p>
          <p className="text-[12px] text-[var(--scaffold-ruler)]">
            Merges committed and local assignments. Paste into{" "}
            <code className="font-mono text-[11px]">src/config/art-assignments.ts</code>.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={buildExport}
            className="border border-[var(--scaffold-line)] px-3 py-1.5 text-[11px] tracking-[0.08em] text-[var(--scaffold-toggle-text-active)] hover:border-[var(--scaffold-ruler)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]"
          >
            Generate
          </button>
          {exportSnippet && (
            <button
              onClick={copyExport}
              className="border border-[var(--scaffold-line)] px-3 py-1.5 text-[11px] tracking-[0.08em] text-[var(--scaffold-toggle-text-active)] hover:border-[var(--scaffold-ruler)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]"
            >
              Copy
            </button>
          )}
        </div>

        {exportSnippet && (
          <textarea
            readOnly
            value={exportSnippet}
            onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            rows={Math.min(exportSnippet.split("\n").length + 1, 20)}
            className="w-full resize-y border border-[var(--scaffold-line)] bg-[var(--scaffold-surface)] p-3 font-mono text-[11px] leading-relaxed text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]"
          />
        )}
      </div>
    </div>
  );
}
