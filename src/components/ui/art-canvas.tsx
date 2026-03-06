"use client";

import Link from "next/link";
import { RiSettings3Line } from "@remixicon/react";
import { useRef, useEffect, useMemo } from "react";
import {
  getAssignment,
  deriveInstrumentConfig,
  drawFromConfig,
  type ArtConfig,
} from "@/lib/art-assignments";
import { buildArtEditorHref } from "@/lib/art-config-url";
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
  showEditorLink?: boolean;
}

export function ArtCanvas({
  slug,
  height = 110,
  serverConfig,
  showEditorLink = false,
}: ArtCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const config = useMemo<ArtConfig | null>(() => {
    const localConfig = getAssignment(slug);
    return localConfig ?? serverConfig ?? null;
  }, [slug, serverConfig]);
  const editorHref = useMemo(() => {
    if (!showEditorLink) return null;

    return buildArtEditorHref({
      slug,
      config: deriveInstrumentConfig(config),
    });
  }, [config, showEditorLink, slug]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !config) return;

    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const animated = config.animation?.enabled ?? false;
    const speed = config.animation?.speed ?? 1;

    if (!animated) {
      drawFromConfig(ctx, w, h, config, 0);
      return;
    }

    // Animated mode: run RAF loop
    let time = 0;
    let lastTs = 0;
    let frameId: number;

    function draw(ts: number) {
      const dt = Math.min(ts - lastTs, 100);
      lastTs = ts;
      time += (dt / 1000) * speed;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFromConfig(ctx!, w, h, config!, time);
      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, [config]);

  if (!config) {
    return (
      <div className="relative" data-oid="dx8d4h2">
        <DiscreteFieldPreview slug={slug} height={height} data-oid="38mbo18" />
        {editorHref && (
          <EditorLink href={editorHref} data-oid="h9ci7h3" />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ width: "100%", height, overflow: "hidden" }}
      aria-hidden={editorHref ? undefined : true}
      data-oid="5epvcc9"
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
        data-oid="7e6seo:"
      />
      {editorHref && <EditorLink href={editorHref} data-oid="taq42wk" />}
    </div>
  );
}

function EditorLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Open art editor"
      className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-none border border-white/30 bg-black/55 text-white/80 backdrop-blur transition-colors hover:border-white/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      data-oid="tpyuiwu"
    >
      <RiSettings3Line className="h-4 w-4" data-oid="v0pjbwf" />
    </Link>
  );
}
