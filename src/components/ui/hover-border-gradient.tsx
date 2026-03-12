"use client";
import React, { useState, useEffect } from "react";

import { motion, useReducedMotion } from "motion/react";
import { useWebHaptics } from "web-haptics/react";
import { useIsInViewport } from "@/hooks/use-is-in-viewport";
import { cn } from "@/utils/cn";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

type HoverBorderGradientProps<TTag extends React.ElementType> = {
  children: React.ReactNode;
  as?: TTag;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
} & Omit<React.ComponentPropsWithoutRef<TTag>, "as" | "className" | "children">;

export function HoverBorderGradient<TTag extends React.ElementType = "button">({
  children,
  containerClassName,
  className,
  as,
  duration = 1,
  clockwise = true,
  ...props
}: HoverBorderGradientProps<TTag>) {
  const Tag = (as ?? "button") as React.ElementType;
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");
  const { trigger } = useWebHaptics();
  const prefersReducedMotion = useReducedMotion();
  const { ref, isInView } = useIsInViewport<HTMLElement>();

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.199999999999996% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!isInView || hovered) {
      return;
    }

    const interval = setInterval(() => {
      setDirection((currentDirection) => {
        const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
        const currentIndex = directions.indexOf(currentDirection);
        const nextIndex = clockwise
          ? (currentIndex - 1 + directions.length) % directions.length
          : (currentIndex + 1) % directions.length;
        return directions[nextIndex];
      });
    }, duration * 1000);

    return () => clearInterval(interval);
  }, [clockwise, duration, hovered, isInView]);
  return (
    <Tag
      ref={ref}
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onClickCapture={() => trigger("success")}
      className={cn(
        "relative flex rounded-full border content-center items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit transition duration-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--scaffold-ruler)]",
        containerClassName,
      )}
      {...props}
     
    >
      <div
        className={cn(
          "z-10 w-auto rounded-[inherit] bg-[var(--scaffold-surface)] px-4 py-2 text-[var(--scaffold-toggle-text-active)]",
          className,
        )}
       
      >
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]",
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: prefersReducedMotion
            ? movingMap["TOP"]
            : hovered
              ? [movingMap[direction], highlight]
              : movingMap[direction],
        }}
        transition={{
          ease: "linear",
          duration: prefersReducedMotion ? 0 : (duration ?? 1),
        }}
       
      />

      <div
        className="absolute inset-[2px] z-[1] flex-none rounded-[100px] bg-[var(--scaffold-surface)]"
       
      />
    </Tag>
  );
}
