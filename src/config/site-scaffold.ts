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
  sideRailWidth: number;
  borderWidth: number;
  cornerMarkers: {
    size: number;
    offset: number;
    borderWidth: number;
  };
  fullBleedSectionDividerWidth: number;
  edgeExtensions: {
    horizontalLength: string;
    verticalLength: string;
  };
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
  pageTopPadding: 40,
  sideRailWidth: 40,
  borderWidth: 1,
  cornerMarkers: {
    size: 10,
    offset: 5,
    borderWidth: 1,
  },
  fullBleedSectionDividerWidth: 1,
  edgeExtensions: {
    horizontalLength: "50vw",
    verticalLength: "42vh",
  },
  palette: {
    light: {
      background: "oklch(97.6139% 0 89.88)",
      surface: "oklch(100% 0 89.88)",
      line: "oklch(91.279% 0 89.88)",
      ruler: "oklch(84.8322% 0 89.88)",
      toggleTrack: "oklch(97.6139% 0 89.88)",
      toggleThumb: "oklch(95.3435% 0 89.88)",
      toggleTextActive: "oklch(55.3411% 0 89.88)",
      toggleTextInactive: "oklch(71.3477% 0 89.88)",
    },
    dark: {
      background: "oklch(20.4627% 0 89.88)",
      surface: "oklch(26.0325% 0 89.88)",
      line: "oklch(30.3278% 0 89.88)",
      ruler: "oklch(51.6102% 0 89.88)",
      toggleTrack: "oklch(20.4627% 0 89.88)",
      toggleThumb: "oklch(26.0325% 0 89.88)",
      toggleTextActive: "oklch(86.2348% 0 89.88)",
      toggleTextInactive: "oklch(61.0548% 0 89.88)",
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
