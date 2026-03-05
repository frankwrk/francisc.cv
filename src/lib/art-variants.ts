/**
 * Art Variants — canvas drawing functions for the pattern lab.
 *
 * Each function is pure: takes a 2D context + dimensions + params + time.
 * No side effects outside of the canvas.
 */

// ─── Color utilities ─────────────────────────────────────────────────────────

export function parseHex(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [isNaN(r) ? 0 : r, isNaN(g) ? 0 : g, isNaN(b) ? 0 : b];
}

// ─── Noise ────────────────────────────────────────────────────────────────────

function hash2(x: number, y: number): number {
  let h = ((x * 1619 + y * 31337) | 0);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h >>> 0) / 0x100000000;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

export function noise2D(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  return (
    hash2(xi,     yi)     * (1 - xf) * (1 - yf) +
    hash2(xi + 1, yi)     * xf       * (1 - yf) +
    hash2(xi,     yi + 1) * (1 - xf) * yf +
    hash2(xi + 1, yi + 1) * xf       * yf
  );
}

// ─── Wave functions ───────────────────────────────────────────────────────────

export type WaveType = "sine" | "square" | "sawtooth" | "triangle" | "noise";

export function waveAt(type: WaveType, t: number): number {
  switch (type) {
    case "sine":
      return Math.sin(t);
    case "square":
      return Math.sign(Math.sin(t));
    case "sawtooth": {
      const p = (t / (2 * Math.PI)) % 1;
      return (p < 0 ? p + 1 : p) * 2 - 1;
    }
    case "triangle":
      return (2 / Math.PI) * Math.asin(Math.sin(t));
    case "noise":
      return noise2D(t * 0.3, 0.5) * 2 - 1;
  }
}

// ─── Waveform Bars ────────────────────────────────────────────────────────────
// Vertical bars whose height follows a wave function. Inspired by the
// waveform-bar aesthetic shown in the reference images.

export interface WaveformBarsParams {
  count: number;
  waveType: string;
  amplitude: number;
  frequency: number;
  phaseOffset: number;
  fromBottom: boolean;
}

export function drawWaveformBars(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fg: string,
  bg: string,
  p: WaveformBarsParams,
  time: number,
): void {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;

  const count = Math.max(1, Math.round(p.count));
  const spacing = w / count;
  const barW = Math.max(1, spacing * 0.38);
  const TWO_PI = Math.PI * 2;

  for (let i = 0; i < count; i++) {
    const t =
      (i / Math.max(count - 1, 1)) * TWO_PI * p.frequency +
      p.phaseOffset +
      time;
    const raw = waveAt(p.waveType as WaveType, t); // [-1, 1]
    const norm = (raw * p.amplitude + 1) / 2;      // [0, 1]
    const barH = Math.max(2, norm * h * 0.92);
    const x = i * spacing + (spacing - barW) / 2;

    if (p.fromBottom) {
      ctx.fillRect(x, h - barH, barW, barH);
    } else {
      ctx.fillRect(x, h / 2 - barH / 2, barW, barH);
    }
  }
}

// ─── Grid Blocks ─────────────────────────────────────────────────────────────
// Grid of rectangles whose size and opacity are modulated by value noise.

export interface GridBlocksParams {
  columns: number;
  gap: number;
  noiseScale: number;
  roundness: number;
}

export function drawGridBlocks(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fg: string,
  bg: string,
  p: GridBlocksParams,
  time: number,
): void {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;

  const cols = Math.max(1, Math.round(p.columns));
  const cellW = w / cols;
  const rows = Math.max(1, Math.ceil(h / cellW));
  const cellH = h / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const nx = c * p.noiseScale * 0.35 + time * 0.25;
      const ny = r * p.noiseScale * 0.35 + time * 0.18;
      const n = noise2D(nx, ny);
      const scale = 0.12 + n * 0.88;

      const bw = Math.max(1, (cellW - p.gap) * scale);
      const bh = Math.max(1, (cellH - p.gap) * scale);
      const x = c * cellW + (cellW - bw) / 2;
      const y = r * cellH + (cellH - bh) / 2;

      ctx.globalAlpha = 0.15 + n * 0.85;
      const rad = Math.min(p.roundness, bw / 2, bh / 2);
      if (rad > 0) {
        ctx.beginPath();
        ctx.roundRect(x, y, bw, bh, rad);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, bw, bh);
      }
    }
  }
  ctx.globalAlpha = 1;
}

// ─── Noise Lines ─────────────────────────────────────────────────────────────
// Parallel lines whose paths are displaced by a noise field.
// Looks like contour maps or topographic drawings.

