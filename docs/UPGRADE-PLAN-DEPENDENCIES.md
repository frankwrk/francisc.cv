# Dependency upgrade plan

This document outlines a safe upgrade path for three outdated dev dependencies. Order of execution matters: do one at a time, run full checks after each, and roll back if anything breaks.

---

## 1. @types/node (20.x → 25.x)

### Implications

- **@types/node** major version aligns with **Node.js** major: v25 targets Node 25.
- **Next.js 16** requires Node **20.9.0+** (Node 20 LTS). This repo does not pin Node in `package.json` `engines`; CLAUDE.md states *"@types/node stays on 20.x (matches runtime baseline)"*.
- If your runtime (local + CI + Vercel) is **Node 20**, upgrading to **@types/node@25** types can introduce **type mismatches**: you’d be typing against Node 25 APIs while running on Node 20 (e.g. newer `node:*` module shapes or globals).

### Recommendation

- **Keep @types/node at ^20** unless you standardize on **Node 22 LTS or Node 25** everywhere.
- If you do move to Node 22/25: upgrade **@types/node** to the matching major (e.g. `^22` or `^25`), then run `bun run typecheck` and fix any new type errors.

### If you choose to upgrade to @types/node 25

1. Confirm Node version: `node -v` (and CI/Vercel) ≥ 22 or 25.
2. `bun add -d @types/node@^25`
3. `bun run typecheck`
4. Fix any `node:*` or global type errors; revert to `^20` if the churn is large or runtime stays on Node 20.

---

## 2. ESLint (9.x → 10.x)

### Status: **Deferred** (attempted 2026-03-09)

- **ESLint 10** was installed and **immediately reverted**. **eslint-config-next@16** pulls in **eslint-plugin-react@^7.37**, which is **not compatible** with ESLint 10's context API: running `bun run lint` with ESLint 10 fails with `TypeError: contextOrFilename.getFilename is not a function` (in `eslint-plugin-react`).
- Defer the ESLint 10 upgrade until **eslint-config-next** or **eslint-plugin-react** (or the ecosystem's move to a v10-compatible React plugin) supports ESLint 10. Revisit when Next.js or the React plugin release notes mention ESLint 10.

### Implications (for when you retry)

- **ESLint 10** removes the legacy `.eslintrc` system; this project already uses **flat config** (`eslint.config.mjs`), so no config migration is needed.
- **eslint-config-next@16.1.6** declares `eslint: '>=9.0.0'`, so **ESLint 10 is within the supported range**.
- ESLint 10 adds/changes rules (e.g. `preserve-caught-error`, `no-useless-assignment`, `no-unassigned-vars`) and improves JSX reference tracking; you may see **new warnings or errors** after upgrading.
- ESLint 10 requires **Node 20.19.0+** (or 22.13+ / 24+); Next.js 16 already requires Node 20.9+, so you’re fine if you’re on a recent Node 20 or newer.

### Recommended steps

1. **Backup / branch:** work on a branch so you can revert easily.
2. **Upgrade:**  
   `bun add -d eslint@10`
3. **Run lint:**  
   `bun run lint`
4. **Fix any new rule violations** (new defaults or JSX handling). If the list is long, consider temporarily disabling the rule with a TODO, then fix in a follow-up.
5. **Run typecheck and build:**  
   `bun run typecheck && bun run build`
6. **Update docs:** in CLAUDE.md, change *"ESLint remains on 9.x"* to *"ESLint 10.x"* (and remove *"Next.js lint plugin peer range targets <=9"* if that was the reason).

### Rollback

- `bun add -d eslint@9.39.4` (or the exact version you had).

---

## 3. shadcn CLI (3.x → 4.x)

### Status: **Done** (2026-03-09)

- Upgraded to **shadcn@4.0.2**. `bunx shadcn add button --dry-run` and `bunx shadcn info` run successfully; `bun run typecheck` and `bun run build` pass.

### Implications

- **shadcn v4** is a significant CLI/registry release: presets, `--dry-run` / `--diff` / `--view`, `shadcn info`, `shadcn docs`, new init templates, and optional Base UI primitives. It is **not** a runtime dependency: your app uses **Radix** and hand-ported components in `src/components/ui/`; the shadcn package is **dev-only** for adding components.
- **components.json** currently points `tailwind.css` to `alignui/app/globals.css` (reference workspace). shadcn v4 may expect or generate paths for Tailwind v4 and a different theme/CSS structure; upgrading the CLI does **not** force you to change existing components, but **new** components added with `npx shadcn@latest add …` may follow v4 conventions (e.g. `data-slot`, OKLCH, etc.).
- Your stack (**Tailwind v4**, **React 19**) is what shadcn v4 targets, so new components from the v4 registry should align well.

### Recommended steps

1. **Backup / branch:** same as ESLint.
2. **Upgrade:**  
   `bun add -d shadcn@4`
3. **Smoke-test the CLI (no project changes):**  
   - `bunx shadcn add button --dry-run`  
   - `bunx shadcn info`  
   Ensure the CLI runs and that `info` reflects your project (paths, Tailwind, etc.).
4. **Optional:** run `bunx shadcn add <component> --diff` for a component you already have (e.g. button if you use one from shadcn) to see what v4 would change; **do not apply** unless you’re ready to adopt v4 component code.
5. **Run build and typecheck:**  
   `bun run typecheck && bun run build`
6. **Decide on components.json / CSS:**  
   - If you keep using the AlignUI reference and only use shadcn to add components occasionally, you may keep `components.json` as-is and only fix any path or schema issues the v4 CLI reports.  
   - If you later migrate to full shadcn v4 theming (e.g. `@theme` and OKLCH), plan that as a separate, design-system change.

### Rollback

- `bun add -d shadcn@3.8.5`

### Note

- Existing UI in `src/components/ui/` does **not** need to be rewritten for shadcn v4; the upgrade is for the **CLI and future components** only.

---

## Recommended order of execution

| Order | Package        | Risk / impact |
|-------|----------------|----------------|
| 1     | **ESLint 10**  | Low; config already flat; possible new rule fixes. |
| 2     | **shadcn 4**   | Low for app behavior (dev CLI only); validate CLI and `info`/`--dry-run`. |
| 3     | **@types/node**| **Skip** unless you move to Node 22/25; otherwise keep **^20**. |

Do **not** upgrade all three in one go. After each upgrade: `bun run lint`, `bun run typecheck`, `bun run build`, and a quick manual check of the app.

---

## Post-upgrade checklist (per package)

- [ ] `bun run lint` passes (or only expected new rules documented).
- [ ] `bun run typecheck` passes.
- [ ] `bun run build` succeeds.
- [ ] CLAUDE.md / AGENTS.md updated if they mention the dependency or version constraints.
- [ ] Optional: add `engines` in `package.json` (e.g. `"node": ">=20.9.0"`) to lock the Node baseline and avoid @types/node mismatch.
