/**
 * Art Assignments — persists a chosen ArtConfig per content slug via localStorage,
 * and provides a draw dispatcher that converts a stored config to canvas output.
 */

import {
  drawWaveformBars,
  drawGridBlocks,
  drawNoiseLines,
  drawPixelScatter,
  drawFluidGrid,
  drawContourLines,
  drawTruchetTiles,
  drawParticleFlow,
} from "./art-variants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArtConfig {
  variant: string;
  fg: string;
  bg: string;
  animation?: { enabled: boolean; speed: number };
  layout: { count: number; columns: number };
  waveformBars: {
    waveType: string;
    amplitude: number;
    frequency: number;
    phaseOffset: number;
    fromBottom: boolean;
  };
  gridBlocks: { gap: number; noiseScale: number; roundness: number };
  noiseLines: {
    lineWidth: number;
    displacement: number;
    direction: string;
    noiseScale: number;
  };
  pixelScatter: { size: number; density: number; roundness: number };
  fluidGrid: { gap: number; flowAmount: number; noiseScale: number };
  contourLines?: { bandCount: number; noiseScale: number; contrast: number };
  truchetTiles?: { tileSize: number; lineWidth: number; noiseScale: number };
  particleFlow?: { particleCount: number; fieldScale: number; stepLength: number; trail: number };
}

// ─── localStorage persistence ─────────────────────────────────────────────────

const LS_PREFIX = "art-assignment:";

export function saveAssignment(slug: string, config: ArtConfig): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(LS_PREFIX + slug, JSON.stringify(config));
}

export function getAssignment(slug: string): ArtConfig | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_PREFIX + slug);
    return raw ? (JSON.parse(raw) as ArtConfig) : null;
  } catch {
    return null;
  }
}

export function removeAssignment(slug: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(LS_PREFIX + slug);
}

// ─── Draw dispatcher ──────────────────────────────────────────────────────────

export function drawFromConfig(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: ArtConfig,
  time = 0,
): void {
  const { fg, bg, layout, variant } = config;
  const { count, columns } = layout;

  switch (variant) {
    case "waveform-bars":
      drawWaveformBars(ctx, w, h, fg, bg, { count, ...config.waveformBars }, time);
      break;
    case "grid-blocks":
      drawGridBlocks(ctx, w, h, fg, bg, { columns, ...config.gridBlocks }, time);
      break;
    case "noise-lines":
      drawNoiseLines(ctx, w, h, fg, bg, { count, ...config.noiseLines }, time);
      break;
    case "pixel-scatter":
      drawPixelScatter(ctx, w, h, fg, bg, { count: count * 20, ...config.pixelScatter }, time);
      break;
    case "fluid-grid":
      drawFluidGrid(ctx, w, h, fg, bg, { columns, ...config.fluidGrid }, time);
      break;
    case "contour-lines":
      drawContourLines(ctx, w, h, fg, bg, {
        bandCount:  config.contourLines?.bandCount  ?? 8,
        noiseScale: config.contourLines?.noiseScale ?? 1,
        contrast:   config.contourLines?.contrast   ?? 0.5,
      }, time);
      break;
    case "truchet-tiles":
      drawTruchetTiles(ctx, w, h, fg, bg, {
        tileSize:   config.truchetTiles?.tileSize   ?? 40,
        lineWidth:  config.truchetTiles?.lineWidth  ?? 2,
        noiseScale: config.truchetTiles?.noiseScale ?? 1,
      }, time);
      break;
    case "particle-flow":
      drawParticleFlow(ctx, w, h, fg, bg, {
        particleCount: config.particleFlow?.particleCount ?? 200,
        fieldScale:    config.particleFlow?.fieldScale    ?? 1,
        stepLength:    config.particleFlow?.stepLength    ?? 3,
        trail:         config.particleFlow?.trail         ?? 30,
      }, time);
      break;
  }
}
