"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useWebHaptics } from "web-haptics/react";
import { FlipWords } from "@/components/ui/flip-words";
import { cn } from "@/utils/cn";

const flipNavWords = ["Thinking", "Writing", "Notes"];

const links = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Resume", href: "/resume" },
  { label: "Thinking", href: "/thinking", flip: true },
];

export function SiteNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const { trigger } = useWebHaptics();
  const prefersReducedMotion = useReducedMotion();

  // Close on outside click + ESC. Defer adding document click listener by one frame
  // so the same tap that opened the menu (e.g. on mobile) is not treated as outside click.
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("keydown", onKey);
    let cancelled = false;
    const raf = requestAnimationFrame(() => {
      if (!cancelled) document.addEventListener("click", onClick);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [isOpen]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  }

  function linkCls(href: string) {
    return cn(
      "text-[10px] tracking-[0.18em] transition-colors [font-family:var(--font-geist-pixel-circle)]",
      "rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)]",
      isActive(href)
        ? "text-[var(--scaffold-toggle-text-active)]"
        : "text-[var(--scaffold-ruler)] hover:text-[var(--scaffold-toggle-text-active)]"
    );
  }

  return (
    // No `relative` here — the absolute dropdown resolves to the canvas column instead,
    // giving it the full canvas width automatically.
    <div ref={navRef}>
      {/* Desktop: inline nav */}
      <nav aria-label="Main navigation" className="hidden items-center gap-4 md:flex md:gap-5">
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

      {/* Mobile: MENU toggle */}
      <button
        onClick={() => {
          trigger(isOpen ? [60] : "nudge");
          setIsOpen((v) => !v);
        }}
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
        aria-controls="mobile-nav"
        className="rounded-sm text-[10px] tracking-[0.18em] text-[var(--scaffold-ruler)] transition-colors [font-family:var(--font-geist-pixel-circle)] hover:text-[var(--scaffold-toggle-text-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--scaffold-ruler)] md:hidden"
      >
        {isOpen ? "CLOSE" : "MENU"}
      </button>

      {/* Mobile: full-width dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[50px] z-50 border-b border-[var(--scaffold-line)] bg-[var(--scaffold-surface)] md:hidden"
          >
            <nav aria-label="Mobile navigation">
              {links.map(({ label, href }, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => { trigger([30]); setIsOpen(false); }}
                  className={cn(
                    linkCls(href),
                    "flex items-center px-5 py-4",
                    i > 0 && "border-t border-[var(--scaffold-line)]"
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
