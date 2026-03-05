/**
 * Art Assignments — committed config mapping content slugs to ArtConfig.
 *
 * Edit this file (or use the Export button on /art) to persist art assignments
 * across all devices and deployments. localStorage is only used for live
 * preview on the /art page while designing.
 */

import type { ArtConfig } from "@/lib/art-assignments";

export const artAssignments: Record<string, ArtConfig> = {
  // Paste exported configs from /art here.
  // Example:
  // "geoformations-redesign": {
  //   variant: "waveform-bars",
  //   fg: "#e0ca8c",
  //   bg: "#c94c1c",
  //   layout: { count: 24, columns: 12 },
  //   waveformBars: { waveType: "sine", amplitude: 0.75, frequency: 1.5, phaseOffset: 0, fromBottom: true },
  //   gridBlocks: { gap: 4, noiseScale: 1.5, roundness: 0 },
  //   noiseLines: { lineWidth: 2, displacement: 30, direction: "horizontal", noiseScale: 1.5 },
  //   pixelScatter: { size: 6, density: 0.6, roundness: 0 },
  //   fluidGrid: { gap: 3, flowAmount: 20, noiseScale: 1 },
  // },
  "docs-as-product-playbook": {
    variant: "waveform-bars",
    fg: "#e0ca8c",
    bg: "#c94c1c",
    layout: {
      count: 60,
      columns: 12,
    },
    waveformBars: {
      waveType: "sawtooth",
      amplitude: 0.92,
      frequency: 1.9,
      phaseOffset: 0,
      fromBottom: true,
    },
    gridBlocks: {
      gap: 5,
      noiseScale: 1.5,
      roundness: 0,
    },
    noiseLines: {
      lineWidth: 2,
      displacement: 30,
      direction: "horizontal",
      noiseScale: 1.5,
    },
    pixelScatter: {
      size: 6,
      density: 0.6,
      roundness: 0,
    },
    fluidGrid: {
      gap: 3,
      flowAmount: 20,
      noiseScale: 1,
    },
  },
};
