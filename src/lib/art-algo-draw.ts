/**
 * Single-frame draw for algo-art. Shape per canvas is derived from index:
 * 0–4 rect, 5–9 ellipse, 10–14 line. Caller sets canvas size and ctx scale (e.g. dpr).
 */

import type { AlgoArtConfig } from "./art-algo-config";

const BASE_SHAPE_SIZE = 30;
const BASE_AMPLITUDE = 80;

export type AlgoArtShape = "rect" | "ellipse" | "line";

function shapeFromIndex(index: number): AlgoArtShape {
  if (index < 5) return "rect";
  if (index < 10) return "ellipse";
  return "line";
}

/**
 * Kaleidoscope: draw current canvas content at half res, then mirror/rotate
 * kaleids times into the full canvas.
 */
export function applyKaleidoscopeEffect(
  ctx: CanvasRenderingContext2D,
  kaleids: number,
  canvas: HTMLCanvasElement,
): void {
  const angle = (2 * Math.PI) / kaleids;
  const halfW = canvas.width * 0.5;
  const halfH = canvas.height * 0.5;
  const temp = document.createElement("canvas");
  temp.width = halfW;
  temp.height = halfH;
  const tempCtx = temp.getContext("2d");
  if (!tempCtx) return;
  tempCtx.drawImage(canvas, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < kaleids; i++) {
    ctx.save();
    ctx.translate(canvas.width / 4, canvas.height / 4);
    ctx.rotate(angle);
    ctx.rotate(i * angle);
    ctx.scale(1, -1);
    ctx.drawImage(
      temp,
      0, 0, temp.width, temp.height,
      -temp.width / 2, -temp.height / 2,
      temp.width / 2, temp.height / 2,
    );
    ctx.scale(-1, 1);
    ctx.drawImage(
      temp,
      0, 0, temp.width, temp.height,
      -temp.width / 2, -temp.height / 2,
      temp.width / 2, temp.height / 2,
    );
    ctx.restore();
  }
}

export interface DrawAlgoArtFrameParams {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  logicalWidth: number;
  logicalHeight: number;
  config: AlgoArtConfig;
  frame: number;
  canvasIndex: number;
  velocityMultiplier: number;
}

/**
 * Draw one frame for one of the 15 canvases. ctx should already be scaled by
 * device pixel ratio; canvas width/height are logicalWidth*dpr, logicalHeight*dpr.
 */