export interface NoiseLinesParams {
  count: number;
  lineWidth: number;
  displacement: number;
  direction: string;
  noiseScale: number;
}

export function drawNoiseLines(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fg: string,
  bg: string,
  p: NoiseLinesParams,
  time: number,
): void {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = fg;
  ctx.lineWidth = p.lineWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const isH = p.direction !== "vertical";
  const count = Math.max(2, Math.round(p.count));
  const primaryLen = isH ? h : w;
  const crossLen = isH ? w : h;
  const steps = Math.ceil(crossLen / 3);

  for (let i = 0; i < count; i++) {
    const base = ((i + 0.5) / count) * primaryLen;
    ctx.beginPath();
    for (let s = 0; s <= steps; s++) {
      const along = (s / steps) * crossLen;
      const nx = isH
        ? along * p.noiseScale * 0.012 + time * 0.18
        : i * 0.8 + time * 0.18;
      const ny = isH
        ? i * 0.8
        : along * p.noiseScale * 0.012 + time * 0.18;
      const disp = (noise2D(nx, ny) * 2 - 1) * p.displacement;
      const x = isH ? along : base + disp;
      const y = isH ? base + disp : along;
      if (s === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}

// ─── Pixel Scatter ────────────────────────────────────────────────────────────
// Dots whose positions are stable (seeded) but drift with noise over time.
// Density controls the fraction of dots that appear based on a noise threshold.

export interface PixelScatterParams {
  count: number;
  size: number;
  density: number;
  roundness: number;
}

export function drawPixelScatter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fg: string,
  bg: string,
  p: PixelScatterParams,
  time: number,
): void {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;

  const count = Math.round(p.count);
  const threshold = 1 - p.density;

  for (let i = 0; i < count; i++) {
    const bx = hash2(i, 7) * w;
    const by = hash2(i, 13) * h;

    // Noise-driven visibility threshold
    const n = noise2D(bx * 0.007, by * 0.007);
    if (n < threshold) continue;

    // Animate with noise drift
    const dx = (noise2D(bx * 0.009 + time * 0.12, by * 0.009) - 0.5) * 30;
    const dy = (noise2D(bx * 0.009, by * 0.009 + time * 0.10) - 0.5) * 30;
    const x = (bx + dx + w) % w;
    const y = (by + dy + h) % h;

    const sz = p.size * (0.4 + n * 0.6);
    ctx.globalAlpha = 0.25 + n * 0.75;

    const rad = Math.min(p.roundness, sz / 2);
    if (rad >= sz / 2) {
      ctx.beginPath();
      ctx.arc(x, y, sz / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (rad > 0) {
      ctx.beginPath();
      ctx.roundRect(x - sz / 2, y - sz / 2, sz, sz, rad);
      ctx.fill();
    } else {
      ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
    }
  }
  ctx.globalAlpha = 1;
}

// ─── Fluid Grid ───────────────────────────────────────────────────────────────
// Grid of cells whose positions and sizes are displaced by a noise field,
// giving the impression of a flowing or breathing surface.

export interface FluidGridParams {
  columns: number;
  gap: number;
  flowAmount: number;
  noiseScale: number;
}

export function drawFluidGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fg: string,
  bg: string,
  p: FluidGridParams,
  time: number,
): void {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;

  const cols = Math.max(1, Math.round(p.columns));
  const cellW = w / cols;
  const rows = Math.max(1, Math.ceil(h / cellW));
  const cellH = h / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = (c + 0.5) * cellW;
      const cy = (r + 0.5) * cellH;

      const nx = cx * p.noiseScale * 0.008 + time * 0.15;
      const ny = cy * p.noiseScale * 0.008 + time * 0.12;

      const dx = (noise2D(nx,       ny)       * 2 - 1) * p.flowAmount;
      const dy = (noise2D(nx + 50,  ny + 50)  * 2 - 1) * p.flowAmount;
      const scale = 0.25 + noise2D(nx + 100, ny + 100) * 0.75;

      const bw = Math.max(1, (cellW - p.gap) * scale);
      const bh = Math.max(1, (cellH - p.gap) * scale);
      const x = cx + dx - bw / 2;
      const y = cy + dy - bh / 2;

      ctx.globalAlpha = 0.2 + scale * 0.8;
      ctx.fillRect(x, y, bw, bh);
    }
  }
  ctx.globalAlpha = 1;
}

// ─── Contour Lines ────────────────────────────────────────────────────────────
// Topographic-map style elevation bands rendered as quantized noise. Each band
// is filled with a color interpolated between bg and fg, giving the impression
// of terrain viewed from above.

export interface ContourLinesParams {
  bandCount: number;
  noiseScale: number;
  contrast: number; // 0 = smooth gradient, 1 = hard band edges
}

export function drawContourLines(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fg: string,
  bg: string,
  p: ContourLinesParams,
  time: number,
): void {
  const fgRgb = parseHex(fg);
  const bgRgb = parseHex(bg);
  const bands = Math.max(2, Math.round(p.bandCount));
  const scale = p.noiseScale * 0.006;
  const contrast = Math.max(0, Math.min(1, p.contrast));

  // Sample at step=2 for performance; fill 2×2 blocks per sample
  const step = 2;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const n = noise2D(x * scale + time * 0.07, y * scale);
      const bandF   = n * bands;
      const bandIdx = Math.floor(bandF);
      const bandFrac = bandF - bandIdx;
      const t = (bandIdx + (contrast < 0.5 ? bandFrac : Math.round(bandFrac))) / bands;

      const r = Math.round(bgRgb[0] + (fgRgb[0] - bgRgb[0]) * t);
      const g = Math.round(bgRgb[1] + (fgRgb[1] - bgRgb[1]) * t);
      const b = Math.round(bgRgb[2] + (fgRgb[2] - bgRgb[2]) * t);

      for (let dy = 0; dy < step && y + dy < h; dy++) {
        for (let dx = 0; dx < step && x + dx < w; dx++) {
          const i = ((y + dy) * w + (x + dx)) * 4;
          data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// ─── Truchet Tiles ────────────────────────────────────────────────────────────
// Quarter-circle arcs at tile corners, connecting edge midpoints. Two
// orientations driven by noise + hash per tile create flowing maze-like paths.

export interface TruchetTilesParams {
  tileSize: number;
  lineWidth: number;
  noiseScale: number;
}

export function drawTruchetTiles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fg: string,
  bg: string,
  p: TruchetTilesParams,
  time: number,
): void {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = fg;
  ctx.lineWidth = Math.max(0.5, p.lineWidth);
  ctx.lineCap = "round";

  const ts   = Math.max(8, Math.round(p.tileSize));
  const half = ts / 2;
  const cols = Math.ceil(w / ts) + 1;
  const rows = Math.ceil(h / ts) + 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * ts;
      const y = r * ts;

      const n = noise2D(c * p.noiseScale * 0.4 + time * 0.04, r * p.noiseScale * 0.4);
      const orientation = (n + hash2(c, r)) % 1 > 0.5 ? 0 : 1;

      ctx.beginPath();
      if (orientation === 0) {
        // top-right corner: midpoint-top → midpoint-right
        ctx.arc(x + ts, y, half, Math.PI, Math.PI / 2, true);
        // bottom-left corner: midpoint-bottom → midpoint-left
        ctx.moveTo(x + half, y + ts);
        ctx.arc(x, y + ts, half, 0, -Math.PI / 2, true);
      } else {
        // top-left corner: midpoint-top → midpoint-left
        ctx.arc(x, y, half, 0, Math.PI / 2, false);
        // bottom-right corner: midpoint-bottom → midpoint-right
        ctx.moveTo(x + half, y + ts);
        ctx.arc(x + ts, y + ts, half, Math.PI, Math.PI * 1.5, false);
      }
      ctx.stroke();
    }
  }
}

// ─── Particle Flow ────────────────────────────────────────────────────────────
// Particles follow a noise-derived vector field, leaving fading trails.
// Each particle has a deterministic seed position; time advances their flow.

export interface ParticleFlowParams {
  particleCount: number;
  fieldScale: number;
  stepLength: number;
  trail: number;
}

export function drawParticleFlow(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fg: string,
  bg: string,
  p: ParticleFlowParams,
  time: number,
): void {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;

  const count  = Math.round(p.particleCount);
  const trail  = Math.max(2, Math.round(p.trail));
  const step   = Math.max(0.5, p.stepLength);
  const fScale = p.fieldScale * 0.005;
  const TWO_PI = Math.PI * 2;

  for (let i = 0; i < count; i++) {
    // Seeded starting position, slowly drifting with time
    let px = (hash2(i, 3) * w + time * 4.1) % w;
    let py = (hash2(i, 7) * h + time * 2.7) % h;

    for (let s = 0; s < trail; s++) {
      const angle = noise2D(px * fScale, py * fScale) * TWO_PI;
      px = (px + Math.cos(angle) * step + w) % w;
      py = (py + Math.sin(angle) * step + h) % h;

      ctx.globalAlpha = ((s + 1) / trail) * 0.65;
      ctx.fillRect(px - 0.75, py - 0.75, 1.5, 1.5);
    }
  }
  ctx.globalAlpha = 1;
}
