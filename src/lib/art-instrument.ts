export type InstrumentShape = "line" | "circle" | "rect";
export type InstrumentAxis = "x" | "y" | "xy";

export interface ArtInstrumentState {
  shape: InstrumentShape;
  axis: InstrumentAxis;
  ampX: number;
  ampY: number;
  aspectRatio: number;
  lump: number;
  count: number;
  freq: number;
  kaleids: number;
  mouseX: number;
  mouseY: number;
  noise: number;
  scale: number;
  left: number;
  top: number;
  twirl: number;
  twist: number;
  velocity: number;
  isDial: boolean;
  isLineart: boolean;
  isRing: boolean;
  isSpiral: boolean;
  isBalls: boolean;
  isMatrix: boolean;
}

export interface ArtPreviewDescriptor {
  id: string;
  label: string;
  family: string;
  overrides: Partial<ArtInstrumentState>;
}

type PointerVector = {
  x: number;
  y: number;
  influence: number;
};

export const defaultInstrumentState: ArtInstrumentState = {
  shape: "line",
  axis: "x",
  ampX: 1,
  ampY: 1,
  aspectRatio: 1,
  lump: 0,
  count: 20,
  freq: 1,
  kaleids: 1,
  mouseX: 0.7,
  mouseY: 0.3,
  noise: 0,
  scale: 1,
  left: 0,
  top: 0,
  twirl: 0,
  twist: 0,
  velocity: 1,
  isDial: false,
  isLineart: false,
  isRing: false,
  isSpiral: false,
  isBalls: false,
  isMatrix: false,
};

const countSteps = [20, 40, 60, 80, 100];

export const artPreviewDescriptors: ArtPreviewDescriptor[] = [
  ...countSteps.map((count, index) => ({
    id: ["rect-ribbon", "rect-kaleid", "rect-stack", "rect-matrix", "rect-orbit"][index]!,
    label: `Squares / ${count}`,
    family: "Squares",
    overrides: {
      shape: "rect" as const,
      axis: "xy" as const,
      count,
      scale: 1.06 - index * 0.15,
      ampX: 1,
      ampY: 1.28,
      aspectRatio: 1.2 - index * 0.02,
      freq: 1.05,
      kaleids: 6,
      mouseX: 0.86,
      mouseY: 0.58,
      noise: 0,
      twirl: 0.48,
      twist: 0,
      velocity: 0.38,
      isDial: false,
      isLineart: false,
      isRing: true,
      isSpiral: false,
      isBalls: false,
      isMatrix: false,
    },
  })),
  ...countSteps.map((count, index) => ({
    id: ["circle-orbit", "circle-balls", "circle-dial", "circle-kaleid", "circle-matrix"][index]!,
    label: `Circles / ${count}`,
    family: "Circles",
    overrides: {
      shape: "circle" as const,
      axis: "x" as const,
      count,
      scale: 0.9 - index * 0.13,
      ampX: 1,
      ampY: 1,
      aspectRatio: 1,
      freq: 1,
      kaleids: 1,
      mouseX: 0.66,
      mouseY: 0.46,
      noise: 0.04,
      twirl: 0.12,
      twist: 0,
      velocity: 0.2,
      isDial: false,
      isLineart: false,
      isRing: false,
      isSpiral: false,
      isBalls: true,
      isMatrix: false,
    },
  })),
  ...countSteps.map((count, index) => ({
    id: ["line-wave", "line-ring", "line-spiral", "line-matrix", "line-dial"][index]!,
    label: `Lines / ${count}`,
    family: "Lines",
    overrides: {
      shape: "line" as const,
      axis: "x" as const,
      count,
      scale: 0.9 - index * 0.13,
      ampX: 1,
      ampY: 1,
      aspectRatio: 1,
      freq: 1,
      kaleids: 1,
      mouseX: 0.68,
      mouseY: 0.54,
      noise: 0.08,
      twirl: 0.16,
      twist: 0,
      velocity: 0.16,
      isDial: false,
      isLineart: true,
      isRing: false,
      isSpiral: false,
      isBalls: false,
      isMatrix: false,
    },
  })),
];

const previewIds = new Set(artPreviewDescriptors.map((descriptor) => descriptor.id));

