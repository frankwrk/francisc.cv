"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteScaffold } from "@/components/layout/site-scaffold";
import { siteScaffoldConfig } from "@/config/site-scaffold";

type AppShellProps = {
  children: ReactNode;
  machineContent: ReactNode;
};

type ShellVars = CSSProperties & {
  "--scaffold-bg-light": string;
  "--scaffold-bg-dark": string;
  "--scaffold-surface-light": string;
  "--scaffold-surface-dark": string;
  "--scaffold-line-light": string;
  "--scaffold-line-dark": string;
  "--scaffold-ruler-light": string;
  "--scaffold-ruler-dark": string;
  "--scaffold-toggle-track-light": string;
  "--scaffold-toggle-track-dark": string;
  "--scaffold-toggle-thumb-light": string;
  "--scaffold-toggle-thumb-dark": string;
  "--scaffold-toggle-text-active-light": string;
  "--scaffold-toggle-text-active-dark": string;
  "--scaffold-toggle-text-inactive-light": string;
  "--scaffold-toggle-text-inactive-dark": string;
  "--scaffold-section-divider-width": string;
  "--machine-surface-bg-light": string;
  "--machine-surface-bg-dark": string;
};

const shellVars: ShellVars = {
  "--scaffold-bg-light": siteScaffoldConfig.palette.light.background,
  "--scaffold-bg-dark": siteScaffoldConfig.palette.dark.background,
  "--scaffold-surface-light": siteScaffoldConfig.palette.light.surface,
  "--scaffold-surface-dark": siteScaffoldConfig.palette.dark.surface,
  "--scaffold-line-light": siteScaffoldConfig.palette.light.line,
  "--scaffold-line-dark": siteScaffoldConfig.palette.dark.line,
  "--scaffold-ruler-light": siteScaffoldConfig.palette.light.ruler,
  "--scaffold-ruler-dark": siteScaffoldConfig.palette.dark.ruler,
  "--scaffold-toggle-track-light": siteScaffoldConfig.palette.light.toggleTrack,
  "--scaffold-toggle-track-dark": siteScaffoldConfig.palette.dark.toggleTrack,
  "--scaffold-toggle-thumb-light": siteScaffoldConfig.palette.light.toggleThumb,
  "--scaffold-toggle-thumb-dark": siteScaffoldConfig.palette.dark.toggleThumb,
  "--scaffold-toggle-text-active-light":
    siteScaffoldConfig.palette.light.toggleTextActive,
  "--scaffold-toggle-text-active-dark":
    siteScaffoldConfig.palette.dark.toggleTextActive,
  "--scaffold-toggle-text-inactive-light":
    siteScaffoldConfig.palette.light.toggleTextInactive,
  "--scaffold-toggle-text-inactive-dark":
    siteScaffoldConfig.palette.dark.toggleTextInactive,
  "--scaffold-section-divider-width": `${siteScaffoldConfig.fullBleedSectionDividerWidth}px`,
  "--machine-surface-bg-light": "#FAFAFA",
  "--machine-surface-bg-dark": "#0A0A0A",
};

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
