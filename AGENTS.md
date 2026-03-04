# AGENTS.md

## Purpose of this repository

This repository powers **francisc.cv**, a personal portfolio and professional narrative site.

Per [`OVERVIEW.md`](./OVERVIEW.md), the product intent is:
- Evidence-based representation of product/system thinking in ambiguous environments
- A living documentation artifact for hiring managers and technical leaders
- A restrained, coherent experience where clarity and structure are prioritized over hype

Core principles from overview:
- Clarity > personality
- Evidence > claims
- Systems thinking > aesthetics

## What the app currently is

Current runtime implementation is an early scaffold:
- Next.js App Router app with a default starter homepage at [`src/app/page.tsx`](./src/app/page.tsx)
- Root layout and metadata in [`src/app/layout.tsx`](./src/app/layout.tsx)
- Site favicon configured via metadata icons to `public/images/favicon.png`
- Global design tokens and Tailwind v4 theme variables in [`src/app/globals.css`](./src/app/globals.css)
- Static assets in `public/` and `images/`
- Resume PDFs in `resumes/`

The app is in the **"Exploration → Early Build"** phase (from `OVERVIEW.md`):
- Structure and narrative are being defined before full visual/system implementation
- Content exists, but routing/rendering architecture is not fully wired yet

## Tech stack (indexed from codebase)

### Framework and language
- Next.js `16.1.6` (App Router)
- React `19.2.3`
- TypeScript `^5` with `strict: true`

### Styling and UI
- Tailwind CSS `^4.2.1` (via `@tailwindcss/postcss`)
- AlignUI design system tokens/utilities (v1.2 setup)
- Geist fonts (`geist` package)
- Utility helper: `clsx`
- Icons: `@remixicon/react`
- Radix Slot: `@radix-ui/react-slot`
- Tailwind utility composition: `tailwind-merge`, `tailwind-variants`

### Content and markdown pipeline (installed)
- `gray-matter`
- `next-mdx-remote`
- `remark-gfm`
- `rehype-slug`
- `rehype-autolink-headings`
- `rehype-highlight`

Note: These are present in dependencies but not yet connected to active route rendering.

### Tooling
- ESLint 9 + `eslint-config-next`
- PostCSS
- Bun lockfile present (`bun.lockb`), scripts in `package.json` use Next defaults (`dev`, `build`, `start`, `lint`)

### AlignUI utility conventions

AlignUI core utilities are configured under `src/utils`:
- `cn.ts` for class merging (`clsx` + `tailwind-merge`)
- `tv.ts` for typed variant composition (`tailwind-variants`)
- `recursive-clone-children.ts` for controlled child cloning patterns
- `polymorphic.ts` for polymorphic component prop typing (`asChild` pattern)

AlignUI component foundation in `src/components/ui`:
- `segmented-control.tsx` (Radix Tabs-based, AlignUI pattern)
- `switch.tsx` (Radix Switch-based, AlignUI pattern)
- `avatar.tsx` + `avatar-empty-icons.tsx` (AlignUI Avatar pattern)
- `hover-border-gradient.tsx` (Aceternity CTA pattern adapted to scaffold tokens)
- Supporting hook: `src/hooks/use-tab-observer.ts`

Theme toggle implementation:
- `src/components/theme/theme-toggle.tsx` now uses AlignUI `SegmentedControl` primitives rather than ad-hoc markup.

Reference app strategy:
- Keep `alignui/` as a local reference workspace.
- For new UI components, source implementation from `alignui/components/**` first.
- Port copied components into `src/components/**` (do not import runtime components directly from `alignui/`).
- Validate and add required dependencies in this app’s `package.json`.
- Keep scaffold/global visual tokens in `src/config/site-scaffold.ts` as the single source of truth for site-wide styling.
- Keep profile-specific content/media/contact CTA in `src/config/site-profile.ts` as the single source of truth.
- Home avatar now tries multiple profile image paths from `siteProfileConfig.avatarSources` and falls back to initials when no image is found.

### Global UI scaffold conventions

The visual page frame is applied globally in `src/app/layout.tsx` through:
- `src/components/layout/site-scaffold.tsx`
- `src/config/site-scaffold.ts`

