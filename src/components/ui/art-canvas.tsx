"use client";

import Link from "next/link";
import { RiSettings3Line } from "@remixicon/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { drawAlgoArtFrame } from "@/lib/art-algo-draw";
import {
  getAssignment,
  normalizeArtAssignment,
  type ArtAssignment,
  type ArtConfig,
} from "@/lib/art-assignments";
import { buildArtEditorHref } from "@/lib/art-config-url";
import { DiscreteFieldPreview } from "./discrete-field-preview";

interface ArtCanvasProps {
  slug: string;
  assignmentKey?: string;
  height?: number;
  serverConfig?: ArtConfig | null;
  showEditorLink?: boolean;
}

export function ArtCanvas({
  slug,
  assignmentKey,
  height = 110,
  serverConfig,
  showEditorLink = false,
}: ArtCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const normalizedServerConfig = useMemo(
    () => normalizeArtAssignment(serverConfig ?? null),
    [serverConfig],
  );
  const effectiveAssignmentKey = assignmentKey ?? slug;
  const [localAssignment, setLocalAssignment] = useState<ArtAssignment | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    setLocalAssignment(getAssignment(effectiveAssignmentKey, slug));
  }, [effectiveAssignmentKey, slug]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const assignment = localAssignment ?? normalizedServerConfig;
  const editorHref = useMemo(() => {
    if (!showEditorLink) return null;

    return buildArtEditorHref({
      slug,
      assignment,
    });
  }, [assignment, showEditorLink, slug]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !assignment) return;

    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const heightValue = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = heightValue * dpr;
    });

    resizeObserver.observe(container);

    let frameId = 0;
    const velocityMultiplier = reducedMotion ? 0 : 1;

    const draw = () => {
      const width = container.clientWidth;
      const heightValue = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      const context = canvas.getContext("2d");

      if (!context || width === 0 || heightValue === 0) {
        frameId = requestAnimationFrame(draw);
        return;
      }

      if (canvas.width !== width * dpr || canvas.height !== heightValue * dpr) {
        canvas.width = width * dpr;
        canvas.height = heightValue * dpr;
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      drawAlgoArtFrame({
        ctx: context,
        canvas,
        logicalWidth: width,
        logicalHeight: heightValue,
        config: assignment.config,
        frame: frameRef.current,
        canvasIndex: assignment.heroCanvasIndex,
        velocityMultiplier,
      });

      frameRef.current += 1;
      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [assignment, reducedMotion]);

  if (!assignment) {
    return (
      <div className="relative">
        <DiscreteFieldPreview slug={slug} height={height} />
        {editorHref && <EditorLink href={editorHref} />}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ width: "100%", height, overflow: "hidden" }}
      aria-hidden={editorHref ? undefined : true}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {editorHref && <EditorLink href={editorHref} />}
    </div>
  );
}

function EditorLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      aria-label="Open art editor"
      className="absolute right-2 top-2 z-10 inline-flex aspect-square w-7 items-center justify-center rounded-full bg-[var(--scaffold-toggle-track)] text-[var(--scaffold-toggle-text-inactive)] transition-colors hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]"
    >
      <RiSettings3Line className="h-4 w-4" />
    </Link>
  );
}
