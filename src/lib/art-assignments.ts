/**
 * Art Assignments — persists a chosen ArtConfig per content slug via localStorage,
 * and provides a draw dispatcher that converts a stored config to canvas output.
 */

import {
  artPreviewDescriptors,
  defaultInstrumentState,
  drawInstrumentArt,
  findPreviewDescriptor,
  inferPreviewIdFromInstrument,
  sanitizeInstrumentState,
  type ArtInstrumentState,
} from "./art-instrument";
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

export interface LegacyArtConfig {
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
  truchetTiles?: {
    tileSize: number;
    lineWidth: number;
    noiseScale: number;
  };
  particleFlow?: {
    particleCount: number;
    fieldScale: number;
    stepLength: number;
    trail: number;
  };
}

export interface InstrumentArtConfig {
  version: "instrument-v1";
  variant: "instrument-lab";
  fg: string;
  bg: string;
  animation?: { enabled: boolean; speed: number };
  layout: { count: number; columns: number };
  previewId: string;
  instrument: ArtInstrumentState;
}

export type ArtConfig = LegacyArtConfig | InstrumentArtConfig;

export interface DerivedInstrumentConfig {
  fg: string;
  bg: string;
  animation: { enabled: boolean; speed: number };
  previewId: string;
  instrument: ArtInstrumentState;
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

// ─── Type guards / conversion ────────────────────────────────────────────────

export function isInstrumentArtConfig(
  config: ArtConfig | null | undefined,
): config is InstrumentArtConfig {
  return Boolean(
    config &&
      config.variant === "instrument-lab" &&
      "instrument" in config &&
      typeof config.instrument === "object",
  );
}

export function createInstrumentArtConfig(input: DerivedInstrumentConfig): InstrumentArtConfig {
  const instrument = sanitizeInstrumentState(input.instrument);
  const previewId = findPreviewDescriptor(input.previewId).id;

  return {
    version: "instrument-v1",
    variant: "instrument-lab",
    fg: input.fg,
    bg: input.bg,
    animation: input.animation,
    layout: {
      count: instrument.count,
      columns: Math.min(4, Math.max(1, Math.round(instrument.kaleids))),
    },
    previewId,
    instrument,
  };
}

export function deriveInstrumentConfig(config: ArtConfig | null | undefined): DerivedInstrumentConfig {
  if (isInstrumentArtConfig(config)) {
    return {
      fg: config.fg,
      bg: config.bg,
      animation: config.animation ?? { enabled: true, speed: 0.8 },
      previewId: findPreviewDescriptor(config.previewId).id,
      instrument: sanitizeInstrumentState(config.instrument),
    };
  }

  return convertLegacyArtConfig(config as LegacyArtConfig | null | undefined);
}

function convertLegacyArtConfig(
  config: LegacyArtConfig | null | undefined,
): DerivedInstrumentConfig {
  const instrument = { ...defaultInstrumentState };

  if (!config) {
    const previewId = artPreviewDescriptors[0].id;
    return {
      fg: "#d8dde7",
      bg: "#021a2f",
      animation: { enabled: true, speed: 0.8 },
      previewId,
      instrument: sanitizeInstrumentState({
        ...instrument,
        ...findPreviewDescriptor(previewId).overrides,
      }),
    };
  }

  instrument.count = Math.max(24, config.layout.count);

  switch (config.variant) {
    case "waveform-bars":
      instrument.shape = "line";
      instrument.axis = "x";
      instrument.ampY = clamp(config.waveformBars.amplitude * 1.4, 0.25, 2.2);
      instrument.freq = clamp(config.waveformBars.frequency, 0.3, 6);
      instrument.twist = clamp(config.waveformBars.phaseOffset / (Math.PI * 2), -1, 1);
      instrument.scale = 0.28;
      instrument.kaleids = 3;
      break;
    case "grid-blocks":
      instrument.shape = "rect";
      instrument.axis = "xy";
      instrument.isMatrix = true;
      instrument.noise = clamp(config.gridBlocks.noiseScale / 5, 0, 1);
      instrument.scale = 0.24;
      instrument.lump = clamp(config.gridBlocks.roundness / 20, 0, 1);
      instrument.count = Math.max(30, config.layout.columns * 6);
      break;
    case "noise-lines":
      instrument.shape = "line";
      instrument.axis = config.noiseLines.direction === "vertical" ? "y" : "x";
      instrument.isLineart = true;
      instrument.noise = clamp(config.noiseLines.noiseScale / 5, 0, 1);
      instrument.twist = clamp(config.noiseLines.displacement / 200, 0, 1.2);
      instrument.scale = clamp(config.noiseLines.lineWidth / 8, 0.1, 0.8);
      break;
    case "pixel-scatter":
      instrument.shape = "circle";
      instrument.isBalls = true;
      instrument.noise = clamp(config.pixelScatter.density, 0, 1);
      instrument.scale = clamp(config.pixelScatter.size / 18, 0.12, 0.8);
      instrument.count = Math.max(24, Math.round(config.layout.count * 0.8));
      break;
    case "fluid-grid":
      instrument.shape = "rect";
      instrument.isMatrix = true;
      instrument.twirl = clamp(config.fluidGrid.flowAmount / 80, 0, 1.1);
      instrument.noise = clamp(config.fluidGrid.noiseScale / 4, 0, 1);
      instrument.scale = 0.3;
      break;
    case "contour-lines":
      instrument.shape = "line";
      instrument.isRing = true;
      instrument.isLineart = true;
      instrument.kaleids = clamp((config.contourLines?.bandCount ?? 8) / 2, 2, 10);
      instrument.noise = clamp(config.contourLines?.noiseScale ?? 1, 0, 1);
      instrument.lump = clamp(config.contourLines?.contrast ?? 0.5, 0, 1);
      instrument.scale = 0.32;
      break;
    case "truchet-tiles":
      instrument.shape = "rect";
      instrument.isRing = true;
      instrument.kaleids = clamp((config.truchetTiles?.tileSize ?? 40) / 10, 2, 12);
      instrument.scale = clamp((config.truchetTiles?.lineWidth ?? 2) / 6, 0.12, 0.7);
      instrument.noise = clamp((config.truchetTiles?.noiseScale ?? 1) / 3, 0, 1);
      break;
    case "particle-flow":
      instrument.shape = "circle";
      instrument.isBalls = true;
      instrument.isSpiral = true;
      instrument.velocity = clamp((config.particleFlow?.fieldScale ?? 1) / 2, 0.2, 1.5);
      instrument.scale = clamp((config.particleFlow?.stepLength ?? 3) / 12, 0.08, 0.8);
      instrument.count = Math.max(24, Math.round((config.particleFlow?.particleCount ?? 200) / 4));
      break;
    default:
      break;
  }

  const previewId = inferPreviewIdFromInstrument(instrument);

  return {
    fg: config.fg,
    bg: config.bg,
    animation: config.animation ?? { enabled: false, speed: 1 },
    previewId,
    instrument: sanitizeInstrumentState(instrument),
  };
}

// ─── Draw dispatcher ──────────────────────────────────────────────────────────

export function drawFromConfig(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: ArtConfig,
  time = 0,
): void {
  if (isInstrumentArtConfig(config)) {
    drawInstrumentArt(ctx, w, h, config.fg, config.bg, config.instrument, time, {
      x: config.instrument.mouseX,
      y: config.instrument.mouseY,
      influence: 0.6,
    });
    return;
  }

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
      drawContourLines(
        ctx,
        w,
        h,
        fg,
        bg,
        {
          bandCount: config.contourLines?.bandCount ?? 8,
          noiseScale: config.contourLines?.noiseScale ?? 1,
          contrast: config.contourLines?.contrast ?? 0.5,
        },
        time,
      );
      break;
    case "truchet-tiles":
      drawTruchetTiles(
        ctx,
        w,
        h,
        fg,
        bg,
        {
          tileSize: config.truchetTiles?.tileSize ?? 40,
          lineWidth: config.truchetTiles?.lineWidth ?? 2,
          noiseScale: config.truchetTiles?.noiseScale ?? 1,
        },
        time,
      );
      break;
    case "particle-flow":
      drawParticleFlow(
        ctx,
        w,
        h,
        fg,
        bg,
        {
          particleCount: config.particleFlow?.particleCount ?? 200,
          fieldScale: config.particleFlow?.fieldScale ?? 1,
          stepLength: config.particleFlow?.stepLength ?? 3,
          trail: config.particleFlow?.trail ?? 30,
        },
        time,
      );
      break;
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