Customize scaffold behavior in `site-scaffold.ts`:
- Top offset above main container (`pageTopPadding`)
- Border and divider color/thickness
- Corner marker circles (`cornerMarkers.size`, `cornerMarkers.offset`, `cornerMarkers.borderWidth`)
- Full-bleed major section divider thickness
- Corner border extension fade lengths (`edgeExtensions.horizontalLength`, `edgeExtensions.verticalLength`)
- Canvas width and side ruler spacing
- Top ruler numbers
- Vertical ruler range/step + unit mapping (`rulerSide.start/end/step/unitPx`; default major marks at `50`-unit increments with pixel-based spacing and opacity fade toward bottom)
- Section count and minimum heights
- Current default uses a single active `hero` section and responsive `minHeight: clamp(520px, 82dvh, 900px)` to keep the first view larger on desktop while remaining responsive on smaller screens.

Single source of truth policy:
- All scaffold-wide visual tokens (light/dark background, line, ruler, and toggle colors) are defined in `siteScaffoldConfig.palette`.
- Rendering components should consume CSS variables set by `SiteScaffold` and avoid hardcoded scaffold colors.
- Layer model:
  - Layer 1 (`palette.*.background`) controls full-page background.
  - Standout containers use `palette.*.surface`.
- Use OKLCH values for scaffold color tokens.
- Use scaffold-owned background layers in layout components (avoid mutating `document.body.style` directly for theming).

### Signature conventions

- Hand-drawn signature geometry and animation timing are configured in `src/config/site-signature.ts`.
- Render with `src/components/brand/signature.tsx` (uses `motion/react` and honors reduced-motion).
- Production signature source is `public/images/signature.svg`; geometry in `site-signature.ts` should match that file.
- Place signature as supporting decoration only (default usage: right-aligned under intro copy).

### Theme conventions

- Theme switching is handled via `next-themes`.
- Provider is configured in `src/app/layout.tsx` with `defaultTheme="light"` and `enableSystem={false}`.
- Global toggle UI is rendered from `src/components/theme/theme-toggle.tsx` inside the scaffold header so it appears on every page.

## Content architecture currently present

Content is file-based and already organized:
- `content/pages/*.mdx` for static profile pages (about, resume, now)
- `content/projects/*.mdx` for case studies/projects
- `content/writing/*.mdx` for articles/essays

Observed frontmatter fields include:
- Common: `title`, `description`
- Optional: `date`, `tags`, `stack`, `role`, `outcomes`, `featured`, `order`, `takeaways`

MDX content references custom components (not currently implemented in `src/`):
- `<ContactForm />`
- `<Figure />`

## Product intent to preserve (from OVERVIEW)

When implementing new pages/components, keep these constraints explicit:
- Audience: hiring managers, senior ICs, product/engineering/design leaders
- Goal: demonstrate problem framing, systems judgment, and delivery quality
- Tone: calm confidence, coherence, internal consistency
- Avoid: filler content, hype framing, performative complexity
- Design: subtle motion/micro-interactions that support reading flow and structure

## Canonical information architecture target

`OVERVIEW.md` points to these primary sections for the next milestone:
- Work
- Thinking
- Systems
- About

Current `content/` already partially maps to this target (`projects`, `writing`, `pages`).

## How to run

- Development: `bun dev` (or `npm run dev`)
- Build: `bun run build` (or `npm run build`)
- Start: `bun run start` (or `npm run start`)
- Lint: `bun run lint` (or `npm run lint`)

## Notes for future implementation

To align runtime with authored content and overview intent:
1. Implement file-based MDX loaders for `content/pages`, `content/projects`, and `content/writing`.
2. Add route structure that reflects canonical sections (`/work`, `/thinking`, `/systems`, `/about`).
3. Implement and map MDX components (`Figure`, `ContactForm`) safely.
4. Replace starter metadata/title with project-specific metadata and SEO baseline.
5. Keep visual decisions subordinate to readability, narrative coherence, and evidence quality.

## Documentation provenance

This file was generated by indexing the repository and synthesizing:
- `OVERVIEW.md`
- `README.md`
- `package.json`
- Next.js/Tailwind/TypeScript config files
- `src/app/*`
- `content/**/*`
