# francisc.cv

Portfolio-grade personal site built with Next.js 16 App Router, TypeScript, Tailwind CSS v4, and a content-first MDX workflow.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4 with CSS variable tokens
- MDX content in `/content` (no CMS/database)
- Geist Sans + Geist Mono + Geist Pixel via `geist/font/*`

## Run

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
pnpm start
```

## Content model

All long-form content lives in `/content`:

- `content/projects/*.mdx`
- `content/writing/*.mdx`
- `content/pages/about.mdx`
- `content/pages/resume.mdx`
- `content/pages/now.mdx`

Frontmatter examples:

### Project

```yaml
title: "Project title"
description: "One-line summary"
role: "Role"
tags: ["Product", "UX"]
stack: ["Next.js", "TypeScript"]
outcomes:
  - "Outcome one"
links:
  github: "https://github.com/..."
featured: true
order: 1
```

### Writing

```yaml
title: "Post title"
description: "Post summary"
date: "2026-01-14"
tags: ["Systems", "UX"]
takeaways:
  - "Key takeaway"
```

## Add new content

1. Add a new `.mdx` file under the relevant `content/*` folder.
2. Include frontmatter fields matching existing examples.
3. Restart `pnpm dev` if file discovery does not hot-reload in your editor.

## MDX components

Custom MDX components are mapped in:

- `src/components/mdx/mdx-components.tsx`

Available components include:

- `Callout`
- `Badge`
- `Figure`
- `InlineCode`
- `Steps`
- `Table`
- `LinkCard`
- `ContactForm`

## Design system tokens

Theme tokens are defined in `src/app/globals.css`:

- `--bg`
- `--fg`
- `--muted`
- `--border`
- `--border2`
- `--card`
- `--card2`
- `--accent`
- `--accent-muted`
- `--ring`

These are mapped into Tailwind v4 utilities through `@theme inline`.

## Geist Pixel notes

This project uses Geist Pixel directly through `geist/font/pixel` in `src/app/layout.tsx`.

If you need a local fallback:

1. Add font files under `public/fonts/` (example: `GeistPixelSquare.woff2`).
2. Swap to `next/font/local` in `src/app/layout.tsx` for the pixel accent font.
3. Keep CSS variable naming aligned with `--font-geist-pixel-square` to avoid style changes.

Reference:

- [Introducing Geist Pixel](https://vercel.com/blog/introducing-geist-pixel)
- [Vercel Font docs](https://vercel.com/font)

## Resume PDF

- Public file path: `public/resume.pdf`
- Resume page source: `content/pages/resume.mdx`
- Role-specific resume variants: `public/resumes/*.pdf`

Current default download (`public/resume.pdf`) points to the Technical Product Manager version.
The resume page also exposes role-specific links for cybersecurity, UI/UX, WordPress, and general applications.

To update:

1. Replace `public/resume.pdf` with the latest version.
2. Replace or add variants under `public/resumes/` using stable slug filenames.
3. Update `content/pages/resume.mdx` links and highlights to match the latest role-specific narratives.

## SEO and metadata

- Global metadata: `src/app/layout.tsx`
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`
- OG image: `src/app/opengraph-image.tsx`

## Notes

- Command palette (`⌘K` / `Ctrl+K`) indexes pages, projects, and writing entries from local content.
- Search is local and build-time sourced; no external service required.
- Analytics hook is a placeholder component in `src/components/site/analytics.tsx`.
