"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cpu, UserRound } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { siteScaffoldConfig } from "@/config/site-scaffold";
import { EncryptedText } from "@/components/machine/encrypted-text";
import { cn } from "@/utils/cn";

type SiteVersion = "human" | "machine";

type MachineModeContextValue = {
  mode: SiteVersion;
  displayMode: SiteVersion;
  switchMode: (nextMode: SiteVersion) => void;
};

const MachineModeContext = createContext<MachineModeContextValue | null>(null);

type MachineThemeCssVars = CSSProperties & {
  "--scaffold-bg": string;
  "--scaffold-surface": string;
  "--scaffold-line": string;
  "--scaffold-ruler": string;
  "--scaffold-toggle-text-active": string;
};

function getMachineThemeTokens(resolvedTheme: string | undefined) {
  const isDark = resolvedTheme === "dark";
  const palette = isDark
    ? siteScaffoldConfig.palette.dark
    : siteScaffoldConfig.palette.light;
  const backgroundColor = isDark ? "#0A0A0A" : "#FAFAFA";
  const overlayBackgroundColor = isDark
    ? "rgba(10, 10, 10, 0.92)"
    : "rgba(250, 250, 250, 0.92)";

  return {
    backgroundColor,
    overlayBackgroundColor,
    cssVars: {
      "--scaffold-bg": backgroundColor,
      "--scaffold-surface": backgroundColor,
      "--scaffold-line": palette.line,
      "--scaffold-ruler": palette.ruler,
      "--scaffold-toggle-text-active": palette.toggleTextActive,
    } satisfies MachineThemeCssVars,
  };
}

function MachineVersionToggle() {
  const ctx = useMachineMode();
  const isMachine = ctx.displayMode === "machine";

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[90]">
      <button
        type="button"
        onClick={() => ctx.switchMode(isMachine ? "human" : "machine")}
        aria-label={isMachine ? "Switch to human version" : "Switch to machine version"}
        className="flex items-center gap-1.5 rounded-xl bg-[color-mix(in_oklab,var(--scaffold-surface)_90%,var(--scaffold-bg))] px-3 py-2 text-[11px] tracking-[0.12em] text-[oklch(0.5521_0_89.88)] shadow-[0_12px_30px_-18px_rgba(14,18,27,0.35)] backdrop-blur-md transition duration-300 ease-out hover:text-[oklch(0.42_0_89.88)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--scaffold-ruler)] dark:text-[oklch(0.65_0_89.88)] dark:hover:text-[oklch(0.86_0_89.88)]"
      >
        {isMachine ? (
          <UserRound className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Cpu className="h-3.5 w-3.5" aria-hidden />
        )}
        <span>{isMachine ? "HUMAN" : "MACHINE"}</span>
      </button>
    </div>
  );
}

function MachineLoadingOverlay({
  loadingTarget,
}: {
  loadingTarget: SiteVersion | null;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const tokens = getMachineThemeTokens(resolvedTheme);
  const label =
    loadingTarget === "machine"
      ? "Loading Machine version"
      : "Loading Human version";

  return (
    <AnimatePresence>
      {loadingTarget ? (
        <motion.div
          key={loadingTarget}
          className="fixed inset-0 z-[80] flex items-center justify-center backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.18,
            ease: "easeOut",
          }}
          style={{
            ...tokens.cssVars,
            backgroundColor: tokens.overlayBackgroundColor,
          }}
         
        >
          <EncryptedText
            text={label}
            className="text-[11px] tracking-[0.2em] text-[var(--scaffold-toggle-text-active)]"
           
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MachineSurface({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const tokens = getMachineThemeTokens(resolvedTheme);

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-y-auto px-4 py-5 md:px-8 md:py-8"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
      style={{
        ...tokens.cssVars,
        backgroundColor: tokens.backgroundColor,
      }}
     
    >
      <div
        className="mx-auto max-w-[980px] border border-[var(--scaffold-line)] p-5 md:p-8"
        style={{ backgroundColor: tokens.backgroundColor }}
       
      >
        {children}
      </div>
    </motion.div>
  );
}

export function MachineModeController({
  children,
  machineContent,
}: {
  children: ReactNode;
  machineContent: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const { trigger } = useWebHaptics();
  const [mode, setMode] = useState<SiteVersion>("human");
  const [loadingTarget, setLoadingTarget] = useState<SiteVersion | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const clearExistingTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearExistingTimer, [clearExistingTimer]);

  const switchMode = useCallback(
    (nextMode: SiteVersion) => {
      if (nextMode === mode && loadingTarget === null) {
        return;
      }

      clearExistingTimer();
      setLoadingTarget(nextMode);
      trigger(nextMode === "machine" ? [20, 60, 20] : [40, 20]);

      const delay = prefersReducedMotion ? 120 : 900;

      timeoutRef.current = window.setTimeout(() => {
        setMode(nextMode);
        setLoadingTarget(null);
        timeoutRef.current = null;
      }, delay);
    },
    [clearExistingTimer, loadingTarget, mode, prefersReducedMotion, trigger],
  );

  const value = useMemo<MachineModeContextValue>(
    () => ({
      mode,
      displayMode: loadingTarget ?? mode,
      switchMode,
    }),
    [loadingTarget, mode, switchMode],
  );

  return (
    <MachineModeContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {mode === "machine" ? (
          <MachineSurface>{machineContent}</MachineSurface>
        ) : null}
      </AnimatePresence>
      <MachineLoadingOverlay loadingTarget={loadingTarget} />
      <MachineVersionToggle />
    </MachineModeContext.Provider>
  );
}

export function useMachineMode() {
  const value = useContext(MachineModeContext);

  if (!value) {
    throw new Error("useMachineMode must be used within MachineModeController");
  }

  return value;
}

export function MachineLink({
  href,
  children,
  className,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const { switchMode } = useMachineMode();

  if (!href) {
    return (
      <span className={className}>
        {children}
      </span>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link
        href={href}
        className={cn(
          "underline decoration-[var(--scaffold-line)] underline-offset-2",
          className,
        )}
        onClick={() => switchMode("human")}
       
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "underline decoration-[var(--scaffold-line)] underline-offset-2",
        className,
      )}
     
    >
      {children}
    </a>
  );
}
