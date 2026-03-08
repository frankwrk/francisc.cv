# francisc.cv

Portfolio and structured narrative site for Francisc Furdui. The implementation prioritizes evidence-backed positioning, readable systems framing, and restrained visual polish over hype.

## Portfolio Assistant

The site now includes a V1 portfolio assistant available from the human-facing scaffold. It is intentionally narrow:

- single server-side assistant route at `/api/assistant/chat`
- OpenAI Responses API for generation
- hosted `file_search` over an approved public corpus
- structured answer validation with Zod
- no multi-agent runtime, durable user memory, browsing, or tool calling beyond retrieval

The assistant now answers in first person for a more direct conversational feel, but it remains strictly constrained to the approved public source material rather than improvising as a free-form persona.

Interaction model:

- desktop access is a nav-level `Ask about my work` trigger placed just before the theme toggle
- mobile access is available from the nav menu instead of a floating launcher
- the assistant opens as a centered modal with a blurred backdrop so it reads as part of the portfolio shell, not a separate app

This architecture was chosen because the main product risk is answer grounding, not orchestration. Hosted file search keeps retrieval operationally light for V1 and makes it easier to ship a constrained, reviewable assistant before taking on custom vector infrastructure.

### Assistant Environment

Set these variables for local or deployed assistant use:

```bash
OPENAI_API_KEY=
OPENAI_RESPONSES_MODEL=gpt-5-mini
OPENAI_VECTOR_STORE_ID=
OPENAI_PROJECT_ID=
OPENAI_RESPONSES_STORE=
ASSISTANT_LOG_CONTENT=
```

`gpt-5-mini` is the default because it is fast, relatively inexpensive, and strong enough for short retrieval-grounded portfolio answers. The assistant request intentionally does not send `temperature`, because GPT-5 Responses requests in this flow reject that parameter.

For GPT-5 models, the assistant also forces `reasoning.effort = "low"`. That keeps enough budget available for the structured JSON answer when `file_search` is enabled; the model's default reasoning effort was causing otherwise-valid responses to end in `max_output_tokens` cutoffs.

The deployed chat route also exports `maxDuration = 60` so Vercel gives the assistant enough execution time for hosted `file_search` and structured output. Without that explicit budget, production can fail with `FUNCTION_INVOCATION_TIMEOUT` even when local development works.

`OPENAI_RESPONSES_STORE` controls whether assistant Responses API calls are stored in OpenAI for later inspection in the project dashboard. It defaults to enabled in local development and disabled elsewhere unless you opt in explicitly.

`ASSISTANT_LOG_CONTENT` controls whether the app's own server logs include safe text previews of user questions, answers, caveats, and citation titles. It also defaults to enabled in local development and disabled elsewhere unless you opt in explicitly.

### Assistant Corpus Workflow

The assistant corpus is normalized from the existing authored content plus assistant-specific markdown under `content/assistant/`.

Build the local corpus artifact:

```bash
bun run assistant:build-corpus
```

Upload it to the hosted vector store:

```bash
bun run assistant:upload-corpus
```

The build writes:

- `data/assistant/public-corpus.json`
- `data/assistant/files/*.md`

The upload step writes:

- `data/assistant/vector-store-manifest.json`

That manifest is used to map file-search hits back to public URLs so the assistant can render source badges in the UI.

### Assistant Answer Contract

Every successful assistant response is normalized into:

- `answer`
- `caveat`
- `citations`
- `supportLevel`

If retrieval support is weak, the response is deliberately narrowed and marked as partial or insufficient rather than padded with speculation.

The runtime is also tuned for lower token burn:

- prompt-chip questions are sent statelessly
- typed follow-ups only send the most recent exchange plus the new question
- GPT-5 requests use `reasoning.effort = "low"`
- model verbosity is forced to `low`
- route logs capture token usage breakdowns so model behavior can be inspected over time

Optimization notes are tracked in [performance-optimizations.md](/Users/frank/dev/Code/Work/francisc.cv/performance-optimizations.md).

### Assistant Log Review

You can review exported dev or Vercel runtime logs with:

```bash
bun run assistant:review-logs path/to/assistant-logs.ndjson
```

or:

