/**
 * Art Assignments — committed config mapping content slugs to ArtConfig.
 *
 * Edit this file (or use the Export button on /art) to persist art assignments
 * across all devices and deployments. localStorage is only used for live
 * preview on the /art page while designing.
 */

import type { ArtConfig } from "@/lib/art-assignments";

// Use a string-keyed map type so dynamic route slugs can safely index this
// config during server builds (e.g. /work/[slug], /thinking/[slug]).
export const artAssignments: Record<string, ArtConfig> = {
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
    animation: {
      enabled: true,
      speed: 0.4,
    },
    layout: {
      count: 74,
      columns: 20,
    },
    waveformBars: {
      waveType: "sine",
      amplitude: 0.65,
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
  "bridging-ux-and-engineering": {
    variant: "truchet-tiles",
    fg: "#1a5700",
    bg: "#003312",
    animation: {
      enabled: true,
      speed: 1,
    },
    layout: {
      count: 94,
      columns: 12,
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
      noiseScale: 1.2,
      roundness: 0,
    },
    noiseLines: {
      lineWidth: 2,
      displacement: 30,
      direction: "horizontal",
      noiseScale: 1.2,
    },
    pixelScatter: {
      size: 6,
      density: 0.6,
      roundness: 0,
    },
    fluidGrid: {
      gap: 3,
      flowAmount: 20,
      noiseScale: 1.2,
    },
    contourLines: {
      bandCount: 8,
      noiseScale: 1.2,
      contrast: 0.5,
    },
    truchetTiles: {
      tileSize: 24,
      lineWidth: 2,
      noiseScale: 1.2,
    },
    particleFlow: {
      particleCount: 200,
      fieldScale: 1,
      stepLength: 3,
      trail: 30,
    },
  },
  "documentation-as-product-surface": {
    variant: "grid-blocks",
    fg: "#be2409",
    bg: "#1c1c1c",
    animation: {
      enabled: true,
      speed: 0.7,
    },
    layout: {
      count: 42,
      columns: 39,
    },
    waveformBars: {
      waveType: "sine",
      amplitude: 0.75,
      frequency: 1.5,
      phaseOffset: 0,
      fromBottom: true,
    },
    gridBlocks: {
      gap: 7,
      noiseScale: 0.7,
      roundness: 0,
    },
    noiseLines: {
      lineWidth: 2,
      displacement: 30,
      direction: "horizontal",
      noiseScale: 0.7,
    },
    pixelScatter: {
      size: 6,
      density: 0.6,
      roundness: 0,
    },
    fluidGrid: {
      gap: 7,
      flowAmount: 20,
      noiseScale: 0.7,
    },
    contourLines: {
      bandCount: 8,
      noiseScale: 0.7,
      contrast: 0.5,
    },
    truchetTiles: {
      tileSize: 40,
      lineWidth: 2,
      noiseScale: 0.7,
    },
    particleFlow: {
      particleCount: 200,
      fieldScale: 1,
      stepLength: 3,
      trail: 30,
    },
  },
  "systems-thinking-in-web-projects": {
    variant: "particle-flow",
    fg: "#8ee1ab",
    bg: "#000000",
    animation: {
      enabled: true,
      speed: 0.3,
    },
    layout: {
      count: 24,
      columns: 12,
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
    contourLines: {
      bandCount: 8,
      noiseScale: 1,
      contrast: 0.5,
    },
    truchetTiles: {
      tileSize: 40,
      lineWidth: 2,
      noiseScale: 1,
    },
    particleFlow: {
      particleCount: 430,
      fieldScale: 0.7,
      stepLength: 2.5,
      trail: 35,
    },
  },
};
