import {
  clampAlgoArtConfig,
  DEFAULT_ALGO_ART_CONFIG,
  type AlgoArtConfig,
} from "./art-algo-config";

export interface LegacyArtAssignment {
  variant: string;
  fg: string;
  bg: string;
  animation?: {
    enabled?: boolean;
    speed?: number;
  };
  layout: {
    count: number;
    columns: number;
  };
  waveformBars: {
    waveType: string;
    amplitude: number;
    frequency: number;
    phaseOffset: number;
    fromBottom: boolean;
  };
  gridBlocks: {
    gap: number;
    noiseScale: number;
    roundness: number;
  };
  noiseLines: {
    lineWidth: number;
    displacement: number;
    direction: string;
    noiseScale: number;
  };
  pixelScatter: {
    size: number;
    density: number;
    roundness: number;
  };
  fluidGrid: {
    gap: number;
    flowAmount: number;
    noiseScale: number;
  };
  contourLines?: {
    bandCount: number;
    noiseScale: number;
    contrast: number;
  };
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

export interface ArtAssignment {
  version: "algo-v1";
  heroCanvasIndex: number;
  config: AlgoArtConfig;
}

export type AnyArtAssignment = ArtAssignment | LegacyArtAssignment;

// Backward-compatible export used by the existing config file.
export type ArtConfig = AnyArtAssignment;

export const HERO_CANVAS_COUNT = 15;
export const DEFAULT_HERO_CANVAS_INDEX = 0;

const LS_PREFIX = "art-assignment:";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampCount(value: number) {
  return Math.round(clamp(value, 20, 100));
}

export function normalizeHeroCanvasIndex(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return DEFAULT_HERO_CANVAS_INDEX;
  }

  return Math.round(clamp(value, 0, HERO_CANVAS_COUNT - 1));
}

export function isArtAssignment(value: unknown): value is ArtAssignment {
  return Boolean(
    isRecord(value) &&
      value.version === "algo-v1" &&
      "config" in value,
  );
}

export function normalizeArtAssignment(
  value: AnyArtAssignment | null | undefined,
): ArtAssignment | null {
  if (!value) return null;

  if (isArtAssignment(value)) {
    return {
      version: "algo-v1",
      heroCanvasIndex: normalizeHeroCanvasIndex(value.heroCanvasIndex),
      config: clampAlgoArtConfig({
        ...DEFAULT_ALGO_ART_CONFIG,
        ...value.config,
      }),
    };
  }

  return normalizeLegacyArtAssignment(value);
}

export function normalizeArtAssignments(
  assignments: Record<string, AnyArtAssignment | null | undefined>,
): Record<string, ArtAssignment> {
  const normalized: Record<string, ArtAssignment> = {};

  for (const [slug, value] of Object.entries(assignments)) {
    const assignment = normalizeArtAssignment(value ?? null);
    if (assignment) {
      normalized[slug] = assignment;
    }
  }

  return normalized;
}

export function saveAssignment(slug: string, assignment: ArtAssignment): void {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(
    LS_PREFIX + slug,
    JSON.stringify(normalizeArtAssignment(assignment)),
  );
}

export function getAssignment(slug: string): ArtAssignment | null {
  if (typeof localStorage === "undefined") return null;

  try {
    const raw = localStorage.getItem(LS_PREFIX + slug);
    if (!raw) return null;

    return normalizeArtAssignment(JSON.parse(raw) as AnyArtAssignment);
  } catch {
    return null;
  }
}

export function removeAssignment(slug: string): void {
  if (typeof localStorage === "undefined") return;

  localStorage.removeItem(LS_PREFIX + slug);
}

export function serializeAssignmentEntry(
  slug: string,
  assignment: ArtAssignment,
): string {
  return `  "${slug}": ${JSON.stringify(assignment, null, 2).replace(/\n/g, "\n  ")},`;
}

export function serializeAssignmentsModule(
  assignments: Record<string, ArtAssignment>,
): string {
  const lines = Object.entries(assignments)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, assignment]) => serializeAssignmentEntry(slug, assignment));

  return [
    'import type { ArtConfig } from "@/lib/art-assignments";',
    "",
    "export const artAssignments: Record<string, ArtConfig> = {",
    ...lines,
    "};",
  ].join("\n");
}

function normalizeLegacyArtAssignment(
  value: LegacyArtAssignment,
): ArtAssignment {
  const heroCanvasIndex = normalizeLegacyHeroCanvasIndex(value.variant);
  const config = clampAlgoArtConfig({
    ...DEFAULT_ALGO_ART_CONFIG,
    ...mapLegacyVariantToAlgoConfig(value),
  });

  return {
    version: "algo-v1",
    heroCanvasIndex,
    config,
  };
}

function normalizeLegacyHeroCanvasIndex(variant: string): number {
  switch (variant) {
    case "grid-blocks":
    case "fluid-grid":
    case "truchet-tiles":
      return 2;
    case "pixel-scatter":
    case "particle-flow":
      return 7;
    case "waveform-bars":
    case "noise-lines":
    case "contour-lines":
    default:
      return 12;
  }
}

