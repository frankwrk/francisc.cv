import {
  findPreviewDescriptor,
  inferPreviewIdFromInstrument,
  sanitizeInstrumentState,
  type ArtInstrumentState,
} from "./art-instrument";
import type { DerivedInstrumentConfig } from "./art-assignments";

type MaybeRecord = Record<string, unknown>;

type ArtUrlPayload = {
  previewId?: unknown;
  fg?: unknown;
  bg?: unknown;
  animation?: {
    enabled?: unknown;
    speed?: unknown;
  };
  instrument?: MaybeRecord;
} & MaybeRecord;

const DEFAULT_FG = "#d8dde7";
const DEFAULT_BG = "#021a2f";

export function parseArtUrlConfig(
  raw: string | null | undefined,
): DerivedInstrumentConfig | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return normalizeArtUrlPayload(parsed);
  } catch {
    try {
      const parsed = JSON.parse(decodeURIComponent(raw)) as unknown;
      return normalizeArtUrlPayload(parsed);
    } catch {
      return null;
    }
  }
}

export function serializeArtUrlConfig(config: DerivedInstrumentConfig): string {
  return JSON.stringify(buildArtUrlPayload(config));
}

export function buildArtEditorHref(input: {
  slug?: string | null;
  config: DerivedInstrumentConfig;
}) {
  const params = new URLSearchParams();

  if (input.slug) {
    params.set("slug", input.slug);
  }

  params.set("config", serializeArtUrlConfig(input.config));

  return `/art?${params.toString()}`;
}

export function buildArtUrlPayload(config: DerivedInstrumentConfig) {
  return {
    previewId: findPreviewDescriptor(config.previewId).id,
    fg: config.fg,
    bg: config.bg,
    animation: {
      enabled: config.animation.enabled,
      speed: config.animation.speed,
    },
    instrument: sanitizeInstrumentState(config.instrument),
  };
}

function normalizeArtUrlPayload(value: unknown): DerivedInstrumentConfig | null {
  if (!isRecord(value)) return null;

  const payload = value as ArtUrlPayload;
  const baseInstrument = isRecord(payload.instrument)
    ? payload.instrument
    : payload;
  const instrument = sanitizeInstrumentState(
    baseInstrument as Partial<ArtInstrumentState>,
  );
  const previewId = findPreviewDescriptor(
    typeof payload.previewId === "string"
      ? payload.previewId
      : inferPreviewIdFromInstrument(instrument),
  ).id;

  return {
    fg: typeof payload.fg === "string" ? payload.fg : DEFAULT_FG,
    bg: typeof payload.bg === "string" ? payload.bg : DEFAULT_BG,
    animation: {
      enabled:
        typeof payload.animation?.enabled === "boolean"
          ? payload.animation.enabled
          : true,
      speed:
        typeof payload.animation?.speed === "number"
          ? clamp(payload.animation.speed, 0.1, 4)
          : 0.8,
    },
    previewId,
    instrument,
  };
}

function isRecord(value: unknown): value is MaybeRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
