export type ScaffoldSection = {
  id: string;
  minHeight: number | string;
  maxInnerWidth?: number;
};

export type ScaffoldPalette = {
  background: string;
  surface: string;
  line: string;
  ruler: string;
  toggleTrack: string;
  toggleThumb: string;
  toggleTextActive: string;
  toggleTextInactive: string;
};

export type SiteScaffoldConfig = {
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
  rulerTopValues: number[];
  rulerSide: {
    start: number;
    end: number;
    step: number;
    unitPx: number;
  };
  sections: ScaffoldSection[];
};

// Update values in this object to customize the global scaffold.
export const siteScaffoldConfig: SiteScaffoldConfig = {
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
      background: "oklch(97.6139% 0 89.88)",
      surface: "oklch(100% 0 89.88)",
      line: "oklch(91.279% 0 89.88)",
      ruler: "oklch(55% 0 89.88)",          // was 84.83% → 4.86:1 vs white ✓ WCAG AA
      toggleTrack: "oklch(97.6139% 0 89.88)",
      toggleThumb: "oklch(95.3435% 0 89.88)",
      toggleTextActive: "oklch(42% 0 89.88)",      // was 55.34% → 8.46:1 vs white ✓
      toggleTextInactive: "oklch(55% 0 89.88)",    // was 71.35% → 4.86:1 vs white ✓
    },
    dark: {
      background: "oklch(20.4627% 0 89.88)",
      surface: "oklch(26.0325% 0 89.88)",
      line: "oklch(30.3278% 0 89.88)",
      ruler: "oklch(65% 0 89.88)",          // was 51.61% → 4.94:1 vs dark surface ✓ WCAG AA
      toggleTrack: "oklch(20.4627% 0 89.88)",
      toggleThumb: "oklch(26.0325% 0 89.88)",
      toggleTextActive: "oklch(86.2348% 0 89.88)",
      toggleTextInactive: "oklch(65% 0 89.88)",    // was 61.05% → 4.94:1 vs dark surface ✓
    },
  },
  rulerTopValues: [0, 120, 240, 360, 480, 600, 720, 840, 960],
  rulerSide: {
    start: 0,
    end: 900,
    step: 50,
    unitPx: 1,
  },
  sections: [
    // Single active content section for the current build phase.
    { id: "hero", minHeight: "clamp(520px, 82dvh, 900px)" },
  ],
};