```bash
cat path/to/assistant-logs.ndjson | bun run assistant:review-logs
```

The script scans newline-delimited JSON logs for `scope: "portfolio-assistant"` and summarizes:

- support-level distribution
- prompt-chip usage by question text
- weak-support prompts
- repeated continuation-style follow-ups
- repeated answers to continuation requests
- failure stages and token averages

This is intended as a lightweight weekly review tool for spotting prompt drift, weak follow-up handling, and recurring low-quality question patterns.


Full implementation notes live in [docs/portfolio-assistant.md](/Users/frank/dev/Code/Work/francisc.cv/docs/portfolio-assistant.md).

## Homepage Structure

The homepage intentionally preserves the original intro copy as the primary narrative block. New sections below the hero are ordered for fast recruiter and AI-tool scanning:

1. Identity support
2. Systems I build
3. Selected work

This creates a clearer scan path without discarding the existing tone or first-person framing.

## Art Lab

The `/art` page is now the canonical hero-art editor for work and thinking entries. It still uses the current fifteen-canvas algorithmic lab as the editing surface, but it now supports loading an existing slug assignment, choosing which of the fifteen canvases becomes the hero, assigning the current state to a slug locally, and copying a merged export back into `src/config/art-assignments.ts`.

The route renders a fifteen-canvas preview grid driven by one shared `AlgoArtConfig`. The grid remains organized as three rows of five: squares (indices `0–4`), circles (`5–9`), and lines (`10–14`). The selected `heroCanvasIndex` determines which canvas a work or thinking page renders through `ArtCanvas`.

Control is still a single parameters panel: scroll over the panel to adjust the selected property, use arrow keys to move between properties, and press `0` to reset the selected property to its default. Config and drawing live in `src/lib/art-algo-config.ts` and `src/lib/art-algo-draw.ts`.

Saved hero-art assignments continue to live in `src/config/art-assignments.ts`. New assignments use the canonical `algo-v1` shape:

```ts
type ArtAssignment = {
  version: "algo-v1";
  heroCanvasIndex: number;
  config: AlgoArtConfig;
};
```

Legacy entries in `src/config/art-assignments.ts` are still readable at runtime. The editor normalizes them on load, and all new copied exports from `/art` use `algo-v1`.

Assignment storage and exports are now namespaced by route type, so new keys are emitted as `work:slug` or `thinking:slug`. Runtime reads still fall back to legacy raw-slug keys in `src/config/art-assignments.ts` so existing committed entries keep working during migration.

The editor also avoids continuous repainting when `prefers-reduced-motion` is enabled, and imported config values are coerced and clamped through `src/lib/art-algo-config.ts` before they reach the renderer.

The intended workflow is:

1. Open `/art` directly, or use the gear icon from a work/thinking hero.
2. Tune the shared lab parameters.
3. Pick the hero canvas from the fifteen previews.
4. Assign the current state to a work or thinking slug.
5. Copy the full export and paste it into `src/config/art-assignments.ts`.

## Human / Machine Mode

The site now includes a fixed viewport switch that swaps between:

- `Human`: the full portfolio interface with scaffold, navigation, and motion treatments
- `Machine`: a generated MDX-style site index focused on text, links, and ASCII layout artifacts

The machine surface is rendered as an overlay so the human version remains the default implementation underneath. Internal links inside the machine view return the user to the human version before navigating, which keeps the interaction readable instead of turning the machine layer into a second visual shell.
The floating mode switch relies on the shared `ButtonGroup` item styles with an explicit scaffold-tinted surface on both the group and the individual segments so the control stays legible while overlaying page content in both themes and across breakpoints. Its border and label colors are now hard-set in OKLCH for the two themes: light uses `oklch(0.9128 0 89.88)` border with `oklch(0.5521 0 89.88)` text, and dark uses `oklch(0.3052 0 89.88)` border with `oklch(0.6500 0 89.88)` text. The loading overlay and machine surface now inject their own theme tokens directly instead of depending on scaffold CSS variables from a sibling subtree.
Shared scaffold shell CSS variables are now built from a single helper and include palette-owned machine surface tokens, so `AppShell` and `SiteScaffold` no longer drift on hardcoded surface colors.

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
