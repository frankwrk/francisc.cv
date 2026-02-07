"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header({ onOpenPalette }: { onOpenPalette: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-fg">
          <span className="font-pixel text-[11px] uppercase tracking-[0.16em] text-muted">FF</span>
          <span>francisc.cv</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-sm px-3 py-2 text-sm transition-colors duration-150",
                  active ? "font-medium text-accent" : "text-muted hover:text-fg",
                )}
              >
                <span className={cn(active ? "link-underline-active" : "link-underline")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={onOpenPalette}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs text-muted transition-colors duration-150 hover:border-accent/40 hover:text-fg"
          >
            <span className="font-mono">Search</span>
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="inline-flex h-9 items-center rounded-md border border-border px-3 text-xs text-muted md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-bg md:hidden">
          <nav className="mx-auto flex max-w-[1100px] flex-col gap-1 p-3" aria-label="Mobile">
            {siteConfig.nav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-sm px-3 py-2 text-sm",
                    active ? "bg-accent-muted/35 text-accent" : "text-muted hover:bg-card hover:text-fg",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-2 flex items-center gap-2 px-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenPalette();
                }}
                className="inline-flex h-9 items-center rounded-md border border-border px-3 text-xs text-muted"
              >
                Search ⌘K
              </button>
              <ThemeToggle />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
