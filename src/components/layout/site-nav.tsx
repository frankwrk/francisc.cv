"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  RiTwitterXFill,
  RiLinkedinFill,
  RiInstagramLine,
} from "@remixicon/react";
import { useWebHaptics } from "web-haptics/react";
import { FlipWords } from "@/components/ui/flip-words";
import { siteScaffoldConfig } from "@/config/site-scaffold";
import { profileSummary } from "@/config/site-home";
import { cn } from "@/utils/cn";

const flipNavWords = ["Thinking", "Writing", "Notes"];

const links = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Resume", href: "/resume" },
  { label: "Thinking", href: "/thinking", flip: true },
];

const OUTSIDE_CLICK_GRACE_MS = 400;

export function NavSocialLinks({
  variant,
}: {
  variant: "desktop" | "mobile";
}) {
  const linkBaseCls =
    "inline-flex items-center justify-center text-(--scaffold-ruler) hover:text-(--scaffold-toggle-text-active) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--scaffold-ruler) rounded-sm transition-colors";

  const sizeCls =
    variant === "desktop"
      ? "h-6 w-6 text-[15px]"
      : "h-9 w-9 text-[18px]";

  const iconLinks = [
    {
      href: profileSummary.links?.x ?? "https://x.com/twosix_ltd",
      label: "Visit my X profile",
      Icon: RiTwitterXFill,
    },
    {
      href:
        profileSummary.links?.linkedin ??
        "https://www.linkedin.com/in/franciscfurdui/",
      label: "Visit my LinkedIn profile",
      Icon: RiLinkedinFill,
    },
    {
      href:
        profileSummary.links?.instagram ??
        "https://www.instagram.com/francisc_frd/",
      label: "Visit my Instagram profile",
      Icon: RiInstagramLine,
    },
  ] as const;

  return (
    <nav className="flex items-center gap-2" aria-label="Social profiles">
      {iconLinks.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={cn(linkBaseCls, sizeCls)}
        >
          <Icon aria-hidden className="h-[1em] w-[1em]" />
        </a>
      ))}
    </nav>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const openedAtRef = useRef<number>(0);
  const { trigger } = useWebHaptics();
  const prefersReducedMotion = useReducedMotion();

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
      "text-[10px] tracking-[0.18em] transition-colors [font-family:var(--font-geist-sans)]",
      "rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--scaffold-ruler)",
      isActive(href)
        ? "text-(--scaffold-toggle-text-active)"
        : "text-(--scaffold-ruler) hover:text-(--scaffold-toggle-text-active)",
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
        className="flex min-h-[44px] min-w-[44px] items-center rounded-sm text-[10px] tracking-[0.18em] text-(--scaffold-ruler) transition-colors [font-family:var(--font-geist-sans)] hover:text-(--scaffold-toggle-text-active) focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--scaffold-ruler) md:hidden"
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
            className="absolute left-0 right-0 z-50 border-b border-(--scaffold-line) bg-(--scaffold-surface) md:hidden"
            style={{ top: `${siteScaffoldConfig.topBarHeightPx}px` }}
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
                    i > 0 && "border-t border-(--scaffold-line)",
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
