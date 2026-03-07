"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteScaffold } from "@/components/layout/site-scaffold";
import { buildShellVars } from "@/components/layout/shell-vars";

type AppShellProps = {
  children: ReactNode;
  machineContent: ReactNode;
};

const shellVars = buildShellVars();

function ArtToolShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-scaffold relative min-h-screen w-full" style={shellVars}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[var(--scaffold-bg)]"
      />
      <main className="relative min-h-screen w-full">{children}</main>
    </div>
  );
}

export function AppShell({ children, machineContent }: AppShellProps) {
  const pathname = usePathname();
  const isArtTool = pathname === "/art";

  if (isArtTool) {
    return <ArtToolShell>{children}</ArtToolShell>;
  }

  return (
    <SiteScaffold machineContent={machineContent}>{children}</SiteScaffold>
  );
}
