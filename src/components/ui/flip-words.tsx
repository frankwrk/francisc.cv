"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/utils/cn";

type FlipWordsProps = {
  words: string[];
  duration?: number;
  className?: string;
};

export function FlipWords({
  words,
  duration = 2500,
  className,
}: FlipWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const startAnimation = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    const timeout = setTimeout(startAnimation, duration);
    return () => clearTimeout(timeout);
  }, [currentIndex, duration, startAnimation]);

  return (
    <AnimatePresence mode="wait" data-oid="i9tq7o_">
      <motion.span
        key={words[currentIndex]}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.2, ease: "easeInOut" }
        }
        className={cn("inline-block", className)}
        data-oid="3k0i0_7"
      >
        {words[currentIndex]}
      </motion.span>
    </AnimatePresence>
  );
}