export function sanitizeInstrumentState(
  partial?: Partial<ArtInstrumentState> | null,
): ArtInstrumentState {
  const next: ArtInstrumentState = {
    ...defaultInstrumentState,
    ...partial,
  };

  next.shape =
    partial?.shape === "circle" || partial?.shape === "rect"
      ? partial.shape
      : "line";
  next.axis =
    partial?.axis === "x" || partial?.axis === "y" || partial?.axis === "xy"
      ? partial.axis
      : defaultInstrumentState.axis;
  const finite = (value: number, fallback: number) =>
    Number.isFinite(value) ? value : fallback;

  next.ampX = clamp(finite(next.ampX, defaultInstrumentState.ampX), 0.1, 2.5);
  next.ampY = clamp(finite(next.ampY, defaultInstrumentState.ampY), 0.1, 2.5);
  next.aspectRatio = clamp(
    finite(next.aspectRatio, defaultInstrumentState.aspectRatio),
    0.4,
    2.2,
  );
  next.lump = clamp(finite(next.lump, defaultInstrumentState.lump), 0, 1.4);
  next.count = Math.round(
    clamp(finite(next.count, defaultInstrumentState.count), 16, 180),
  );
  next.freq = clamp(finite(next.freq, defaultInstrumentState.freq), 0.2, 8);
  next.kaleids = clamp(
    finite(next.kaleids, defaultInstrumentState.kaleids),
    1,
    16,
  );
  next.mouseX = clamp(finite(next.mouseX, defaultInstrumentState.mouseX), 0, 1);
  next.mouseY = clamp(finite(next.mouseY, defaultInstrumentState.mouseY), 0, 1);
  next.noise = clamp(finite(next.noise, defaultInstrumentState.noise), 0, 1);
  next.scale = clamp(
    finite(next.scale, defaultInstrumentState.scale),
    0.05,
    1.2,
  );
  next.left = clamp(finite(next.left, defaultInstrumentState.left), -60, 60);
  next.top = clamp(finite(next.top, defaultInstrumentState.top), -60, 60);
  next.twirl = clamp(
    finite(next.twirl, defaultInstrumentState.twirl),
    -1.4,
    1.4,
  );
  next.twist = clamp(
    finite(next.twist, defaultInstrumentState.twist),
    -1.4,
    1.4,
  );
  next.velocity = clamp(
    finite(next.velocity, defaultInstrumentState.velocity),
    0,
    2,
  );

  normalizeExclusiveModes(next);

  return next;
}

export function findPreviewDescriptor(id: string | null | undefined) {
  if (!id) return artPreviewDescriptors[0];
  return (
    artPreviewDescriptors.find((descriptor) => descriptor.id === id) ??
    artPreviewDescriptors[0]
  );
}

export function isPreviewDescriptorId(value: string | null | undefined) {
  return Boolean(value && previewIds.has(value));
}

export function inferPreviewIdFromInstrument(
  state: Partial<ArtInstrumentState>,
): string {
  const count = Math.round(state.count ?? defaultInstrumentState.count);

  if (state.shape === "rect") {
    if (count >= 90) return "rect-orbit";
    if (count >= 70) return "rect-matrix";
    if (count >= 50) return "rect-stack";
    if (count >= 30) return "rect-kaleid";
    return "rect-ribbon";
  }

  if (state.shape === "circle") {
    if (count >= 90) return "circle-matrix";
    if (count >= 70) return "circle-kaleid";
    if (count >= 50) return "circle-dial";
    if (count >= 30) return "circle-balls";
    return "circle-orbit";
  }

  if (count >= 90) return "line-dial";
  if (count >= 70) return "line-matrix";
  if (count >= 50) return "line-spiral";
  if (count >= 30) return "line-ring";
  return "line-wave";
}

export function mergePreviewIntoInstrument(
  shared: ArtInstrumentState,
  descriptorId: string,
  preserveCurrentVariant = false,
) {
  const descriptor = findPreviewDescriptor(descriptorId);

  if (preserveCurrentVariant) {
    return sanitizeInstrumentState(shared);
  }

  return sanitizeInstrumentState({
    ...shared,
    ...descriptor.overrides,
  });
}

export function createPreviewState(
  active: ArtInstrumentState,
  descriptorId: string,
  activePreviewId: string,
) {
  if (descriptorId === activePreviewId) {
    return sanitizeInstrumentState(active);
  }

  const descriptor = findPreviewDescriptor(descriptorId);

  return sanitizeInstrumentState({
    ...active,
    ...descriptor.overrides,
  });
}

