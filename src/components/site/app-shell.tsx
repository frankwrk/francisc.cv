"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CommandPalette } from "@/components/site/command-palette";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { Analytics } from "@/components/site/analytics";
import type { SearchEntry } from "@/types/content";

export function AppShell({ children, searchEntries }: { children: ReactNode; searchEntries: SearchEntry[] }) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Header onOpenPalette={() => setPaletteOpen(true)} />
      <main>{children}</main>
      <Footer />
      <CommandPalette entries={searchEntries} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <Analytics />
    </>
  );
}
