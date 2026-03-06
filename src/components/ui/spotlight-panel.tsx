"use client";

import { type ReactNode, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

type SpotlightPanelProps = {
  children: ReactNode;
  className?: string;
  spotlightClassName?: string;
};

export function SpotlightPanel({
  children,
  className,
  spotlightClassName,
}: SpotlightPanelProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const spotlightAnimate = prefersReducedMotion
    ? { y: 0, opacity: 0.2 }
    : isHovered
      ? { y: -6, opacity: 0.34 }
      : { y: -18, opacity: 0.2 };

  return (
    <div
      className={cn(
        "group relative overflow-hidden border border-[var(--scaffold-line)] bg-[var(--scaffold-surface)]",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-oid="34k44n7"
    >
      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-8 top-0 h-32 rounded-full opacity-45 blur-3xl",
          spotlightClassName,
        )}
        initial={
          prefersReducedMotion
            ? { y: 0, opacity: 0.2 }
            : { y: -18, opacity: 0.2 }
        }
        animate={spotlightAnimate}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--scaffold-ruler) 24%, transparent) 0%, transparent 72%)",
        }}
        data-oid="i5c_htq"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--scaffold-line) 50%, transparent), transparent 28%)",
        }}
        data-oid="vdqe7g2"
      />

      <div className="relative z-10" data-oid="s6_j1dl">
        {children}
      </div>
    </div>
  );
}
