"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cpu, UserRound } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import * as ButtonGroup from "@/components/ui/button-group";
import { EncryptedText } from "@/components/machine/encrypted-text";
import { cn } from "@/utils/cn";

type SiteVersion = "human" | "machine";

type MachineModeContextValue = {
  mode: SiteVersion;
  displayMode: SiteVersion;
  switchMode: (nextMode: SiteVersion) => void;
};

const MachineModeContext = createContext<MachineModeContextValue | null>(null);

function MachineVersionToggle() {
  const ctx = useMachineMode();

  return (
    <div
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[90]"
      data-oid="74ojnxl"
    >
      <ButtonGroup.Root
        size="xsmall"
        aria-label="Site version"
        className="rounded-xl border border-[oklch(0.9128_0_89.88)] bg-[color-mix(in_oklab,var(--scaffold-surface)_90%,var(--scaffold-bg))] p-0.5 shadow-[0_12px_30px_-18px_rgba(14,18,27,0.35)] backdrop-blur-md dark:border-[oklch(0.3052_0_89.88)]"
        data-oid="qkk6qqv"
      >
        <ButtonGroup.Item
          type="button"
          data-state={ctx.displayMode === "human" ? "on" : "off"}
          aria-pressed={ctx.displayMode === "human"}
          onClick={() => ctx.switchMode("human")}
          className="border-transparent bg-[color-mix(in_oklab,var(--scaffold-surface)_94%,var(--scaffold-bg))] text-[oklch(0.5521_0_89.88)] hover:text-[oklch(0.5521_0_89.88)] data-[state=on]:text-[oklch(0.5521_0_89.88)] dark:text-[oklch(0.65_0_89.88)] dark:hover:text-[oklch(0.65_0_89.88)] dark:data-[state=on]:text-[oklch(0.65_0_89.88)]"
          data-oid="gcvt9g1"
        >
          <ButtonGroup.Icon as={UserRound} aria-hidden data-oid="1dv_qdb" />
          <span data-oid="aitur5j">HUMAN</span>
        </ButtonGroup.Item>
        <ButtonGroup.Item
          type="button"
          data-state={ctx.displayMode === "machine" ? "on" : "off"}
          aria-pressed={ctx.displayMode === "machine"}
          onClick={() => ctx.switchMode("machine")}
          className="border-transparent bg-[color-mix(in_oklab,var(--scaffold-surface)_94%,var(--scaffold-bg))] text-[oklch(0.5521_0_89.88)] hover:text-[oklch(0.5521_0_89.88)] data-[state=on]:text-[oklch(0.5521_0_89.88)] dark:text-[oklch(0.65_0_89.88)] dark:hover:text-[oklch(0.65_0_89.88)] dark:data-[state=on]:text-[oklch(0.65_0_89.88)]"
          data-oid="zi4vrwk"
        >
          <ButtonGroup.Icon as={Cpu} aria-hidden data-oid=":g6:mk9" />
          <span data-oid="st7aj9o">MACHINE</span>
        </ButtonGroup.Item>
      </ButtonGroup.Root>
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
  const label =
    loadingTarget === "machine"
      ? "Loading Machine version"
      : "Loading Human version";

  return (
    <AnimatePresence data-oid="ygcy.y1">
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
            backgroundColor:
              resolvedTheme === "dark"
                ? "rgba(10, 10, 10, 0.92)"
                : "rgba(250, 250, 250, 0.92)",
          }}
          data-oid="8h.lvd-"
        >
          <EncryptedText
            text={label}
            className="text-[11px] tracking-[0.2em] text-[var(--scaffold-toggle-text-active)] [font-family:var(--font-geist-pixel-circle)]"
            data-oid="hgei2.l"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MachineSurface({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const machineSurfaceBackground =
    resolvedTheme === "dark" ? "#0A0A0A" : "#FAFAFA";

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-y-auto px-4 py-5 md:px-8 md:py-8"
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
      style={{ backgroundColor: machineSurfaceBackground }}
      data-oid="7h8m6p5"
    >
      <div
        className="mx-auto max-w-[980px] border border-[var(--scaffold-line)] p-5 md:p-8"
        style={{ backgroundColor: machineSurfaceBackground }}
        data-oid="4j4wa:j"
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
    <MachineModeContext.Provider value={value} data-oid="a-oxcah">
      {children}
      <AnimatePresence data-oid="ga_jtbo">
        {mode === "machine" ? (
          <MachineSurface data-oid="w44cou_">{machineContent}</MachineSurface>
        ) : null}
      </AnimatePresence>
      <MachineLoadingOverlay loadingTarget={loadingTarget} data-oid="8dvkvy4" />
      <MachineVersionToggle data-oid="1t6pras" />
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
      <span className={className} data-oid="q:_tk5_">
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
        data-oid=":ki9bt4"
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
      data-oid="f1.lk-0"
    >
      {children}
    </a>
  );
}
