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
  "geoformations-redesign": {
    variant: "noise-lines",
    fg: "#e0ca8c",
    bg: "#4a1cca",
    layout: {
      count: 61,
      columns: 17,
    },
    waveformBars: {
      waveType: "sine",
      amplitude: 0.75,
      frequency: 1.5,
      phaseOffset: 0,
      fromBottom: true,
    },
    gridBlocks: {
      gap: 4,
      noiseScale: 1.5,
      roundness: 0,
    },
    noiseLines: {
      lineWidth: 1,
      displacement: 9,
      direction: "vertical",
      noiseScale: 5,
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

  "platform-onboarding-accelerator": {
    variant: "grid-blocks",
    fg: "#000000",
    bg: "#f5b400",
    layout: {
      count: 137,
      columns: 60,
    },
    waveformBars: {
      waveType: "sine",
      amplitude: 0.75,
      frequency: 1.5,
      phaseOffset: 0,
      fromBottom: true,
    },
    gridBlocks: {
      gap: 1,
      noiseScale: 5,
      roundness: 0,
    },
    noiseLines: {
      lineWidth: 1,
      displacement: 9,
      direction: "vertical",
      noiseScale: 5,
    },
    pixelScatter: {
      size: 5,
      density: 0.7,
      roundness: 20,
    },
    fluidGrid: {
      gap: 9,
      flowAmount: 0,
      noiseScale: 1.9,
    },
  },

  "secure-release-gates": {
    variant: "fluid-grid",
    fg: "#dbbdd8",
    bg: "#ca1c50",
    layout: {
      count: 137,
      columns: 29,
    },
    waveformBars: {
      waveType: "sine",
      amplitude: 0.75,
      frequency: 1.5,
      phaseOffset: 0,
      fromBottom: true,
    },
    gridBlocks: {
      gap: 4,
      noiseScale: 1.5,
      roundness: 0,
    },
    noiseLines: {
      lineWidth: 1,
      displacement: 9,
      direction: "vertical",
      noiseScale: 5,
    },
    pixelScatter: {
      size: 5,
      density: 0.7,
      roundness: 20,
    },
    fluidGrid: {
      gap: 9,
      flowAmount: 0,
      noiseScale: 1.9,
    },
  },

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
