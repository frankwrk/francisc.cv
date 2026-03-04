"use client";

import { motion, useReducedMotion } from "motion/react";
import { siteSignatureConfig, type SiteSignatureStroke } from "@/config/site-signature";
import { cn } from "@/utils/cn";

type SignatureProps = {
  className?: string;
};

export function Signature({ className }: SignatureProps) {
  const prefersReducedMotion = useReducedMotion();
  const renderBaseStroke = (stroke: SiteSignatureStroke, key: string) => {
    if (stroke.kind === "rect") {
      return (
        <rect
          key={key}
          x={stroke.x}
          y={stroke.y}
          width={stroke.width}
          height={stroke.height}
          rx={stroke.rx}
          transform={stroke.transform}
          stroke="currentColor"
          strokeOpacity={siteSignatureConfig.baseOpacity}
          strokeWidth={siteSignatureConfig.strokeWidth}
          fill="none"
        />
      );
    }

    return (
      <path
        key={key}
        d={stroke.d}
        stroke="currentColor"
        strokeOpacity={siteSignatureConfig.baseOpacity}
        strokeWidth={siteSignatureConfig.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    );
  };

  const renderAnimatedStroke = (
    stroke: SiteSignatureStroke,
    index: number,
    key: string
  ) => {
    const transition = prefersReducedMotion
      ? { duration: 0 }
      : {
          duration: stroke.duration,
          ease: stroke.easing,
          delay: delayOffsets[index] ?? 0,
        };

    const animationProps = {
      initial: {
        pathLength: prefersReducedMotion ? 1 : 0,
        opacity: prefersReducedMotion ? siteSignatureConfig.animationOpacity : 0,
      },
      animate: {
        pathLength: 1,
        opacity: siteSignatureConfig.animationOpacity,
      },
      transition,
      stroke: "currentColor",
      strokeWidth: siteSignatureConfig.strokeWidth,
      fill: "none" as const,
    };

    if (stroke.kind === "rect") {
      return (
        <motion.rect
          key={key}
          x={stroke.x}
          y={stroke.y}
          width={stroke.width}
          height={stroke.height}
          rx={stroke.rx}
          transform={stroke.transform}
          {...animationProps}
        />
      );
    }

    return (
      <motion.path
        key={key}
        d={stroke.d}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...animationProps}
      />
    );
  };

  const delayOffsets = siteSignatureConfig.strokes.reduce<number[]>(
    (acc, stroke, index) => {
      if (index === 0) {
        acc.push(0);
        return acc;
      }

      const previous = siteSignatureConfig.strokes[index - 1];
      acc.push(acc[index - 1] + previous.duration + siteSignatureConfig.pathStagger);
      return acc;
    },
    []
  );

  return (
    <motion.svg
      viewBox={siteSignatureConfig.viewBox}
      fill="none"
      aria-label="Hand-drawn signature"
      className={cn("h-auto", className)}
      style={{ width: siteSignatureConfig.width }}
    >
      {siteSignatureConfig.strokes.map((stroke, index) =>
        renderBaseStroke(stroke, `base-${index}`)
      )}

      {siteSignatureConfig.strokes.map((stroke, index) =>
        renderAnimatedStroke(stroke, index, `animated-${index}`)
      )}
    </motion.svg>
  );
}