export function drawInstrumentArt(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  fg: string,
  bg: string,
  state: ArtInstrumentState,
  time: number,
  pointer: PointerVector,
): void {
  const instrument = sanitizeInstrumentState(state);
  const minDim = Math.min(w, h);
  const pointerX = clamp(
    pointer.x * pointer.influence + instrument.mouseX * (1 - pointer.influence),
    0,
    1,
  );
  const pointerY = clamp(
    pointer.y * pointer.influence + instrument.mouseY * (1 - pointer.influence),
    0,
    1,
  );
  const centerX = w / 2 + instrument.left;
  const centerY = h / 2 + instrument.top;
  const baseShapeSize = minDim * 0.1;
  const baseAmplitude = minDim * 0.26;
  const baseRadius = Math.max(1, instrument.scale * baseShapeSize);
  const frame = time * 1000;
  let shapeCount = Math.max(12, Math.round(instrument.count));

  if (instrument.isDial) {
    shapeCount = Math.max(8, Math.round(shapeCount * 0.2));
  } else if (instrument.isMatrix) {
    shapeCount = Math.max(24, Math.round(shapeCount * 2.6));
  }

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = fg;
  ctx.fillStyle = fg;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const kaleids = Math.max(1, Math.round(instrument.kaleids));

  for (let mirror = 0; mirror < kaleids; mirror++) {
    if (kaleids > 1) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((mirror / kaleids) * Math.PI * 2);
      ctx.translate(-centerX, -centerY);
    }

    let ampX = baseAmplitude * instrument.ampX * (pointerX - 0.5) * 4;
    let ampY = baseAmplitude * instrument.ampY * (pointerY - 0.5) * 4;

    if (
      instrument.isDial ||
      instrument.isSpiral ||
      instrument.isMatrix ||
      instrument.isBalls
    ) {
      ampX = 0;
      ampY = 0;
    }

    for (let index = 0; index < shapeCount; index++) {
      const angle = (index / shapeCount) * Math.PI * 2 + frame * 0.003 * instrument.velocity;
      let shapeX = centerX + Math.cos(angle * instrument.freq) * ampX;
      let shapeY = centerY + Math.sin(angle * instrument.freq) * ampY;

      if (instrument.axis === "x") {
        shapeX =
          centerX +
          (((index / shapeCount - 0.5) * w) / 2) * 4 * (pointerX - 0.5);
      }

      if (instrument.axis === "y") {
        shapeY =
          centerY +
          (((index / shapeCount - 0.5) * h) / 2) * 4 * (pointerY - 0.5);
      }

      const lump =
        Math.sin(frame * 0.002 + index / (Math.PI * Math.max(instrument.freq, 0.4))) *
        instrument.lump *
        baseRadius;
      const noiseWave =
        1 +
        instrument.noise *
          (Math.sin(index * 0.13) * 13 +
            Math.sin(index * 1.57) * 6 +
            Math.sin(index * 0.71) * 0.31 +
            Math.sin(index * 0.33) * 1.7);
      let shapeRadiusX = Math.max(0, baseRadius + lump) + noiseWave;

      if (instrument.isDial) {
        shapeRadiusX = ((shapeCount - index) / shapeCount) * shapeRadiusX * 2;
      }

      const shapeRadiusY = shapeRadiusX / Math.max(Math.abs(instrument.aspectRatio), 0.01);

      if (instrument.isMatrix) {
        const columnCount = Math.max(2, Math.floor(Math.sqrt(shapeCount)));
        const rowCount = Math.ceil(shapeCount / columnCount);
        const column = index % columnCount;
        const row = Math.floor(index / columnCount);
        const cellWidth = shapeRadiusX * 1.5;
        const cellHeight = Math.max(10, shapeRadiusY * 1.3);
        const gridWidth = (columnCount - 1) * cellWidth;
        const gridHeight = (rowCount - 1) * cellHeight;

        shapeX =
          centerX -
          gridWidth / 2 +
          column * cellWidth +
          Math.cos(column * 0.6 + frame * 0.002) * 10;
        shapeY =
          centerY -
          gridHeight / 2 +
          row * cellHeight +
          Math.sin(column * 0.6 + frame * 0.002) * 24;
      }

      ctx.save();
      ctx.beginPath();
      ctx.translate(shapeX, shapeY);
      ctx.rotate(index * instrument.twist * 0.03 + frame * instrument.twirl * 0.03);
      ctx.lineWidth = 0.4;

      if (instrument.shape === "rect") {
        ctx.rect(
          -shapeRadiusX,
          -shapeRadiusY,
          shapeRadiusX * 2,
          (shapeRadiusY * 2) / Math.max(Math.abs(instrument.aspectRatio), 0.01),
        );
        if (!instrument.isLineart) ctx.fill();
        ctx.stroke();
        ctx.restore();
        continue;
      }

      if (instrument.shape === "circle") {
        drawCircleBranch(ctx, instrument, shapeCount, index, shapeRadiusX, shapeRadiusY, frame);
        ctx.restore();
        continue;
      }

      drawLineBranch(ctx, shapeRadiusY, instrument.isLineart);
      ctx.restore();
    }

    if (kaleids > 1) {
      ctx.restore();
    }
  }

  ctx.globalAlpha = 1;
}

