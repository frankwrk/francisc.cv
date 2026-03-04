"use client";

import { motion, useReducedMotion } from "motion/react";
import { siteSignatureConfig } from "@/config/site-signature";
import { cn } from "@/utils/cn";

const MASK_ID = "signature-draw-mask";

/** Dot center from rect transform "translate(228.03,23.91) rotate(-38.1)". */
const DOT_CENTER = { x: 228.03, y: 23.91 };
/** Start of second path (rest of name). */
const PATH2_START = "300 36.17";

/**
 * Build a single continuous path in draw order: F path → move to dot → line to path2 start → path2.
 * Used as the stroked path in the mask; pathLength 0→1 reveals the signature like one pen stroke.
 */
function getSignatureMaskPath(): string {
  const strokes = siteSignatureConfig.strokes;
  const path1 = strokes[0].kind === "path" ? strokes[0].d : "";
  const path2 = strokes[2].kind === "path" ? strokes[2].d : "";
  const path2Continued = path2.replace(/^M\s*(\S+)\s*(\S+)\s*/, "L $1 $2 ");
  return [
    path1,
    ` M ${DOT_CENTER.x} ${DOT_CENTER.y} L ${DOT_CENTER.x} ${DOT_CENTER.y} L ${PATH2_START} `,
    path2Continued,
  ].join("");
}

type SignatureProps = {
  className?: string;
};

export function Signature({ className }: SignatureProps) {
  const prefersReducedMotion = useReducedMotion();
  const maskPath = getSignatureMaskPath();

  const drawTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: siteSignatureConfig.totalDrawDuration,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      };

  return (
    <motion.svg
      viewBox={siteSignatureConfig.viewBox}
      fill="none"
      role="img"
      aria-label="Hand-drawn signature"
      className={cn("h-auto", className)}
      style={{ width: siteSignatureConfig.width }}
    >
      <defs>
        <mask id={MASK_ID}>
          <motion.path
            d={maskPath}
            fill="none"
            stroke="white"
            strokeWidth={siteSignatureConfig.maskStrokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={drawTransition}
          />
        </mask>
      </defs>
      <g mask={`url(#${MASK_ID})`}>
        {siteSignatureConfig.strokes.map((stroke, index) =>
          stroke.kind === "rect" ? (
            <rect
              key={`stroke-${index}`}
              x={stroke.x}
              y={stroke.y}
              width={stroke.width}
              height={stroke.height}
              rx={stroke.rx}
              transform={stroke.transform}
              fill="currentColor"
              stroke="none"
            />
          ) : (
            <path
              key={`stroke-${index}`}
              d={stroke.d}
              fill="currentColor"
              stroke="none"
            />
          )
        )}
      </g>
    </motion.svg>
  );
}
