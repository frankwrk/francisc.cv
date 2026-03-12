import type { CSSProperties } from "react";
import { siteScaffoldConfig } from "@/config/site-scaffold";

export type ShellVars = CSSProperties & {
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
  "--scaffold-page-top-padding": string;
  "--scaffold-page-bottom-padding": string;
  "--scaffold-border-width": string;
  "--scaffold-skip-link-top": string;
  "--scaffold-top-bar-padding-x": string;
  "--scaffold-top-bar-padding-x-md": string;
  "--scaffold-main-padding-x": string;
  "--scaffold-main-padding-y": string;
  "--scaffold-main-padding-x-md": string;
  "--scaffold-main-padding-y-md": string;
  "--scaffold-section-padding-x": string;
  "--scaffold-section-padding-y": string;
  "--scaffold-section-padding-x-md": string;
  "--scaffold-section-padding-y-md": string;
  "--machine-surface-bg-light": string;
  "--machine-surface-bg-dark": string;
};

export function buildShellVars(): ShellVars {
  return {
    "--scaffold-bg-light": siteScaffoldConfig.palette.light.background,
    "--scaffold-bg-dark": siteScaffoldConfig.palette.dark.background,
    "--scaffold-surface-light": siteScaffoldConfig.palette.light.surface,
    "--scaffold-surface-dark": siteScaffoldConfig.palette.dark.surface,
    "--scaffold-line-light": siteScaffoldConfig.palette.light.line,
    "--scaffold-line-dark": siteScaffoldConfig.palette.dark.line,
    "--scaffold-ruler-light": siteScaffoldConfig.palette.light.ruler,
    "--scaffold-ruler-dark": siteScaffoldConfig.palette.dark.ruler,
    "--scaffold-toggle-track-light":
      siteScaffoldConfig.palette.light.toggleTrack,
    "--scaffold-toggle-track-dark": siteScaffoldConfig.palette.dark.toggleTrack,
    "--scaffold-toggle-thumb-light":
      siteScaffoldConfig.palette.light.toggleThumb,
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
    "--scaffold-page-top-padding": `${siteScaffoldConfig.pageTopPadding}px`,
    "--scaffold-page-bottom-padding": `${siteScaffoldConfig.pageBottomPadding}px`,
    "--scaffold-border-width": `${siteScaffoldConfig.borderWidth}px`,
    "--scaffold-skip-link-top": `${siteScaffoldConfig.topBarHeightPx + siteScaffoldConfig.skipLinkOffsetBelowTopBarPx}px`,
    "--scaffold-top-bar-padding-x": `${siteScaffoldConfig.topBarPaddingPx.x}px`,
    "--scaffold-top-bar-padding-x-md": `${siteScaffoldConfig.topBarPaddingPx.xMd}px`,
    "--scaffold-main-padding-x": `${siteScaffoldConfig.mainContentPaddingPx.xPx}px`,
    "--scaffold-main-padding-y": `${siteScaffoldConfig.mainContentPaddingPx.yPx}px`,
    "--scaffold-main-padding-x-md": `${siteScaffoldConfig.mainContentPaddingPx.xPxMd}px`,
    "--scaffold-main-padding-y-md": `${siteScaffoldConfig.mainContentPaddingPx.yPxMd}px`,
    "--scaffold-section-padding-x": `${siteScaffoldConfig.sectionPaddingPx.xPx}px`,
    "--scaffold-section-padding-y": `${siteScaffoldConfig.sectionPaddingPx.yPx}px`,
    "--scaffold-section-padding-x-md": `${siteScaffoldConfig.sectionPaddingPx.xPxMd}px`,
    "--scaffold-section-padding-y-md": `${siteScaffoldConfig.sectionPaddingPx.yPxMd}px`,
    "--machine-surface-bg-light":
      siteScaffoldConfig.palette.light.machineSurfaceBg,
    "--machine-surface-bg-dark":
      siteScaffoldConfig.palette.dark.machineSurfaceBg,
  };
}
