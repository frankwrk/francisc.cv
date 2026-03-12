#!/usr/bin/env node
/**
 * Removes all data-oid="..." and data-oid='...' attributes from .tsx and .jsx files.
 * Run from repo root: node scripts/remove-data-oid.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { readdirSync } from "fs";

function* walk(dir, exts = new Set([".tsx", ".jsx"])) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      yield* walk(full, exts);
    } else if (exts.has(join(e.name).replace(/^.*\./, "."))) {
      yield full;
    }
  }
}

const root = join(process.cwd());
const doubleQuoted = / data-oid="[^"]*"/g;
const singleQuoted = / data-oid='[^']*'/g;

let total = 0;
let filesChanged = 0;

for (const file of walk(root)) {
  let content = readFileSync(file, "utf8");
  const before = content;
  content = content.replace(doubleQuoted, "").replace(singleQuoted, "");
  if (content !== before) {
    writeFileSync(file, content, "utf8");
    const count =
      (before.match(/ data-oid="[^"]*"/g) || []).length +
      (before.match(/ data-oid='[^']*'/g) || []).length;
    total += count;
    filesChanged += 1;
    console.log(file.replace(root + "/", ""));
  }
}

console.log("\nDone. Removed data-oid from %d file(s), %d attribute(s) total.", filesChanged, total);
