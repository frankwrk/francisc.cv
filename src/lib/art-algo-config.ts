/**
 * Flat config for algo-art draw logic. One shared config drives all 15 canvases;
 * shape per canvas is derived from index (0–4 rect, 5–9 ellipse, 10–14 line).
 */

export type AlgoArtAxis = "x" | "y" | "xy";

export interface AlgoArtConfig {
  ampX: number;
  ampY: number;
  aspectRatio: number;
  axis: AlgoArtAxis;
  lump: number;
  count: number;
  freq: number;
  isDial: boolean;
  isLineart: boolean;
  isRing: boolean;
  isSpiral: boolean;
  isBalls: boolean;
  isMatrix: boolean;
  left: number;
  kaleids: number;
  mouseX: number;
  mouseY: number;
  noise: number;
  scale: number;
  top: number;
  twirl: number;
  twist: number;
  velocity: number;
}

export const DEFAULT_ALGO_ART_CONFIG: AlgoArtConfig = {
  ampX: 1,
  ampY: 1,
  aspectRatio: 1,
  axis: "x",
  lump: 0,
  count: 20,
  freq: 1,
  isDial: false,
  isLineart: false,
  isRing: false,
  isSpiral: false,
  isBalls: false,
  isMatrix: false,
  left: 0,
  kaleids: 1,
  mouseX: 0.7,
  mouseY: 0.3,
  noise: 0,
  scale: 1,
  top: 0,
  twirl: 0,
  twist: 0,
  velocity: 1,
};

/** Metadata for props panel: label, type, increment, range, default, enums */
export type AlgoArtPropMeta = {
  key: keyof AlgoArtConfig;
  label: string;
  type: "number" | "boolean" | "axis";
  increment?: number;
  range?: [number, number];
  min?: number;
  max?: number;
  default: number | boolean | AlgoArtAxis;
  enums?: string[];
};

export const ALGO_ART_PROPS_META: AlgoArtPropMeta[] = [
  { key: "scale", label: "Scale", type: "number", increment: 0.03, range: [0.4, 2], min: 0, max: 12, default: 1 },
  { key: "ampY", label: "Height", type: "number", increment: 0.03, range: [0, 2], default: 1 },
  { key: "ampX", label: "Width", type: "number", increment: 0.03, range: [0, 2], default: 1 },
  { key: "count", label: "Count", type: "number", increment: 1, min: 20, max: 100, default: 20 },
  { key: "aspectRatio", label: "Aspect", type: "number", increment: 0.03, range: [0.01, 5], default: 1 },
  { key: "noise", label: "Noise", type: "number", increment: 0.03, range: [0, 1], default: 0 },
  { key: "lump", label: "Lump", type: "number", increment: 0.03, range: [0, 1], default: 0 },
  { key: "twist", label: "Twist", type: "number", increment: 0.03, range: [0, 11], default: 0 },
  { key: "twirl", label: "Twirl", type: "number", increment: 0.03, range: [0, 0.01], default: 0 },
  { key: "freq", label: "Freq", type: "number", increment: 0.01, range: [0.4, 6], default: 1 },
  { key: "kaleids", label: "Kaleids", type: "number", increment: 0.1, range: [0, 10], default: 1 },
  { key: "velocity", label: "Velocity", type: "number", increment: 0.03, range: [1, 1], default: 1 },
  { key: "axis", label: "Axis", type: "axis", default: "x", enums: ["x", "y", "xy"] },
  { key: "isRing", label: "Ring", type: "boolean", default: false },
  { key: "isDial", label: "Dial", type: "boolean", default: false },
  { key: "isSpiral", label: "Spiral", type: "boolean", default: false },
  { key: "isBalls", label: "Balls", type: "boolean", default: false },
  { key: "isMatrix", label: "Matrix", type: "boolean", default: false },
  { key: "isLineart", label: "Lineart", type: "boolean", default: false },
];

/** Clamp numeric config values to their meta ranges */
export function clampAlgoArtConfig(config: AlgoArtConfig): AlgoArtConfig {
  let result: AlgoArtConfig = { ...config };
  for (const meta of ALGO_ART_PROPS_META) {
    if (meta.type !== "number" || meta.key === "axis") continue;
    const v = result[meta.key as keyof AlgoArtConfig];
    if (typeof v !== "number") continue;
    let out = v;
    if (meta.range !== undefined) {
      out = Math.min(Math.max(out, meta.range[0]), meta.range[1]);
    }
    if (meta.min !== undefined) {
      out = Math.max(out, meta.min);
    }
    if (meta.max !== undefined) {
      out = Math.min(out, meta.max);
    }
    result = { ...result, [meta.key]: out };
  }
  return result;
}
