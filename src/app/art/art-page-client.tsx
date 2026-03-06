"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ALGO_ART_PROPS_META,
  clampAlgoArtConfig,
  DEFAULT_ALGO_ART_CONFIG,
  type AlgoArtAxis,
  type AlgoArtConfig,
  type AlgoArtPropMeta,
} from "@/lib/art-algo-config";
import { drawAlgoArtFrame } from "@/lib/art-algo-draw";
import styles from "./art.module.css";

const LOGICAL_WIDTH = 340;
const LOGICAL_HEIGHT = 270;
const CANVAS_COUNT = 15;

function getPropValue(config: AlgoArtConfig, key: keyof AlgoArtConfig): number | boolean | string {
  return config[key] as number | boolean | string;
}

function clampNumber(value: number, meta: AlgoArtPropMeta): number {
  if (meta.range !== undefined) {
    return Math.min(Math.max(value, meta.range[0]), meta.range[1]);
  }
  const min = meta.min ?? -Infinity;
  const max = meta.max ?? Infinity;
  return Math.min(Math.max(value, min), max);
}

function incrementProp(config: AlgoArtConfig, meta: AlgoArtPropMeta, delta: number): AlgoArtConfig {
  if (meta.type === "number") {
    const current = (config[meta.key as keyof AlgoArtConfig] as number) + delta;
    return { ...config, [meta.key]: clampNumber(current, meta) };
  }
  if (meta.type === "axis" && meta.enums && meta.enums.length > 0) {
    const current = config[meta.key as keyof AlgoArtConfig] as string;
    const idx = meta.enums.indexOf(current);
    const nextIdx = Math.max(0, Math.min(meta.enums.length - 1, idx + (delta > 0 ? 1 : -1)));
    return { ...config, [meta.key]: meta.enums[nextIdx] as AlgoArtAxis };
  }
  if (meta.type === "boolean") {
    return { ...config, [meta.key]: delta > 0 };
  }
  return config;
}

export function ArtPageClient() {
  const [config, setConfig] = useState<AlgoArtConfig>(() =>
    clampAlgoArtConfig({ ...DEFAULT_ALGO_ART_CONFIG }),
  );
  const [currentPropIndex, setCurrentPropIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  const configRef = useRef(config);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef(0);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    let rafId = 0;
    const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    const velocityMultiplier = reducedMotion ? 0 : 1;

    const tick = () => {
      frameRef.current += 1;
      const effectiveConfig: AlgoArtConfig = {
        ...configRef.current,
        mouseX: pointerRef.current.x,
        mouseY: pointerRef.current.y,
      };

      for (let i = 0; i < CANVAS_COUNT; i++) {
        const canvas = canvasRefs.current[i];
        if (!canvas) continue;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;

        const w = LOGICAL_WIDTH * dpr;
        const h = LOGICAL_HEIGHT * dpr;
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        drawAlgoArtFrame({
          ctx,
          canvas,
          logicalWidth: LOGICAL_WIDTH,
          logicalHeight: LOGICAL_HEIGHT,
          config: effectiveConfig,
          frame: frameRef.current,
          canvasIndex: i,
          velocityMultiplier,
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const meta = ALGO_ART_PROPS_META[currentPropIndex];
      if (!meta) return;
      const inc = meta.type === "number" && meta.increment ? meta.increment : 0.01;
      const delta = e.deltaY > 0 ? -inc : inc;
      setConfig((prev) => incrementProp(prev, meta, delta));
    },
    [currentPropIndex],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentPropIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCurrentPropIndex((i) =>
          Math.min(ALGO_ART_PROPS_META.length - 1, i + 1),
        );
      }
      if (e.key === "0") {
        e.preventDefault();
        const meta = ALGO_ART_PROPS_META[currentPropIndex];
        if (!meta) return;
        setConfig((prev) => ({
          ...prev,
          [meta.key]: meta.default,
        }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPropIndex]);

  const propList = useMemo(() => ALGO_ART_PROPS_META, []);

  return (
    <div className={styles.root} data-oid="art-lab-root">
      <aside
        className={styles.props}
        onWheel={handleWheel}
        role="group"
        aria-label="Art parameters"
      >
        {propList.map((meta, index) => {
          const value = getPropValue(config, meta.key);
          const isCurrent = index === currentPropIndex;
          return (
            <div
              key={meta.key}
              className={isCurrent ? `${styles.prop} ${styles.propCurrent}` : styles.prop}
            >
              <span className={styles.propLabel}>{meta.label}</span>
              <span className={styles.propValue}>
                {typeof value === "boolean" ? (value ? "on" : "off") : String(value)}
              </span>
            </div>
          );
        })}
      </aside>

      <div className={styles.canvases}>
        {Array.from({ length: CANVAS_COUNT }, (_, i) => (
          <div key={i} className={styles.canvasContainer}>
            <div
              className={styles.grid}
              style={{
                backgroundImage: "url(/art/grid.svg)",
                backgroundSize: "contain",
              }}
              aria-hidden="true"
            />
            <canvas
              ref={(el) => {
                canvasRefs.current[i] = el;
              }}
              className={styles.canvas}
              width={LOGICAL_WIDTH}
              height={LOGICAL_HEIGHT}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>

      <p className={styles.hint}>
        Scroll on the panel to adjust the selected parameter. Arrows: change
        parameter. 0: reset to default.
      </p>
    </div>
  );
}
