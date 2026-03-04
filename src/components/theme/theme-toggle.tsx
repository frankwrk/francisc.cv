"use client";

import { useTheme } from "next-themes";
import * as SegmentedControl from "@/components/ui/segmented-control";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const value = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <SegmentedControl.Root
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue === "light" || nextValue === "dark") {
          setTheme(nextValue);
        }
      }}
      className="w-[96px]"
      aria-label="Theme selection"
    >
      <SegmentedControl.List
        className="h-7 w-full rounded-full border border-[var(--scaffold-line)] bg-[var(--scaffold-toggle-track)] p-0.5"
        floatingBgClassName="inset-y-0.5 rounded-full border border-[var(--scaffold-line)] bg-[var(--scaffold-toggle-thumb)] shadow-none"
      >
        <SegmentedControl.Trigger
          value="light"
          className="h-6 rounded-full px-2.5 text-[10px] tracking-[0.18em] text-[var(--scaffold-toggle-text-inactive)] data-[state=active]:text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-circle)]"
          aria-label="Switch to light theme"
        >
          LIGHT
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger
          value="dark"
          className="h-6 rounded-full px-2.5 text-[10px] tracking-[0.18em] text-[var(--scaffold-toggle-text-inactive)] data-[state=active]:text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-circle)]"
          aria-label="Switch to dark theme"
        >
          DARK
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
}