function drawCircleBranch(
  ctx: CanvasRenderingContext2D,
  instrument: ArtInstrumentState,
  shapeCount: number,
  index: number,
  shapeRadiusX: number,
  shapeRadiusY: number,
  frame: number,
) {
  const safeAspect = Math.max(Math.abs(instrument.aspectRatio), 0.01);

  if (instrument.isDial) {
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.abs(shapeRadiusX), Math.abs(shapeRadiusY), 0, 0, Math.PI * 2);
    if (!instrument.isLineart) ctx.fill();
    ctx.stroke();

    const spokeCount =
      3 +
      Math.floor(
        (Math.sin((shapeCount - index) * Math.max(instrument.noise, 0.01)) + 2) * 12 +
          shapeCount -
          index,
      );

    for (let spoke = 0; spoke < spokeCount; spoke++) {
      const lineAngle = (spoke / spokeCount + (frame + index * 15) * 0.001) * Math.PI * 2;
      const x = Math.cos(lineAngle) * Math.abs(shapeRadiusX);
      const y = Math.sin(lineAngle) * Math.abs(shapeRadiusY);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    return;
  }

  if (instrument.isSpiral) {
    for (let step = 0; step < 6; step++) {
      const spiralAngle = (step / 6 + (frame + index * 25) * 0.001) * Math.PI * 2;
      const x =
        Math.cos(spiralAngle) * Math.abs(shapeRadiusX) * (index / shapeCount) * instrument.ampX;
      const y =
        Math.sin(spiralAngle) *
        (Math.abs(shapeRadiusY) / safeAspect) *
        (index / shapeCount) *
        instrument.ampY;
      const dotRadiusX = 8 + Math.sin(index / 20 + frame * 0.003) * 3;
      const dotRadiusY = dotRadiusX * instrument.aspectRatio;

      ctx.beginPath();
      ctx.ellipse(x, y, Math.max(0, dotRadiusX), Math.max(0, dotRadiusY), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    return;
  }

  ctx.beginPath();
  ctx.ellipse(
    0,
    0,
    Math.abs(shapeRadiusX),
    Math.abs(shapeRadiusY) / safeAspect,
    0,
    0,
    Math.PI * 2,
  );
  if (!instrument.isLineart) ctx.fill();
  ctx.stroke();

  if (!instrument.isBalls) {
    return;
  }

  const layers = [
    { y: -0.1, width: 0.995, height: 0.5, start: Math.PI + 0.1, end: -0.1 },
    { y: 0.4, width: 0.92, height: 0.4, start: Math.PI, end: 0 },
    { y: 0.8, width: 0.6, height: 0.2, start: Math.PI, end: 0 },
  ];

  for (const layer of layers) {
    ctx.beginPath();
    ctx.ellipse(
      0,
      (Math.abs(shapeRadiusY) / safeAspect) * layer.y,
      Math.abs(shapeRadiusX) * layer.width,
      (Math.abs(shapeRadiusY) / safeAspect) * layer.height,
      0,
      layer.start,
      layer.end,
    );
    if (!instrument.isLineart) ctx.fill();
    ctx.stroke();
  }
}

function drawLineBranch(
  ctx: CanvasRenderingContext2D,
  shapeRadiusY: number,
  isLineart: boolean,
) {
  ctx.beginPath();
  ctx.ellipse(0, 0, 0.2, Math.max(0, shapeRadiusY), 0, 0, Math.PI * 2);
  if (!isLineart) ctx.fill();
  ctx.stroke();
}

function normalizeExclusiveModes(state: ArtInstrumentState) {
  const modePriority: Array<keyof Pick<
    ArtInstrumentState,
    "isMatrix" | "isDial" | "isSpiral" | "isBalls" | "isRing"
  >> = ["isMatrix", "isDial", "isSpiral", "isBalls", "isRing"];
  const activeMode = modePriority.find((key) => state[key]) ?? null;

  for (const key of modePriority) {
    state[key] = key === activeMode;
  }

  if (state.isRing) {
    state.axis = "xy";
  } else if (state.isDial || state.isSpiral || state.isBalls || state.isMatrix) {
    state.axis = "x";
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