export function drawAlgoArtFrame(params: DrawAlgoArtFrameParams): void {
  const {
    ctx,
    canvas,
    logicalWidth,
    logicalHeight,
    config,
    frame,
    canvasIndex,
    velocityMultiplier,
  } = params;

  const shape = shapeFromIndex(canvasIndex);
  const canvasCenterX = logicalWidth / 2;
  const canvasCenterY = logicalHeight / 2;
  const baseRadius = config.scale * BASE_SHAPE_SIZE;
  const waveCenterX = canvasCenterX + config.left;
  const waveCenterY = canvasCenterY + config.top;

  ctx.clearRect(0, 0, logicalWidth, logicalHeight);
  ctx.strokeStyle = "#1d1d1d";
  ctx.lineWidth = 0.4;
  ctx.fillStyle = "#efefef";

  let shapeCount =
    config.count +
    Math.floor((config.count * (0.5 + (canvasIndex % 5) - 2)) / 2);
  if (config.isDial) shapeCount = shapeCount * 0.2;
  else if (config.isMatrix) shapeCount = shapeCount * 4;

  let ampX =
    BASE_AMPLITUDE * config.ampX * (config.mouseX - 0.5) * 4;
  let ampY =
    BASE_AMPLITUDE * config.ampY * (config.mouseY - 0.5) * 4;
  if (config.isDial || config.isSpiral || config.isMatrix) {
    ampX = 0;
    ampY = 0;
  }

  for (let i = 0; i < shapeCount; i++) {
    const angle =
      (i / shapeCount) * Math.PI * 2 + frame * 0.003 * velocityMultiplier;
    let shapeX =
      waveCenterX + Math.cos(angle * config.freq) * ampX;
    let shapeY =
      waveCenterY + Math.sin(angle * config.freq) * ampY;
    if (config.axis === "x") {
      shapeX =
        waveCenterX +
        ((i / shapeCount - 0.5) * logicalWidth / 2) * 4 * (config.mouseX - 0.5);
    }
    if (config.axis === "y") {
      shapeY =
        waveCenterY +
        ((i / shapeCount - 0.5) * logicalHeight / 2) * 4 * (config.mouseY - 0.5);
    }

    const lump =
      Math.sin(frame * 0.002 + i / (Math.PI * config.freq)) * config.lump * baseRadius;
    const noiseWave =
      1 +
      config.noise *
        (Math.sin(i * 0.13) * 13 +
          Math.sin(i * 1.57) * 6 +
          Math.sin(i * 0.71) * 0.31 +
          Math.sin(i * 0.33) * 1.7);
    let shapeRadiusX = Math.max(0, baseRadius + lump) + noiseWave;
    if (config.isDial) {
      shapeRadiusX = ((shapeCount - i) / shapeCount) * shapeRadiusX * 2;
    }
    const shapeRadiusY = shapeRadiusX / config.aspectRatio;

    if (config.isMatrix) {
      const colCount = Math.floor(Math.sqrt(shapeCount));
      const col = i % Math.floor(Math.sqrt(shapeCount));
      shapeX =
        (col * shapeRadiusX * 1.5 +
          Math.cos(col * 0.6 + frame * 0.002) * 10 +
          config.left) *
        config.ampX;
      shapeY =
        (Math.floor(i / colCount) * shapeRadiusY +
          Math.sin(col * 0.6 + frame * 0.002) * 40 +
          config.top) *
        config.ampY;
    }

    ctx.beginPath();
    ctx.save();
    ctx.translate(shapeX, shapeY);
    ctx.rotate(
      i * config.twist * 0.03 + frame * config.twirl * 0.03 * velocityMultiplier,
    );

    if (shape === "rect") {
      ctx.rect(
        -shapeRadiusX,
        -shapeRadiusY,
        shapeRadiusX * 2,
        (shapeRadiusY * 2) / config.aspectRatio,
      );
      ctx.restore();
      if (!config.isLineart) ctx.fill();
      ctx.stroke();
    } else if (shape === "ellipse") {
      if (config.isDial) {
        ctx.ellipse(
          0, 0,
          Math.abs(shapeRadiusX),
          Math.abs(shapeRadiusY),
          0, 0, Math.PI * 2,
        );
        if (!config.isLineart) ctx.fill();
        ctx.stroke();
        const lineCount =
          3 +
          Math.floor(
            (Math.sin((shapeCount - i) * config.noise) + 2) * 12 + shapeCount - i,
          );
        for (let j = 0; j < lineCount; j++) {
          const lineAngle =
            (j / lineCount + (frame + i * 15) * 0.001) * Math.PI * 2;
          const x = Math.cos(lineAngle) * Math.abs(shapeRadiusX);
          const y = Math.sin(lineAngle) * Math.abs(shapeRadiusY);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        ctx.restore();
      } else if (config.isSpiral) {
        for (let j = 0; j < 6; j++) {
          const spiralAngle =
            (j / 6 + (frame + i * 25) * 0.001) * Math.PI * 2;
          const x =
            Math.cos(spiralAngle) *
            Math.abs(shapeRadiusX) *
            (i / shapeCount) *
            config.ampX;
          const y =
            Math.sin(spiralAngle) *
            (Math.abs(shapeRadiusY) / Math.abs(config.aspectRatio)) *
            (i / shapeCount) *
            config.ampY;
          const dotRadiusX =
            8 + Math.sin(i / 20 + frame * 0.003) * 3;
          const dotRadiusY = dotRadiusX * config.aspectRatio;
          ctx.beginPath();
          ctx.ellipse(
            x, y,
            Math.max(0, dotRadiusX),
            Math.max(0, dotRadiusY),
            0, 0, Math.PI * 2,
          );
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      } else {
        ctx.ellipse(
          0, 0,
          Math.abs(shapeRadiusX),
          Math.abs(shapeRadiusY) / Math.abs(config.aspectRatio),
          0, 0, Math.PI * 2,
        );
        if (!config.isLineart) ctx.fill();
        ctx.stroke();
        if (config.isBalls) {
          ctx.beginPath();
          ctx.ellipse(
            0,
            (Math.abs(shapeRadiusY) / Math.abs(config.aspectRatio)) * -0.1,
            Math.abs(shapeRadiusX) * 0.995,
            (Math.abs(shapeRadiusY) / Math.abs(config.aspectRatio)) * 0.5,
            0, Math.PI + 0.1, -0.1,
          );
          if (!config.isLineart) ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(
            0,
            (Math.abs(shapeRadiusY) / Math.abs(config.aspectRatio)) * 0.4,
            Math.abs(shapeRadiusX) * 0.92,
            (Math.abs(shapeRadiusY) / Math.abs(config.aspectRatio)) * 0.4,
            0, Math.PI, 0,
          );
          if (!config.isLineart) ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(
            0,
            (Math.abs(shapeRadiusY) / Math.abs(config.aspectRatio)) * 0.8,
            Math.abs(shapeRadiusX) * 0.6,
            (Math.abs(shapeRadiusY) / Math.abs(config.aspectRatio)) * 0.2,
            0, Math.PI, 0,
          );
          if (!config.isLineart) ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
    } else {
      ctx.ellipse(
        0, 0,
        0.2,
        Math.max(0, shapeRadiusY),
        0, 0, Math.PI * 2,
      );
      ctx.restore();
      if (!config.isLineart) ctx.fill();
      ctx.stroke();
    }
  }

  const kaleids = Math.floor(config.kaleids);
  if (kaleids > 1) {
    applyKaleidoscopeEffect(ctx, kaleids, canvas);
  }
}
