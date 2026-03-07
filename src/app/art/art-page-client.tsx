"use client";

import {
  startTransition,
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
  type AlgoArtConfig,
  type AlgoArtPropMeta,
} from "@/lib/art-algo-config";
import { drawAlgoArtFrame } from "@/lib/art-algo-draw";
import {
  getAssignment,
  removeAssignment,
  saveAssignment,
  serializeAssignmentEntry,
  serializeAssignmentsModule,
  type ArtAssignment,
} from "@/lib/art-assignments";
import type { ArtTarget } from "@/lib/content";
import styles from "./art.module.css";

const LOGICAL_WIDTH = 340;
const LOGICAL_HEIGHT = 270;
const CANVAS_COUNT = 15;

function getPropValue(config: AlgoArtConfig, key: keyof AlgoArtConfig) {
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

function incrementProp(
  config: AlgoArtConfig,
  meta: AlgoArtPropMeta,
  delta: number,
): AlgoArtConfig {
  if (meta.type === "number") {
    const current = (config[meta.key] as number) + delta;
    return {
      ...config,
      [meta.key]: clampNumber(current, meta),
    };
  }

  if (meta.type === "axis" && meta.enums && meta.enums.length > 0) {
    const current = config[meta.key] as string;
    const currentIndex = meta.enums.indexOf(current);
    const nextIndex = Math.max(
      0,
      Math.min(meta.enums.length - 1, currentIndex + (delta > 0 ? 1 : -1)),
    );

    return {
      ...config,
      [meta.key]: meta.enums[nextIndex],
    };
  }

  if (meta.type === "boolean") {
    return {
      ...config,
      [meta.key]: delta > 0,
    };
  }

  return config;
}

function createAssignment(
  config: AlgoArtConfig,
  heroCanvasIndex: number,
): ArtAssignment {
  return {
    version: "algo-v1",
    heroCanvasIndex,
    config: clampAlgoArtConfig(config),
  };
}

function mergeAssignments(
  committedAssignments: Record<string, ArtAssignment>,
  localAssignments: Record<string, ArtAssignment>,
) {
  return {
    ...committedAssignments,
    ...localAssignments,
  };
}

async function copyText(text: string) {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard is unavailable in this environment.");
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    const copied = document.execCommand("copy");
    if (!copied) {
      throw new Error("Fallback clipboard copy failed.");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

function assignmentStatus(
  slug: string,
  committedAssignments: Record<string, ArtAssignment>,
  localAssignments: Record<string, ArtAssignment>,
) {
  const hasLocal = Boolean(localAssignments[slug]);
  const hasCommitted = Boolean(committedAssignments[slug]);

  if (hasLocal) return "local";
  if (hasCommitted) return "committed";
  return "none";
}

export function ArtPageClient({
  targets,
  committedAssignments,
  initialSlug,
  initialAssignment,
  hasInitialQueryAssignment,
}: {
  targets: ArtTarget[];
  committedAssignments: Record<string, ArtAssignment>;
  initialSlug: string | null;
  initialAssignment: ArtAssignment | null;
  hasInitialQueryAssignment: boolean;
}) {
  const [config, setConfig] = useState<AlgoArtConfig>(() =>
    initialAssignment?.config
      ? clampAlgoArtConfig(initialAssignment.config)
      : clampAlgoArtConfig({ ...DEFAULT_ALGO_ART_CONFIG }),
  );
  const [currentPropIndex, setCurrentPropIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  const [activeSlug, setActiveSlug] = useState<string>(initialSlug ?? "");
  const [selectedHeroCanvasIndex, setSelectedHeroCanvasIndex] = useState(
    initialAssignment?.heroCanvasIndex ?? 0,
  );
  const [localAssignments, setLocalAssignments] = useState<
    Record<string, ArtAssignment>
  >({});
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

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
    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      };
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    const nextAssignments: Record<string, ArtAssignment> = {};

    for (const target of targets) {
      const assignment = getAssignment(target.slug);
      if (assignment) {
        nextAssignments[target.slug] = assignment;
      }
    }

    startTransition(() => {
      setLocalAssignments(nextAssignments);

      if (
        !hasInitialQueryAssignment &&
        initialSlug &&
        nextAssignments[initialSlug]
      ) {
        setConfig(nextAssignments[initialSlug].config);
        setSelectedHeroCanvasIndex(nextAssignments[initialSlug].heroCanvasIndex);
      }
    });
  }, [hasInitialQueryAssignment, initialSlug, targets]);

  useEffect(() => {
    let timeoutId: number | null = null;

    if (copyFeedback) {
      timeoutId = window.setTimeout(() => setCopyFeedback(null), 2400);
    }

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [copyFeedback]);

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

      for (let index = 0; index < CANVAS_COUNT; index += 1) {
        const canvas = canvasRefs.current[index];
        if (!canvas) continue;

        const context = canvas.getContext("2d");
        if (!context) continue;

        const width = LOGICAL_WIDTH * dpr;
        const height = LOGICAL_HEIGHT * dpr;

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        drawAlgoArtFrame({
          ctx: context,
          canvas,
          logicalWidth: LOGICAL_WIDTH,
          logicalHeight: LOGICAL_HEIGHT,
          config: effectiveConfig,
          frame: frameRef.current,
          canvasIndex: index,
          velocityMultiplier,
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();

      const meta = ALGO_ART_PROPS_META[currentPropIndex];
      if (!meta) return;

      const increment =
        meta.type === "number" && meta.increment ? meta.increment : 0.01;
      const delta = event.deltaY > 0 ? -increment : increment;

      setConfig((previous) => incrementProp(previous, meta, delta));
    },
    [currentPropIndex],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setCurrentPropIndex((previous) => Math.max(0, previous - 1));
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setCurrentPropIndex((previous) =>
          Math.min(ALGO_ART_PROPS_META.length - 1, previous + 1),
        );
      }

      if (event.key === "0") {
        event.preventDefault();
        const meta = ALGO_ART_PROPS_META[currentPropIndex];
        if (!meta) return;

        setConfig((previous) => ({
          ...previous,
          [meta.key]: meta.default,
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPropIndex]);

  const activeTarget = targets.find((target) => target.slug === activeSlug) ?? null;
  const mergedAssignments = useMemo(
    () => mergeAssignments(committedAssignments, localAssignments),
    [committedAssignments, localAssignments],
  );
  const currentAssignment = useMemo(
    () => createAssignment(config, selectedHeroCanvasIndex),
    [config, selectedHeroCanvasIndex],
  );

  function handleLoadAssignment(slug: string) {
    const assignment = mergedAssignments[slug];
    setActiveSlug(slug);

    if (!assignment) return;

    setConfig(assignment.config);
    setSelectedHeroCanvasIndex(assignment.heroCanvasIndex);
  }

  function handleAssignCurrent(slug: string) {
    const assignment = createAssignment(config, selectedHeroCanvasIndex);
    saveAssignment(slug, assignment);
    setLocalAssignments((previous) => ({
      ...previous,
      [slug]: assignment,
    }));
    setActiveSlug(slug);
  }

  function handleClearLocal(slug: string) {
    removeAssignment(slug);

    setLocalAssignments((previous) => {
      const nextAssignments = { ...previous };
      delete nextAssignments[slug];
      return nextAssignments;
    });

    if (activeSlug === slug) {
      const fallback = committedAssignments[slug] ?? null;
      if (fallback) {
        setConfig(fallback.config);
        setSelectedHeroCanvasIndex(fallback.heroCanvasIndex);
      }
    }
  }

  async function handleCopyCurrentSlugSnippet() {
    if (!activeSlug) return;

    try {
      await copyText(serializeAssignmentEntry(activeSlug, currentAssignment));
      setCopyFeedback(`Copied snippet for ${activeSlug}.`);
    } catch {
      setCopyFeedback(`Could not copy snippet for ${activeSlug}.`);
    }
  }

  async function handleCopyFullExport() {
    try {
      await copyText(serializeAssignmentsModule(mergedAssignments));
      setCopyFeedback("Copied full art-assignments.ts export.");
    } catch {
      setCopyFeedback("Could not copy full art-assignments.ts export.");
    }
  }

  return (
    <div className={styles.root} data-oid="art-lab-root">
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>ART / HERO ASSIGNMENTS</p>
          <h1 className={styles.title}>Algorithmic hero-art editor</h1>
          <p className={styles.description}>
            Tune the shared lab parameters, choose which canvas becomes the hero,
            then assign the result to a work or thinking entry.
          </p>
        </div>

        <div className={styles.headerActions}>
          <label className={styles.targetPicker}>
            <span>Active target</span>
            <select
              value={activeSlug}
              onChange={(event) => setActiveSlug(event.target.value)}
            >
              <option value="">No active target</option>
              {targets.map((target) => (
                <option key={target.slug} value={target.slug}>
                  {target.type === "work" ? "Work" : "Thinking"} / {target.title}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.copyActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleCopyCurrentSlugSnippet}
              disabled={!activeSlug}
            >
              Copy Current Slug Snippet
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleCopyFullExport}
            >
              Copy Full art-assignments.ts Export
            </button>
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <aside
          className={styles.props}
          onWheel={handleWheel}
          role="group"
          aria-label="Art parameters"
        >
          <div className={styles.panelHeader}>
            <h2>Parameters</h2>
            <p>Scroll here to change the selected property. Arrow keys switch rows. `0` resets.</p>
          </div>

          <div className={styles.propList}>
            {ALGO_ART_PROPS_META.map((meta, index) => {
              const value = getPropValue(config, meta.key);
              const isCurrent = index === currentPropIndex;

              return (
                <button
                  key={meta.key}
                  type="button"
                  className={isCurrent ? styles.propCurrent : styles.prop}
                  onClick={() => setCurrentPropIndex(index)}
                >
                  <span className={styles.propLabel}>{meta.label}</span>
                  <span className={styles.propValue}>
                    {typeof value === "boolean"
                      ? value
                        ? "on"
                        : "off"
                      : String(value)}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className={styles.main}>
          <section className={styles.summaryPanel}>
            <div>
              <p className={styles.summaryLabel}>Current state</p>
              <p className={styles.summaryValue}>
                {activeTarget
                  ? `${activeTarget.type === "work" ? "Work" : "Thinking"} / ${activeTarget.title}`
                  : "No active target selected"}
              </p>
            </div>

            <div>
              <p className={styles.summaryLabel}>Hero canvas</p>
              <p className={styles.summaryValue}>Canvas {selectedHeroCanvasIndex + 1}</p>
            </div>

            <div>
              <p className={styles.summaryLabel}>Assignment source</p>
              <p className={styles.summaryValue}>
                {activeSlug
                  ? assignmentStatus(activeSlug, committedAssignments, localAssignments)
                  : "none"}
              </p>
            </div>

            {copyFeedback && <p className={styles.feedback}>{copyFeedback}</p>}
          </section>

          <section className={styles.canvases}>
            {Array.from({ length: CANVAS_COUNT }, (_, index) => {
              const isSelected = index === selectedHeroCanvasIndex;

              return (
                <button
                  key={index}
                  type="button"
                  className={isSelected ? styles.canvasSelected : styles.canvasCard}
                  onClick={() => setSelectedHeroCanvasIndex(index)}
                >
                  <span className={styles.canvasBadge}>
                    {isSelected ? "Hero" : `Canvas ${index + 1}`}
                  </span>
                  <div
                    className={styles.grid}
                    style={{
                      backgroundImage: "url(/art/grid.svg)",
                      backgroundSize: "contain",
                    }}
                    aria-hidden="true"
                  />
                  <canvas
                    ref={(element) => {
                      canvasRefs.current[index] = element;
                    }}
                    className={styles.canvas}
                    width={LOGICAL_WIDTH}
                    height={LOGICAL_HEIGHT}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </section>

          <section className={styles.assignmentPanel}>
            <div className={styles.panelHeader}>
              <h2>Assignments</h2>
              <p>
                Load an existing assignment, assign the current lab state to a target,
                or clear a local override before copying the merged export.
              </p>
            </div>

            <div className={styles.assignmentList}>
              {targets.map((target) => {
                const source = assignmentStatus(
                  target.slug,
                  committedAssignments,
                  localAssignments,
                );
                const isActive = target.slug === activeSlug;

                return (
                  <div
                    key={target.slug}
                    className={isActive ? styles.assignmentItemActive : styles.assignmentItem}
                  >
                    <div className={styles.assignmentMeta}>
                      <div className={styles.assignmentHead}>
                        <span className={styles.assignmentTitle}>{target.title}</span>
                        <span className={styles.assignmentType}>
                          {target.type === "work" ? "WORK" : "THINKING"}
                        </span>
                      </div>
                      <div className={styles.assignmentSubhead}>
                        <span>{target.slug}</span>
                        <span className={styles.assignmentSource}>{source}</span>
                      </div>
                    </div>

                    <div className={styles.assignmentActions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => handleLoadAssignment(target.slug)}
                        disabled={!mergedAssignments[target.slug]}
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => handleAssignCurrent(target.slug)}
                      >
                        Assign Current
                      </button>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => handleClearLocal(target.slug)}
                        disabled={!localAssignments[target.slug]}
                      >
                        Clear Local
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
