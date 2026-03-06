# francisc.cv

Portfolio and structured narrative site for Francisc Furdui. The implementation prioritizes evidence-backed positioning, readable systems framing, and restrained visual polish over hype.

## Homepage Structure

The homepage intentionally preserves the original intro copy as the primary narrative block. New sections below the hero are ordered for fast recruiter and AI-tool scanning:

1. Identity support
2. Systems I build
3. Selected work

This creates a clearer scan path without discarding the existing tone or first-person framing.

## Art Lab

The `/art` page is a standalone tool route: it keeps the site theme tokens but bypasses the regular scaffold and navigation so the page behaves as a full-bleed instrument surface.

The route renders a fifteen-canvas preview grid driven by a single shared instrument model. The grid is organized as three rows of five: squares (indices 0–4), circles (5–9), and lines (10–14), with element count stepping up from left to right so comparisons stay within one shape family. The renderer uses a restrained sine/cosine core and explicit shape branches; the square row is closest to the ring-based reference look, while the circle and line rows stay simpler.

Control is a single parameters panel on the left: each row shows a prop label and its current value. One prop is selected at a time. Scroll over the panel to adjust the selected parameter; arrow keys change which parameter is selected; press `0` to reset the selected parameter to its default. Config and drawing live in `src/lib/art-algo-config.ts` and `src/lib/art-algo-draw.ts`. The lab does not use URL state or article/work assignments; it is self-contained.

Hero art on work and thinking pages is still supplied by `src/config/art-assignments.ts` and rendered via `ArtCanvas`; that pipeline is separate from the Art Lab.

## Human / Machine Mode

The site now includes a fixed viewport switch that swaps between:

- `Human`: the full portfolio interface with scaffold, navigation, and motion treatments
- `Machine`: a generated MDX-style site index focused on text, links, and ASCII layout artifacts

The machine surface is rendered as an overlay so the human version remains the default implementation underneath. Internal links inside the machine view return the user to the human version before navigating, which keeps the interaction readable instead of turning the machine layer into a second visual shell.
The floating mode switch relies on the shared `ButtonGroup` item styles with an explicit scaffold-tinted surface on both the group and the individual segments so the control stays legible while overlaying page content in both themes and across breakpoints. Its border and label colors are now hard-set in OKLCH for the two themes: light uses `oklch(0.9128 0 89.88)` border with `oklch(0.5521 0 89.88)` text, and dark uses `oklch(0.3052 0 89.88)` border with `oklch(0.6500 0 89.88)` text. The loading overlay and machine surface now inject their own theme tokens directly instead of depending on scaffold CSS variables from a sibling subtree.

The scaffold layout was also corrected to stay single-column on mobile. The central frame now uses a responsive grid definition instead of a hardcoded multi-column width, and the scaffold container uses a minimum viewport height so long pages can expand without collapsing into a narrow strip.

## Machine-Readable Surfaces

- A single `Person` JSON-LD block is rendered in the root layout.
- `/profile.json` exposes a public machine-readable summary for tooling and discovery workflows.

Both surfaces are backed by shared config in `src/config/site-home.ts` so metadata, homepage positioning, and proof artifacts stay aligned.

## Positioning Rules

- Keep AI-forward claims tied to named work or published evidence.
- Treat Aceternity as reference material for selective card and spotlight patterns, not as the primary design system.
- Preserve the scaffold’s existing palette, border language, and motion restraint when introducing new UI treatments.

## Getting Started

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Next config now pins Turbopack and output tracing to this repository root. That prevents local parent-folder lockfiles from confusing Next's workspace detection and breaking `bun dev` module resolution.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Quality Checks

Run the project checks locally:

```bash
bun run lint
bun run typecheck
bun run build
```

CI is configured in `.github/workflows/ci.yml` and runs the same checks on pull requests and pushes to `main`.

## Dependency Notes

- `next-mdx-remote` was upgraded from `5.0.0` to `6.0.0` to address the Vercel-blocking security advisory (`CVE-2026-0969`).
- `react` and `react-dom` were upgraded to `19.2.4`.
- `eslint` remains on `9.x` (latest compatible) because the current Next.js lint plugin stack has peer ranges targeting ESLint `<=9`.
- `@types/node` remains on `20.x` to align with the project runtime baseline instead of tracking Node 25 type APIs.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
