# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start dev server
pnpm build      # production build
pnpm start      # serve production build
pnpm lint       # run ESLint
```

No test suite is configured.

## Architecture

Personal portfolio site built with **Next.js 16 App Router**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

### Content layer

All content lives in `content/` as MDX files:

- `content/projects/*.mdx` — case studies
- `content/writing/*.mdx` — articles
- `content/pages/*.mdx` — static pages (`about`, `resume`, `now`)

**`src/lib/content.ts`** reads and parses all MDX using `gray-matter`. Every exported function (`getProjects`, `getWriting`, `getPageContent`, `getSearchEntries`, etc.) is wrapped in React's `cache()`. Slug is derived from the filename. Content is never fetched from an API — it is always read from disk at build time.

**`src/lib/mdx.tsx`** compiles raw MDX source (the `raw` field from content) into React elements via `next-mdx-remote/rsc`. This is where remark/rehype plugins are applied (GFM, syntax highlighting, slug + autolink headings).

**`src/types/content.ts`** defines the frontmatter and entry types. Required frontmatter fields:

- **Project**: `title`, `description`, `role`, `tags[]`, `stack[]`, `outcomes[]`; optional: `links{github?,live?,doc?}`, `featured`, `order`
- **Writing**: `title`, `description`, `date` (ISO string), `tags[]`; optional: `takeaways[]`
- **Page**: `title`, `description`

### Routing

Standard App Router conventions in `src/app/`. Dynamic routes (`/projects/[slug]`, `/writing/[slug]`) use `generateStaticParams` to pre-render all slugs from the content directory.

### Component structure

- `src/components/site/` — layout-level components: `AppShell` (client wrapper that owns command palette state), `Header`, `Footer`, `CommandPalette`, `ThemeToggle`, `HeroSpectrum`, `Analytics`
- `src/components/ui/` — design primitives: `Panel`/`PanelHeader`/`PanelRow`/`MetaLine`, `Badge`, `CodeBlock`, `SearchInput`, `Skeleton`, `CopyButton`
- `src/components/mdx/` — components injected into MDX via `mdxComponents` map: `Callout`, `Figure`, `Steps`, `LinkCard`, `ContactForm`, `Badge`, `InlineCode`

The `AppShell` in `src/components/site/app-shell.tsx` is a client component that wraps every page. Search entries are loaded server-side in `layout.tsx` and passed down as props.

### Styling

Tailwind CSS v4 with `@tailwindcss/postcss`. Design tokens are CSS custom properties on `:root`, exposed as Tailwind color utilities via `@theme inline` in `src/app/globals.css`:

| Token | Utility |
|---|---|
| `--bg` | `bg-bg`, `text-bg` |
| `--fg` | `text-fg` |
| `--muted` | `text-muted` |
| `--card` / `--card2` | `bg-card`, `bg-card2` |
| `--border` / `--border2` | `border-border`, `border-border2` |
| `--accent` | `text-accent`, `bg-accent` |
| `--accent-muted` | `bg-accent-muted` |

Light/dark theme is toggled by adding `.light` or `.dark` to `<html>`. The class is persisted to `localStorage` under key `francisc-theme`. An inline script in `layout.tsx` reads this before hydration to prevent flash.

Custom utility classes defined in `globals.css`: `.tone-border`, `.panel`, `.tone-divider`, `.link-underline`, `.prose-shell`, `.anchor-link`.

Fonts: Geist Sans (`font-sans`), Geist Mono (`font-mono`), Geist Pixel Square (`font-pixel`) — all from the `geist` package, applied as CSS variables in `layout.tsx`.

### Site-wide config

**`src/lib/site.ts`** exports `siteConfig` (name, URL, nav links, social links, skills/signals) and `paletteHint`. Update this file when changing navigation or personal metadata.
