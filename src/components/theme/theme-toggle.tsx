"use client";

import { RiEqualizer3Fill, RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";
import { useWebHaptics } from "web-haptics/react";
import * as SegmentedControl from "@/components/ui/segmented-control";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { trigger } = useWebHaptics();

  const value: "light" | "dark" | "system" =
    theme === "dark" ? "dark" : theme === "light" ? "light" : "system";

  return (
    <SegmentedControl.Root
      value={value}
      onValueChange={(nextValue) => {
        if (
          nextValue === "light" ||
          nextValue === "dark" ||
          nextValue === "system"
        ) {
          trigger([20, 60, 20]);
          setTheme(nextValue);
        }
      }}
      aria-label="Theme selection"
    >
      <SegmentedControl.List
        className="w-fit gap-2 rounded-full bg-[var(--scaffold-toggle-track)]"
        floatingBgClassName="rounded-full bg-[var(--scaffold-toggle-thumb)]"
      >
        <SegmentedControl.Trigger
          value="light"
          className="aspect-square w-7 text-[var(--scaffold-toggle-text-inactive)] data-[state=active]:text-[var(--scaffold-toggle-text-active)]"
          aria-label="Switch to light theme"
        >
          <RiSunLine className="h-4 w-4" aria-hidden />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger
          value="dark"
          className="aspect-square w-7 text-[var(--scaffold-toggle-text-inactive)] data-[state=active]:text-[var(--scaffold-toggle-text-active)]"
          aria-label="Switch to dark theme"
        >
          <RiMoonLine className="h-4 w-4" aria-hidden />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger
          value="system"
          className="aspect-square w-7 text-[var(--scaffold-toggle-text-inactive)] data-[state=active]:text-[var(--scaffold-toggle-text-active)]"
          aria-label="Use system theme"
        >
          <RiEqualizer3Fill className="h-4 w-4" aria-hidden />
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
}
