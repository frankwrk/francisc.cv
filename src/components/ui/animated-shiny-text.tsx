"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type AnimatedShinyTextProps = HTMLAttributes<HTMLSpanElement>;

export function AnimatedShinyText({
  className,
  ...props
}: AnimatedShinyTextProps) {
  return (
    <span
      className={cn("assistant-shiny-text inline-flex items-center", className)}
      {...props}
    />
  );
}
