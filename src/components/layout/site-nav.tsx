"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useWebHaptics } from "web-haptics/react";
import { useAssistant } from "@/components/ai/assistant-context";
import { FlipWords } from "@/components/ui/flip-words";
import { cn } from "@/utils/cn";

const flipNavWords = ["Thinking", "Writing", "Notes"];

const links = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Resume", href: "/resume" },
  { label: "Thinking", href: "/thinking", flip: true },
];

const OUTSIDE_CLICK_GRACE_MS = 400;

export function SiteNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const openedAtRef = useRef<number>(0);
  const { trigger } = useWebHaptics();
  const prefersReducedMotion = useReducedMotion();
  const { openAssistant } = useAssistant();

  useEffect(() => {
    if (!isOpen) return;
    openedAtRef.current = Date.now();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (navRef.current?.contains(e.target as Node)) return;
      if (Date.now() - openedAtRef.current < OUTSIDE_CLICK_GRACE_MS) return;
      setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [isOpen]);

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");
  }

  function linkCls(href: string) {
    return cn(
      "text-[10px] tracking-[0.18em] transition-colors [font-family:var(--font-geist-pixel-circle)]",
      "rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]",
      isActive(href)
        ? "text-[var(--scaffold-toggle-text-active)]"
        : "text-[var(--scaffold-ruler)] hover:text-[var(--scaffold-toggle-text-active)]",
    );
  }

  return (
    <div ref={navRef}>
      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-4 md:flex md:gap-5"
      >
        {links.map(({ label, href, flip }) => (
          <Link
            key={href}
            href={href}
            className={linkCls(href)}
            onClick={() => trigger([30])}
            {...(flip ? { "aria-label": label } : {})}
          >
            {flip ? (
              <span className="relative inline-block" aria-hidden="true">
                <span className="invisible">
                  {flipNavWords.reduce((a, b) => (a.length >= b.length ? a : b))}
                </span>
                <span className="absolute inset-0 flex items-center">
                  <FlipWords words={flipNavWords} duration={2500} />
                </span>
              </span>
            ) : (
              <span>{label}</span>
            )}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => {
          trigger(isOpen ? [60] : "nudge");
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
        aria-controls="mobile-nav"
        className="flex min-h-[44px] min-w-[44px] items-center rounded-sm text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] transition-colors [font-family:var(--font-geist-pixel-circle)] hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)] md:hidden"
      >
        {isOpen ? "CLOSE" : "MENU"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.15,
              ease: "easeOut",
            }}
            className="absolute left-0 right-0 top-[50px] z-50 border-b border-[var(--scaffold-line)] bg-[var(--scaffold-surface)] md:hidden"
          >
            <nav aria-label="Mobile navigation">
              {links.map(({ label, href }, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    trigger([30]);
                    setIsOpen(false);
                  }}
                  className={cn(
                    linkCls(href),
                    "flex items-center px-5 py-4",
                    i > 0 && "border-t border-[var(--scaffold-line)]",
                  )}
                >
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  trigger([20, 30]);
                  setIsOpen(false);
                  openAssistant();
                }}
                className="flex w-full items-center gap-2 border-t border-[var(--scaffold-line)] px-5 py-4 text-left text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] transition-colors hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)] [font-family:var(--font-geist-pixel-circle)]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ask about my work
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
