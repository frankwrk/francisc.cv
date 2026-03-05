"use client";

import { useRef, useEffect, useState } from "react";
import { getAssignment, drawFromConfig, type ArtConfig } from "@/lib/art-assignments";
import { DiscreteFieldPreview } from "./discrete-field-preview";

interface ArtCanvasProps {
  slug: string;
  height?: number;
  /** Pass an explicit config to skip the localStorage lookup (used for forced previews). */
  config?: ArtConfig;
}

/**
 * Client component that renders the assigned art variant for a content slug.
 * Falls back to DiscreteFieldPreview when no assignment is stored and no
 * explicit config is given.
 */
export function ArtCanvas({ slug, height = 110, config: forcedConfig }: ArtCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const [config, setConfig] = useState<ArtConfig | null>(forcedConfig ?? null);

  useEffect(() => {
    if (forcedConfig) {
      setConfig(forcedConfig);
      return;
    }
    setConfig(getAssignment(slug));
  }, [slug, forcedConfig]);

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
    drawFromConfig(ctx, w, h, config);
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
