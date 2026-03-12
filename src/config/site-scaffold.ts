export type ScaffoldSection = {
  id: string;
  minHeight: number | string;
  maxInnerWidth?: number;
};

export type ScaffoldPalette = {
  background: string;
  surface: string;
  machineSurfaceBg: string;
  line: string;
  ruler: string;
  toggleTrack: string;
  toggleThumb: string;
  toggleTextActive: string;
  toggleTextInactive: string;
};

/** Padding in px; base = mobile, Md = md breakpoint and up. */
export type ScaffoldPaddingPx = {
  xPx: number;
  yPx: number;
  xPxMd: number;
  yPxMd: number;
};

export type SiteScaffoldConfig = {
  /** Top bar (navbar) height in px; used for header and mobile menu offset. */
  topBarHeightPx: number;
  /** Offset in px below top bar for skip link (focus position). */
  skipLinkOffsetBelowTopBarPx: number;
  /** Top bar horizontal padding in px (base, md). */
  topBarPaddingPx: { x: number; xMd: number };
  canvasMaxWidth: number;
  pageTopPadding: number;
  pageBottomPadding: number;
  sideRailWidth: number;
  borderWidth: number;
  cornerMarkers: {
    size: number;
    offset: number;
    borderWidth: number;
  };
  fullBleedSectionDividerWidth: number;
  /** Horizontal/vertical lengths are computed from viewport in the layout; no hardcoded values. */
  edgeExtensions: Record<string, never>;
  palette: {
    light: ScaffoldPalette;
    dark: ScaffoldPalette;
  };
  rulerSide: {
    stepPx: number;
    /** Height in px of the fade zone at the bottom of the ruler (opacity 1 → 0). */
    fadeZonePx: number;
  };
  /** Padding for the main content area (hero section). */
  mainContentPaddingPx: ScaffoldPaddingPx;
  /** Padding for non-hero sections. */
  sectionPaddingPx: ScaffoldPaddingPx;
  sections: ScaffoldSection[];
};

// Update values in this object to customize the global scaffold.
// When topBarHeightPx === rulerSide.stepPx (e.g. 50), the first ruler tick aligns with the top bar bottom.
export const siteScaffoldConfig: SiteScaffoldConfig = {
  topBarHeightPx: 54,
  skipLinkOffsetBelowTopBarPx: 4,
  topBarPaddingPx: { x: 16, xMd: 24 },
  canvasMaxWidth: 980,
  pageTopPadding: 52,
  pageBottomPadding: 52,
  sideRailWidth: 40,
  borderWidth: 1,
  cornerMarkers: {
    size: 10,
    offset: 5,
    borderWidth: 1,
  },
  fullBleedSectionDividerWidth: 1,
  edgeExtensions: {},
  palette: {
    light: {
      background: "oklch(0.9851 0 0)",
      surface: "oklch(0.9851 0 0)",
      machineSurfaceBg: "oklch(0.9851 0 0)",
      line: "oklch(91.279% 0 89.88)",
      ruler: "oklch(55% 0 89.88)", // was 84.83% → 4.86:1 vs white ✓ WCAG AA
      toggleTrack: "oklch(97.6139% 0 89.88)",
      toggleThumb: "oklch(95.3435% 0 89.88)",
      toggleTextActive: "oklch(42% 0 89.88)", // was 55.34% → 8.46:1 vs white ✓
      toggleTextInactive: "oklch(55% 0 89.88)", // was 71.35% → 4.86:1 vs white ✓
    },
    dark: {
      background: "oklch(0.1448 0 0)",
      surface: "oklch(0.1448 0 0)",
      machineSurfaceBg: "oklch(0.109 0 0)",
      line: "oklch(30.3278% 0 89.88)",
      ruler: "oklch(65% 0 89.88)", // was 51.61% → 4.94:1 vs dark surface ✓ WCAG AA
      toggleTrack: "oklch(20.4627% 0 89.88)",
      toggleThumb: "oklch(26.0325% 0 89.88)",
      toggleTextActive: "oklch(86.2348% 0 89.88)",
      toggleTextInactive: "oklch(65% 0 89.88)", // was 61.05% → 4.94:1 vs dark surface ✓
    },
  },
  rulerSide: {
    stepPx: 50,
    fadeZonePx: 200,
  },
  mainContentPaddingPx: { xPx: 20, yPx: 24, xPxMd: 40, yPxMd: 40 },
  sectionPaddingPx: { xPx: 16, yPx: 16, xPxMd: 24, yPxMd: 24 },
  sections: [
    // Single active content section for the current build phase.
    { id: "hero", minHeight: "clamp(520px, 82dvh, 900px)" },
  ],
};
