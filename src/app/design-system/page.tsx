import { Sparkles } from "lucide-react";
import { siteScaffoldConfig } from "@/config/site-scaffold";

type TokenSwatchProps = {
  name: string;
  cssVar: string;
  description?: string;
};

function TokenSwatch({ name, cssVar, description }: TokenSwatchProps) {
  return (
    <div className="flex items-center gap-3 text-[13px] leading-relaxed">
      <div
        className="h-8 w-8 rounded border border-[color-mix(in_oklab,var(--scaffold-line)_60%,transparent)]"
        style={{ backgroundColor: `var(${cssVar})` }}
        aria-hidden
      />
      <div className="space-y-0.5">
        <div className="font-medium text-(--scaffold-toggle-text-active)">
          {name}
        </div>
        <code className="rounded bg-[color-mix(in_oklab,var(--scaffold-bg)_75%,transparent)] px-1.5 py-0.5 text-[11px] text-(--scaffold-ruler)">
          {cssVar}
        </code>
        {description ? (
          <p className="text-[11px] text-(--scaffold-ruler)">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  const { palette } = siteScaffoldConfig;

  return (
    <article className="max-w-4xl space-y-10 pt-2 [font-family:var(--font-geist-sans)]">
      <header className="space-y-2">
        <p className="text-[10px] tracking-[0.22em] text-(--scaffold-ruler) [font-family:var(--font-geist-pixel-square)]">
          DESIGN SYSTEM
        </p>
        <h1 className="text-2xl tracking-tight text-(--scaffold-toggle-text-active)">
          Visual language for francisc.cv
        </h1>
        <p className="max-w-3xl text-[14px] leading-6 text-(--scaffold-ruler)">
          This page is a working reference for the type system, scaffold tokens,
          and core UI primitives currently wired into the site. It&apos;s meant
          as a control surface while you tune fonts, colors, and layout without
          guessing where things are used.
        </p>
      </header>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-[0.18em] text-(--scaffold-ruler) [font-family:var(--font-geist-pixel-square)]">
          TYPOGRAPHY
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 rounded border border-(--scaffold-line) bg-(--scaffold-bg) p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-(--scaffold-ruler) [font-family:var(--font-geist-pixel-square)]">
              Geist Sans
            </p>
            <div className="space-y-1 [font-family:var(--font-geist-sans)]">
              <p className="text-[20px] font-medium tracking-tight text-(--scaffold-toggle-text-active)">
                Heading — Geist Sans
              </p>
              <p className="text-[13px] leading-relaxed text-(--scaffold-ruler)">
                Used for primary reading text and headings throughout the site.
              </p>
            </div>
          </div>

          <div className="space-y-2 rounded border border-(--scaffold-line) bg-(--scaffold-bg) p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-(--scaffold-ruler) [font-family:var(--font-geist-pixel-square)]">
              Geist Mono
            </p>
            <div className="space-y-1 [font-family:var(--font-geist-mono)]">
              <p className="text-[20px] font-medium tracking-tight text-(--scaffold-toggle-text-active)">
                Mono — Geist Mono
              </p>
              <p className="text-[13px] leading-relaxed text-(--scaffold-ruler)">
                Available for code, metrics, or technical labels where fixed
                width helps scanning.
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded border border-(--scaffold-line) bg-(--scaffold-bg) p-4 md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.16em] text-(--scaffold-ruler) [font-family:var(--font-geist-pixel-square)]">
              Pixel variants
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1 [font-family:var(--font-geist-pixel-square)]">
                <p className="text-[13px] tracking-[0.18em] text-(--scaffold-toggle-text-active)">
                  PIXEL SQUARE
                </p>
                <p className="text-[11px] text-(--scaffold-ruler)">
                  Used in ruler labels and small structural chrome.
                </p>
              </div>
              <div className="space-y-1 [font-family:var(--font-geist-pixel-grid)]">
                <p className="text-[13px] tracking-[0.18em] text-(--scaffold-toggle-text-active)">
                  PIXEL GRID
                </p>
                <p className="text-[11px] text-(--scaffold-ruler)">
                  Available for number systems and scaffold metrics.
                </p>
              </div>
              <div className="space-y-1 [font-family:var(--font-geist-pixel-circle)]">
                <p className="text-[13px] tracking-[0.18em] text-(--scaffold-toggle-text-active)">
                  PIXEL CIRCLE / TRIANGLE / LINE
                </p>
                <p className="text-[11px] text-(--scaffold-ruler)">
                  Used for small accents in nav, toggles, and section labels.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="rounded border border-(--scaffold-line) bg-black px-4 py-6 text-[32px] leading-tight text-white [font-family:var(--font-geist-pixel-circle)]">
                What will you ship next?
              </div>
              <div className="rounded border border-(--scaffold-line) bg-black px-4 py-6 text-[32px] leading-tight text-white [font-family:var(--font-geist-pixel-square)]">
                What will you ship next?
              </div>
              <div className="rounded border border-(--scaffold-line) bg-black px-4 py-6 text-[32px] leading-tight text-white [font-family:var(--font-geist-pixel-grid)]">
                What will you ship next?
              </div>
              <div className="rounded border border-(--scaffold-line) bg-black px-4 py-6 text-[32px] leading-tight text-white [font-family:var(--font-geist-pixel-triangle)]">
                What will you ship next?
              </div>
              <div className="rounded border border-(--scaffold-line) bg-black px-4 py-6 text-[32px] leading-tight text-white [font-family:var(--font-geist-pixel-line)]">
                What will you ship next?
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scaffold palette */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-[0.18em] text-(--scaffold-ruler) [font-family:var(--font-geist-pixel-square)]">
          SCAFFOLD PALETTE
        </h2>
        <p className="max-w-3xl text-[13px] leading-relaxed text-(--scaffold-ruler)">
          These tokens drive the frame: background layers, canvas surface,
          rulers, borders, and section dividers. Changes here affect nearly
          every page, so this section is the safest place to tune values.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 rounded border border-(--scaffold-line) bg-(--scaffold-bg) p-4">
            <p className="text-[11px] font-medium tracking-[0.14em] text-(--scaffold-ruler) [font-family:var(--font-geist-pixel-square)]">
              Light mode preview
            </p>
            <div className="rounded border border-(--scaffold-line)">
              <div className="site-scaffold space-y-3 bg-(--scaffold-bg) p-3">
                <TokenSwatch
                  name="Background"
                  cssVar="--scaffold-bg"
                  description="Outer background behind the canvas."
                />
                <TokenSwatch
                  name="Surface"
                  cssVar="--scaffold-surface"
                  description="Canvas surface inside the frame."
                />
                <TokenSwatch
                  name="Lines"
                  cssVar="--scaffold-line"
                  description="Borders, ruler ticks, and section dividers."
                />
                <TokenSwatch
                  name="Ruler text"
                  cssVar="--scaffold-ruler"
                  description="Numbers/labels on rulers and chrome."
                />
                <TokenSwatch
                  name="Primary text"
                  cssVar="--scaffold-toggle-text-active"
                  description="Primary reading text and key labels."
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded border border-(--scaffold-line) bg-(--scaffold-bg) p-4">
            <p className="text-[11px] font-medium tracking-[0.14em] text-(--scaffold-ruler) [font-family:var(--font-geist-pixel-square)]">
              Dark mode preview
            </p>
            <div className="rounded border border-(--scaffold-line)">
              <div className="dark">
                <div className="site-scaffold space-y-3 bg-(--scaffold-bg) p-3">
                  <TokenSwatch name="Background" cssVar="--scaffold-bg" />
                  <TokenSwatch name="Surface" cssVar="--scaffold-surface" />
                  <TokenSwatch name="Lines" cssVar="--scaffold-line" />
                  <TokenSwatch
                    name="Ruler text"
                    cssVar="--scaffold-ruler"
                  />
                  <TokenSwatch
                    name="Primary text"
                    cssVar="--scaffold-toggle-text-active"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded border border-(--scaffold-line) bg-(--scaffold-bg) p-4 text-[12px] text-(--scaffold-ruler) md:grid-cols-2">
          <div className="space-y-1">
            <div className="text-[11px] font-medium tracking-[0.14em] text-(--scaffold-toggle-text-active) [font-family:var(--font-geist-pixel-square)]">
              Raw light palette
            </div>
            <ul className="space-y-1">
              <li>background: {palette.light.background}</li>
              <li>surface: {palette.light.surface}</li>
              <li>line: {palette.light.line}</li>
              <li>ruler: {palette.light.ruler}</li>
              <li>toggleTextActive: {palette.light.toggleTextActive}</li>
              <li>toggleTextInactive: {palette.light.toggleTextInactive}</li>
            </ul>
          </div>
          <div className="space-y-1">
            <div className="text-[11px] font-medium tracking-[0.14em] text-(--scaffold-toggle-text-active) [font-family:var(--font-geist-pixel-square)]">
              Raw dark palette
            </div>
            <ul className="space-y-1">
              <li>background: {palette.dark.background}</li>
              <li>surface: {palette.dark.surface}</li>
              <li>line: {palette.dark.line}</li>
              <li>ruler: {palette.dark.ruler}</li>
              <li>toggleTextActive: {palette.dark.toggleTextActive}</li>
              <li>toggleTextInactive: {palette.dark.toggleTextInactive}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Layout primitives */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-[0.18em] text-(--scaffold-ruler) [font-family:var(--font-geist-pixel-square)]">
          LAYOUT PRIMITIVES
        </h2>
        <p className="max-w-3xl text-[13px] leading-relaxed text-(--scaffold-ruler)">
          These values control the overall frame: canvas width, side rails, and
          section structure. They&apos;re wired through{" "}
          <code className="rounded bg-[color-mix(in_oklab,var(--scaffold-bg)_75%,transparent)] px-1.5 py-0.5 text-[11px]">
            siteScaffoldConfig
          </code>{" "}
          rather than arbitrary CSS.
        </p>
        <div className="grid gap-4 rounded border border-(--scaffold-line) bg-(--scaffold-bg) p-4 text-[13px] text-(--scaffold-ruler) md:grid-cols-2">
          <div className="space-y-1">
            <div className="font-medium text-(--scaffold-toggle-text-active)">
              Canvas width
            </div>
            <p>
              <code className="rounded bg-[color-mix(in_oklab,var(--scaffold-bg)_75%,transparent)] px-1.5 py-0.5 text-[11px]">
                {siteScaffoldConfig.canvasMaxWidth}px
              </code>
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-(--scaffold-toggle-text-active)">
              Side rail width
            </div>
            <p>
              <code className="rounded bg-[color-mix(in_oklab,var(--scaffold-bg)_75%,transparent)] px-1.5 py-0.5 text-[11px]">
                {siteScaffoldConfig.sideRailWidth}
              </code>
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-(--scaffold-toggle-text-active)">
              Top padding
            </div>
            <p>
              <code className="rounded bg-[color-mix(in_oklab,var(--scaffold-bg)_75%,transparent)] px-1.5 py-0.5 text-[11px]">
                {siteScaffoldConfig.pageTopPadding}px
              </code>
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-(--scaffold-toggle-text-active)">
              Sections
            </div>
            <p>
              {siteScaffoldConfig.sections.length} configured sections; the
              first is the hero canvas and the rest are reserved for future
              content.
            </p>
          </div>
        </div>
      </section>

      {/* Components & primitives */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium tracking-[0.18em] text-(--scaffold-ruler) [font-family:var(--font-geist-pixel-square)]">
          COMPONENT PRIMITIVES
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Buttons */}
          <div className="space-y-3 rounded border border-(--scaffold-line) bg-(--scaffold-bg) p-4">
            <p className="text-[11px] font-medium tracking-[0.14em] text-(--scaffold-toggle-text-active) [font-family:var(--font-geist-pixel-square)]">
              Buttons
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-(--scaffold-line) bg-(--scaffold-surface) px-4 py-2 text-[13px] font-medium text-(--scaffold-toggle-text-active)"
              >
                Primary button
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-(--scaffold-line) bg-transparent px-4 py-2 text-[13px] text-(--scaffold-ruler)"
              >
                Ghost button
              </button>
            </div>
            <p className="text-[11px] leading-relaxed text-(--scaffold-ruler)">
              Rounded-full buttons with 1px border and scaffold surface
              background. The assistant CTA builds on this pattern with animated
              borders.
            </p>
          </div>

          {/* Borders & corners */}
          <div className="space-y-3 rounded border border-(--scaffold-line) bg-(--scaffold-bg) p-4">
            <p className="text-[11px] font-medium tracking-[0.14em] text-(--scaffold-toggle-text-active) [font-family:var(--font-geist-pixel-square)]">
              Borders & radius
            </p>
            <div className="grid gap-3 text-[12px] text-(--scaffold-ruler)">
              <div className="space-y-1">
                <p className="font-medium text-(--scaffold-toggle-text-active)">
                  Scaffold frame
                </p>
                <p>
                  Border width:{" "}
                  <code className="rounded bg-[color-mix(in_oklab,var(--scaffold-bg)_75%,transparent)] px-1.5 py-0.5 text-[11px]">
                    {siteScaffoldConfig.borderWidth}px
                  </code>
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-(--scaffold-toggle-text-active)">
                  Corner markers
                </p>
                <p>
                  Size:{" "}
                  <code className="rounded bg-[color-mix(in_oklab,var(--scaffold-bg)_75%,transparent)] px-1.5 py-0.5 text-[11px]">
                    {siteScaffoldConfig.cornerMarkers.size}px
                  </code>{" "}
                  · Radius: circular · Border:{" "}
                  <code className="rounded bg-[color-mix(in_oklab,var(--scaffold-bg)_75%,transparent)] px-1.5 py-0.5 text-[11px]">
                    {siteScaffoldConfig.cornerMarkers.borderWidth}px
                  </code>
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-(--scaffold-toggle-text-active)">
                  Corner radius palette
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-10 rounded bg-(--scaffold-surface)" />
                  <div className="h-6 w-10 rounded-md bg-(--scaffold-surface)" />
                  <div className="h-6 w-10 rounded-full bg-(--scaffold-surface)" />
                </div>
              </div>
            </div>
          </div>

          {/* Icons */}
          <div className="space-y-3 rounded border border-(--scaffold-line) bg-(--scaffold-bg) p-4">
            <p className="text-[11px] font-medium tracking-[0.14em] text-(--scaffold-toggle-text-active) [font-family:var(--font-geist-pixel-square)]">
              Icons
            </p>
            <div className="flex items-center gap-3 text-[13px] text-(--scaffold-ruler)">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-(--scaffold-line) bg-(--scaffold-surface)">
                <Sparkles className="h-4 w-4 text-(--scaffold-toggle-text-active)" />
              </div>
              <p>
                Icons are provided by{" "}
                <code className="rounded bg-[color-mix(in_oklab,var(--scaffold-bg)_75%,transparent)] px-1.5 py-0.5 text-[11px]">
                  lucide-react
                </code>{" "}
                and styled via scaffold tokens. The Sparkles icon also anchors
                the assistant CTA.
              </p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

