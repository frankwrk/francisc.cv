"use client";

type ThemeMode = "system" | "light" | "dark";
const STORAGE_KEY = "francisc-theme";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (theme === "light" || theme === "dark") {
    root.classList.add(theme);
  }
}

function readThemeMode(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    // Ignore storage access errors.
  }
  return "system";
}

function nextTheme(current: ThemeMode): ThemeMode {
  if (current === "system") return "dark";
  if (current === "dark") return "light";
  return "system";
}

export function ThemeToggle() {
  function cycleTheme() {
    const current = readThemeMode();
    const next = nextTheme(current);

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage access errors.
    }

    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs text-muted transition-colors duration-150 hover:border-accent/40 hover:text-fg"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="font-mono">Theme</span>
      <span className="font-pixel text-[10px] uppercase tracking-[0.14em] text-fg">Cycle</span>
    </button>
  );
}
