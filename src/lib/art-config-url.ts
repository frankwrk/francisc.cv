import {
  normalizeArtAssignment,
  normalizeHeroCanvasIndex,
  type AnyArtAssignment,
  type ArtAssignment,
} from "./art-assignments";
import {
  clampAlgoArtConfig,
  DEFAULT_ALGO_ART_CONFIG,
  type AlgoArtConfig,
} from "./art-algo-config";

export type ArtEditorUrlPayload = {
  slug?: string;
  heroCanvasIndex?: number;
  config?: AlgoArtConfig;
};

type SearchParamValue = string | string[] | undefined;

function parseConfigPayload(raw: string | null | undefined): AlgoArtConfig | null {
  if (!raw) return null;

  const attempts = [raw, decodeURIComponentSafe(raw)];

  for (const value of attempts) {
    if (!value) continue;

    try {
      const parsed = JSON.parse(value) as unknown;
      if (typeof parsed === "object" && parsed !== null) {
        return clampAlgoArtConfig({
          ...DEFAULT_ALGO_ART_CONFIG,
          ...(parsed as Partial<AlgoArtConfig>),
        });
      }
    } catch {
      // Ignore malformed payloads and fall through to null.
    }
  }

  return null;
}

function decodeURIComponentSafe(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function firstSearchParamValue(value: SearchParamValue): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

export function buildArtEditorHref(input: {
  slug?: string | null;
  assignment?: ArtAssignment | AnyArtAssignment | null;
}) {
  const params = new URLSearchParams();

  if (input.slug) {
    params.set("slug", input.slug);
  }

  const assignment = normalizeArtAssignment(input.assignment ?? null);

  if (assignment) {
    params.set("heroCanvasIndex", String(assignment.heroCanvasIndex));
    params.set("config", JSON.stringify(assignment.config));
  }

  const query = params.toString();
  return query ? `/art?${query}` : "/art";
}

export function parseArtEditorSearchParams(params: {
  slug?: SearchParamValue;
  heroCanvasIndex?: SearchParamValue;
  config?: SearchParamValue;
}): {
  slug: string | null;
  assignment: ArtAssignment | null;
} {
  const slug = firstSearchParamValue(params.slug) ?? null;
  const config = parseConfigPayload(firstSearchParamValue(params.config));

  if (!config) {
    return {
      slug,
      assignment: null,
    };
  }

  return {
    slug,
    assignment: {
      version: "algo-v1",
      heroCanvasIndex: normalizeHeroCanvasIndex(
        Number(firstSearchParamValue(params.heroCanvasIndex)),
      ),
      config,
    },
  };
}
