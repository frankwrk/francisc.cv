"use client";

import { useRef, useEffect, useState } from "react";
import { getAssignment, drawFromConfig, type ArtConfig } from "@/lib/art-assignments";
import { DiscreteFieldPreview } from "./discrete-field-preview";

interface ArtCanvasProps {
  slug: string;
  height?: number;
  /**
   * Config sourced from the committed src/config/art-assignments.ts file,
   * passed in by the server component parent. When present it takes full
   * precedence — no localStorage read occurs. This is what makes assignments
   * persistent across devices and deployments.
   *
   * When absent (e.g. on the /art lab page) the component falls back to
   * localStorage so live preview still works while designing.
   */
  serverConfig?: ArtConfig | null;
}

export function ArtCanvas({ slug, height = 110, serverConfig }: ArtCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  // If serverConfig is explicitly provided (even as null) we know we're in a
  // server-driven context. Only fall back to localStorage when it's undefined.
  const isServerDriven = serverConfig !== undefined;
  const [config, setConfig] = useState<ArtConfig | null>(
    isServerDriven ? (serverConfig ?? null) : null,
  );

  useEffect(() => {
    if (isServerDriven) {
      setConfig(serverConfig ?? null);
    } else {
      setConfig(getAssignment(slug));
    }
  }, [slug, serverConfig, isServerDriven]);

  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !config) return;

    const dpr = window.devicePixelRatio || 1;
    const w   = container.clientWidth;
    const h   = container.clientHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const animated = config.animation?.enabled ?? false;
    const speed    = config.animation?.speed ?? 1;

    if (!animated) {
      drawFromConfig(ctx, w, h, config, 0);
      return;
    }

    // Animated mode: run RAF loop
    let time   = 0;
    let lastTs = 0;
    let frameId: number;

    function draw(ts: number) {
      const dt = Math.min(ts - lastTs, 100);
      lastTs = ts;
      time  += (dt / 1000) * speed;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFromConfig(ctx!, w, h, config!, time);
      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [config]);

  if (!config) {
    return <DiscreteFieldPreview slug={slug} height={height} />;
  }

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height, overflow: "hidden" }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
