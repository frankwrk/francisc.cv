# AGENTS Notes

This file is the local decision and fix journal for agentic work in this repository.

## Update rule

- Add an entry whenever a meaningful design/engineering decision is made.
- Add an entry whenever an issue is fixed.
- Keep entries brief, concrete, and tied to files so future runs can reuse context quickly.

## Log

### 2026-02-07

- Decision: Built the site as a content-first Next.js 16 App Router implementation with MDX in `/content` and no CMS/database. Rationale: keeps content editable in-repo and fast to statically generate.
- Decision: Implemented a tokenized visual system in `src/app/globals.css` using CSS variables (`bg`, `fg`, `muted`, `border`, `border2`, `card`, `card2`, `accent`, `accentMuted`, `ring`) mapped to Tailwind v4 theme tokens.
- Decision: Used Geist Sans, Geist Mono, and Geist Pixel via `geist/font/*` in `src/app/layout.tsx` for consistent Vercel-core typography.
- Decision: Added reusable panel primitives in `src/components/ui/panel.tsx` to enforce two-tone border layout patterns across pages.
- Decision: Implemented build-time content indexing and search metadata in `src/lib/content.ts` to power command palette + page search without runtime fetches.
- Fix: Added MDX code copy affordance with `src/components/ui/code-block.tsx` + `src/components/ui/copy-button.tsx` to improve snippet usability.
- Fix: Implemented a client-side placeholder contact form in `src/components/mdx/contact-form.tsx` and wired it into `content/pages/about.mdx`.
- Fix: Resolved Next.js React lint rules in `src/components/site/theme-toggle.tsx` and `src/components/site/command-palette.tsx` by avoiding synchronous `setState` inside effects and stabilizing callback dependencies.
- Fix: Build and lint verification now pass (`pnpm lint`, `pnpm build`) after route/content wiring.
- Decision: Rebalanced the homepage composition in `src/app/page.tsx` to reduce panel density (more open sections, fewer stacked cards) while preserving the border-grid language.
- Decision: Added an animated Vercel-inspired spectrum hero graphic in `src/components/site/hero-spectrum.tsx` with reduced-motion-safe CSS in `src/app/globals.css`.
- Decision: Increased purposeful accent usage for key interactions by updating nav active states (`src/components/site/header.tsx`), badges (`src/components/ui/badge.tsx`), and row hovers (`src/components/ui/panel.tsx`).
- Fix: Improved code block affordance and color hierarchy in `src/components/ui/code-block.tsx` and syntax colors in `src/app/globals.css`.
- Fix: Verified refreshed design still passes checks (`pnpm lint`, `pnpm build`).
- Decision: Used `copywriting` + `pdf` skills to distill five role-specific resume PDFs into one coherent portfolio narrative spanning technical product, UX, WordPress engineering, and security operations.
- Decision: Rewrote `content/pages/about.mdx` and `content/pages/resume.mdx` with factual claims only (9+ years, 60+ web products, 40% engagement lift, up to 70% downtime/attack reduction in protected environments).
- Decision: Updated project case studies in `content/projects/*.mdx` to align with actual resume evidence and removed placeholder external doc/github links.
- Decision: Updated writing entries in `content/writing/*.mdx` to reflect real delivery insights from cross-role work.
- Fix: Replaced placeholder `public/resume.pdf` with the Technical Product Manager resume and added role-specific downloads under `public/resumes/`.
- Fix: Updated README resume documentation in `README.md` to document default and role-specific resume assets.
- Fix: Resolved hydration mismatch from theme label divergence by making `src/components/site/theme-toggle.tsx` SSR-stable (removed client-initialized render-state label and switched to deterministic cycle action text).
- Fix: Re-verified site integrity after hydration fix (`pnpm lint`, `pnpm build`).