function mapLegacyVariantToAlgoConfig(
  value: LegacyArtAssignment,
): Partial<AlgoArtConfig> {
  const baseCount = clampCount(value.layout.count);
  const baseAspect =
    value.layout.count > 0
      ? clamp(value.layout.columns / value.layout.count, 0.4, 2.2)
      : DEFAULT_ALGO_ART_CONFIG.aspectRatio;

  switch (value.variant) {
    case "waveform-bars":
      return {
        axis: value.waveformBars.fromBottom ? "x" : "xy",
        ampY: clamp(value.waveformBars.amplitude * 1.6, 0.1, 2),
        aspectRatio: 0.7,
        count: baseCount,
        freq: clamp(value.waveformBars.frequency, 0.4, 6),
        kaleids: 1,
        lump: 0,
        noise:
          value.waveformBars.waveType === "noise"
            ? 0.85
            : value.waveformBars.waveType === "square"
              ? 0.4
              : value.waveformBars.waveType === "sawtooth"
                ? 0.25
                : 0.12,
        scale: 0.35,
        twirl: clamp(value.waveformBars.phaseOffset / 12, -0.01, 0.01),
        twist: clamp(value.waveformBars.phaseOffset / 2.5, 0, 11),
      };
    case "grid-blocks":
      return {
        ampX: clamp(value.layout.columns / 20, 0.4, 2),
        ampY: 1.25,
        aspectRatio: baseAspect,
        axis: "xy",
        count: baseCount,
        isMatrix: true,
        lump: clamp(value.gridBlocks.roundness / 20, 0, 1),
        noise: clamp(value.gridBlocks.noiseScale / 5, 0, 1),
        scale: clamp(1 - value.gridBlocks.gap / 20, 0.25, 1.2),
        twirl: 0.002,
      };
    case "noise-lines":
      return {
        ampX: 1.1,
        ampY: 1.1,
        axis: value.noiseLines.direction === "vertical" ? "y" : "x",
        count: baseCount,
        freq: 1.4,
        isLineart: true,
        noise: clamp(value.noiseLines.noiseScale / 5, 0, 1),
        scale: clamp(value.noiseLines.lineWidth / 10, 0.1, 1),
        twirl: clamp(value.noiseLines.displacement / 8000, 0, 0.01),
        twist: clamp(value.noiseLines.displacement / 25, 0, 11),
      };
    case "pixel-scatter":
      return {
        ampX: 1,
        ampY: 1,
        aspectRatio: 1,
        count: clampCount(value.layout.count * 0.6),
        freq: 1,
        isBalls: true,
        noise: clamp(value.pixelScatter.density, 0, 1),
        scale: clamp(value.pixelScatter.size / 18, 0.2, 1.2),
        lump: clamp(value.pixelScatter.roundness / 20, 0, 1),
      };
    case "fluid-grid":
      return {
        ampX: clamp(value.layout.columns / 24, 0.5, 2),
        ampY: 1.15,
        aspectRatio: baseAspect,
        axis: "xy",
        count: baseCount,
        isMatrix: true,
        noise: clamp(value.fluidGrid.noiseScale / 4, 0, 1),
        scale: clamp(1 - value.fluidGrid.gap / 18, 0.25, 1.2),
        twirl: clamp(value.fluidGrid.flowAmount / 8000, 0, 0.01),
        twist: clamp(value.fluidGrid.flowAmount / 10, 0, 11),
      };
    case "contour-lines":
      return {
        axis: "xy",
        count: baseCount,
        freq: 0.8,
        isLineart: true,
        isRing: true,
        kaleids: clamp(value.contourLines?.bandCount ?? 8, 1, 10),
        lump: clamp(value.contourLines?.contrast ?? 0.5, 0, 1),
        noise: clamp((value.contourLines?.noiseScale ?? 1) / 4, 0, 1),
        scale: 0.3,
        twirl: 0.0015,
      };
    case "truchet-tiles":
      return {
        ampX: 1,
        ampY: 1,
        axis: "xy",
        count: baseCount,
        isRing: true,
        kaleids: clamp((value.truchetTiles?.tileSize ?? 32) / 8, 1, 10),
        noise: clamp((value.truchetTiles?.noiseScale ?? 1) / 3, 0, 1),
        scale: clamp((value.truchetTiles?.lineWidth ?? 2) / 6, 0.15, 1.1),
        twist: clamp((value.truchetTiles?.tileSize ?? 32) / 10, 0, 11),
      };
    case "particle-flow":
      return {
        ampX: 1,
        ampY: 1,
        axis: "xy",
        count: clampCount((value.particleFlow?.particleCount ?? 120) / 6),
        isBalls: true,
        isSpiral: true,
        noise: clamp((value.particleFlow?.trail ?? 30) / 100, 0, 1),
        scale: clamp((value.particleFlow?.stepLength ?? 3) / 10, 0.2, 1.2),
        twirl: clamp((value.particleFlow?.fieldScale ?? 1) / 100, 0, 0.01),
        velocity: clamp((value.particleFlow?.fieldScale ?? 1) / 2, 0.1, 1),
      };
    default:
      return {
        aspectRatio: baseAspect,
        count: baseCount,
      };
  }
}
