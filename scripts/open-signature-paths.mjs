#!/usr/bin/env node
/**
 * Opens SVG path data by removing all close-path (Z) commands.
 * Produces open strokes for a single-pen-stroke look when stroked.
 * Usage: node scripts/open-signature-paths.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public", "images", "signature.svg");

/** Remove all Z (closepath) commands from path d; collapse whitespace. */
function openPathD(d) {
  if (typeof d !== "string") return d;
  return d.replace(/\s*Z\s*/gi, " ").replace(/\s+/g, " ").trim();
}

const svg = readFileSync(svgPath, "utf8");

// Replace each path's d attribute (multiline-safe): capture path tag, replace d value with opened version.
const pathTagRegex = /<path(\s[^>]*?\s)d="([\s\S]*?)"(\s*\/>)/g;
const openedDValues = [];
const newSvg = svg.replace(pathTagRegex, (_, before, dContent, after) => {
  const opened = openPathD(dContent);
  openedDValues.push(opened);
  return `<path${before} d="${opened}"${after}`;
});

writeFileSync(svgPath, newSvg, "utf8");
console.log("Updated public/images/signature.svg (removed Z commands).");
console.log("\nOpened path d strings for src/config/site-signature.ts:");
openedDValues.forEach((d, i) => {
  console.log(`\n// Path ${i + 1}:\n"${d}",`);
});
