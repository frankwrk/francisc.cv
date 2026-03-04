"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlipWords } from "@/components/ui/flip-words";
import { cn } from "@/utils/cn";

const flipNavWords = ["Thinking", "Writing", "Notes"];

export function SiteNav() {
  const pathname = usePathname();

  const links = [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Resume", href: "/resume" },
    { label: "Thinking", href: "/thinking", flip: true },
  ];

  return (
    <nav className="flex items-center gap-4 md:gap-5">
      {links.map(({ label, href, flip }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-[10px] tracking-[0.18em] transition-colors [font-family:var(--font-geist-pixel-circle)]",
              isActive
                ? "text-[var(--scaffold-toggle-text-active)]"
                : "text-[var(--scaffold-ruler)] hover:text-[var(--scaffold-toggle-text-active)]"
            )}
          >
            {flip ? (
              <span className="relative inline-block">
                <span aria-hidden className="invisible">
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
        );
      })}
    </nav>
  );
}
