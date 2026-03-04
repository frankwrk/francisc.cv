"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/utils/cn";

type FlipWordsProps = {
  words: string[];
  duration?: number;
  className?: string;
};

export function FlipWords({ words, duration = 2500, className }: FlipWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const startAnimation = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  }, [words.length]);

  useEffect(() => {
    const timeout = setTimeout(startAnimation, duration);
    return () => clearTimeout(timeout);
  }, [currentIndex, duration, startAnimation]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[currentIndex]}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn("inline-block", className)}
      >
        {words[currentIndex]}
      </motion.span>
    </AnimatePresence>
  );
}
