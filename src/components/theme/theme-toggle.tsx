"use client";

import { RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";
import { useWebHaptics } from "web-haptics/react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { trigger } = useWebHaptics();

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        trigger([20, 60, 20]);
        setTheme(isDark ? "light" : "dark");
      }}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--scaffold-toggle-text-inactive)] transition duration-300 ease-out hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--scaffold-ruler)]"
    >
      {isDark ? (
        <RiSunLine className="h-4 w-4" aria-hidden />
      ) : (
        <RiMoonLine className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
