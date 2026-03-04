/**
 * Discrete Field — pure TypeScript implementation
 *
 * Ports the algorithmic philosophy from algorithmic-art/discrete-field.html
 * so OG images and card thumbnails can be generated server-side without p5.js.
 *
 * The noise output won't match the p5.js viewer exactly (different gradient
 * noise implementation) but uses the same seeds and config values, so the
 * visual character of each article's field is preserved.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type BiasType =
  | "none"
  | "drift-ltr"
  | "perimeter"
  | "cellular"
  | "compressed"
  | "interference";

export interface ArticleFieldConfig {
  slug: string;
  hue: number;
  sat: number;
  bri: number;
  seed: number;
  cellSize: number;
  gap: number;
  noiseScaleX: number;
  noiseScaleY: number;
  oct2: { w: number; f: number; ox: number; oy: number };
  bias: BiasType;
}

export interface GridCell {
  color: string;
}

// ─── Article configurations ───────────────────────────────────────────────────
// Ported directly from algorithmic-art/discrete-field.html ARTICLES array.

export const FIELD_CONFIGS: Record<string, ArticleFieldConfig> = {
  "geoformations-redesign": {
    slug: "geoformations-redesign",
    hue: 215, sat: 52, bri: 62,
    seed: 3721, cellSize: 20, gap: 3,
    noiseScaleX: 0.003, noiseScaleY: 0.0085,
    oct2: { w: 0.28, f: 3.2, ox: 500, oy: 0 },
    bias: "none",
  },
  "docs-as-product-playbook": {
    slug: "docs-as-product-playbook",
    hue: 40, sat: 72, bri: 66,
    seed: 1847, cellSize: 13, gap: 2,
    noiseScaleX: 0.0108, noiseScaleY: 0.0108,
    oct2: { w: 0.45, f: 4.8, ox: 0, oy: 350 },
    bias: "none",
  },
  "platform-onboarding-accelerator": {
    slug: "platform-onboarding-accelerator",
    hue: 208, sat: 22, bri: 50,
    seed: 5293, cellSize: 22, gap: 3,
    noiseScaleX: 0.0038, noiseScaleY: 0.004,
    oct2: { w: 0.22, f: 2.2, ox: 200, oy: 200 },
    bias: "drift-ltr",
  },
  "secure-release-gates": {
    slug: "secure-release-gates",
    hue: 82, sat: 42, bri: 38,
    seed: 7156, cellSize: 20, gap: 3,
    noiseScaleX: 0.005, noiseScaleY: 0.005,
    oct2: { w: 0.38, f: 3.8, ox: 100, oy: 100 },
    bias: "perimeter",
  },
  "systems-thinking-in-web-projects": {
    slug: "systems-thinking-in-web-projects",
    hue: 8, sat: 55, bri: 50,
    seed: 2438, cellSize: 18, gap: 2,
    noiseScaleX: 0.005, noiseScaleY: 0.005,
    oct2: { w: 0.5, f: 5.5, ox: 400, oy: 0 },
    bias: "cellular",
  },
  "documentation-as-product-surface": {
    slug: "documentation-as-product-surface",
    hue: 220, sat: 10, bri: 35,
    seed: 9012, cellSize: 20, gap: 3,
    noiseScaleX: 0.006, noiseScaleY: 0.006,
    oct2: { w: 0.2, f: 2.5, ox: 0, oy: 500 },
    bias: "compressed",
  },
  "bridging-ux-and-engineering": {
    slug: "bridging-ux-and-engineering",
    hue: 33, sat: 32, bri: 58,
    seed: 4567, cellSize: 20, gap: 3,
    noiseScaleX: 0.0042, noiseScaleY: 0.0042,
    oct2: { w: 0.44, f: 3.0, ox: 0, oy: 0 },
    bias: "interference",
  },
};

export function getFieldConfig(slug: string): ArticleFieldConfig | null {
  return FIELD_CONFIGS[slug] ?? null;
}

// ─── Seeded value noise ───────────────────────────────────────────────────────
// Standard 2D value noise with smootherstep interpolation.
// The FREQ constant scales the raw noiseScale values (which are designed for
// p5.js coordinates) into a range that gives visually rich patterns here.

const FREQ = 50;

function hash2(x: number, y: number, seed: number): number {
  let h = ((seed + x * 1619 + y * 31337) | 0);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h >>> 0) / 0x100000000;
}

function smootherstep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function valueNoise(px: number, py: number, seed: number): number {
  const x0 = Math.floor(px);
  const y0 = Math.floor(py);
  const fx = smootherstep(px - x0);
  const fy = smootherstep(py - y0);
  return lerp(
    lerp(hash2(x0,     y0,     seed), hash2(x0 + 1, y0,     seed), fx),
    lerp(hash2(x0,     y0 + 1, seed), hash2(x0 + 1, y0 + 1, seed), fx),
    fy,
  );
}

function constrain(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function sampleField(
  c: number,
  r: number,
  cols: number,
  rows: number,
  cfg: ArticleFieldConfig,
  nsm: number,
): number {
  const nx = c * cfg.noiseScaleX * nsm * FREQ;
  const ny = r * cfg.noiseScaleY * nsm * FREQ;
  const o = cfg.oct2;
  let val: number;

  if (cfg.bias === "interference") {
    const n1 = valueNoise(nx, ny, cfg.seed);
    const n2 = valueNoise(ny * 0.72 + 1000, nx * 0.72 + 2000, cfg.seed);
    const n3 = valueNoise(nx * o.f + o.ox * 0.01, ny * o.f + o.oy * 0.01, cfg.seed);
    val = n1 * 0.44 + n2 * 0.36 + n3 * 0.20;
  } else {
    const n1 = valueNoise(nx, ny, cfg.seed);
    const n2 = valueNoise(nx * o.f + o.ox * 0.01, ny * o.f + o.oy * 0.01, cfg.seed);
    val = n1 * (1 - o.w) + n2 * o.w;
  }

  switch (cfg.bias) {
    case "drift-ltr": {
      const t = cols > 1 ? c / (cols - 1) : 0;
      val = val * 0.58 + t * 0.42;
      break;
    }
    case "perimeter": {
      const ex = Math.min(c, cols - 1 - c) / (cols * 0.20);
      const ey = Math.min(r, rows - 1 - r) / (rows * 0.20);
      const d = constrain(Math.min(ex, ey), 0, 1);
      val = constrain(val * 0.52 + (1 - d) * 0.55, 0, 1);
      break;
    }
    case "cellular": {
      val = smootherstep(val);
      val = smootherstep(val);
      break;
    }
    case "compressed": {
      val = Math.pow(val, 2.6);
      break;
    }
  }

  return constrain(val, 0, 1);
}

// ─── Color computation ────────────────────────────────────────────────────────

function hsbToRgb(h: number, s: number, b: number): [number, number, number] {
  const hh = h / 360;
  const ss = s / 100;
  const bb = b / 100;
  if (ss === 0) {
    const v = Math.round(bb * 255);
    return [v, v, v];
  }
  const i = Math.floor(hh * 6);
  const f = hh * 6 - i;
  const p = bb * (1 - ss);
  const q = bb * (1 - ss * f);
  const t = bb * (1 - ss * (1 - f));
  let r: number, g: number, blue: number;
  switch (i % 6) {
    case 0:  r = bb; g = t;  blue = p;  break;
    case 1:  r = q;  g = bb; blue = p;  break;
    case 2:  r = p;  g = bb; blue = t;  break;
    case 3:  r = p;  g = q;  blue = bb; break;
    case 4:  r = t;  g = p;  blue = bb; break;
    default: r = bb; g = p;  blue = q;  break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(blue * 255)];
}

function hsbToCss(h: number, s: number, b: number): string {
  const [r, g, bl] = hsbToRgb(h, s, b);
  return `rgb(${r},${g},${bl})`;
}

function makeShades(h: number, s: number, count: number): string[] {
  const n = Math.max(count, 2);
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const bri = lerp(14, 91, t);
    const sat = constrain(s * lerp(1.05, 0.14, t), 3, 100);
    return hsbToCss(h, sat, bri);
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ComputeGridOptions {
  shadeCount?: number;
  noiseScale?: number;
  cellSize?: number;
  gap?: number;
}

export interface GridResult {
  cells: GridCell[];
  cols: number;
  rows: number;
  cellSize: number;
  gap: number;
  bgColor: string;
}

/**
 * Compute the full pixel-tile grid for a given article config and canvas size.
 * Returns an array of cells (left-to-right, top-to-bottom) with CSS color strings.
 */
export function computeGrid(
  cfg: ArticleFieldConfig,
  width: number,
  height: number,
  opts: ComputeGridOptions = {},
): GridResult {
  const cs = opts.cellSize ?? cfg.cellSize;
  const gap = opts.gap ?? cfg.gap;
  const shadeCount = opts.shadeCount ?? 6;
  const noiseScale = opts.noiseScale ?? 1.0;

  const step = cs + gap;
  const cols = Math.floor(width / step);
  const rows = Math.floor(height / step);
  const shades = makeShades(cfg.hue, cfg.sat, shadeCount);
  const bgColor = hsbToCss(cfg.hue, cfg.sat * 0.55, cfg.bri * 0.12);

  const cells: GridCell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = sampleField(c, r, cols, rows, cfg, noiseScale);
      const si = Math.min(Math.floor(val * shadeCount), shadeCount - 1);
      cells.push({ color: shades[si] });
    }
  }

  return { cells, cols, rows, cellSize: cs, gap, bgColor };
}
