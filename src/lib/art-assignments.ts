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
} from "./art-variants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArtConfig {
  variant: string;
  fg: string;
  bg: string;
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
}

// ─── Known content slugs ──────────────────────────────────────────────────────

export const CONTENT_SLUGS = [
  { slug: "geoformations-redesign",          type: "work"     },
  { slug: "docs-as-product-playbook",        type: "work"     },
  { slug: "platform-onboarding-accelerator", type: "work"     },
  { slug: "secure-release-gates",            type: "work"     },
  { slug: "systems-thinking-in-web-projects",type: "thinking" },
  { slug: "documentation-as-product-surface",type: "thinking" },
  { slug: "bridging-ux-and-engineering",     type: "thinking" },
] as const;

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
  }
}
