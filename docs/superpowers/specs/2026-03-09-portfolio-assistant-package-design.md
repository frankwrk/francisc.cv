# Portfolio Assistant — npm Package (Sub-project 1)

**Date:** 2026-03-09
**Scope:** Monorepo skeleton + core + Next.js adapter + CLI `create` mode for Next.js

This is sub-project 1 of a larger initiative to package and distribute the francisc.cv Portfolio Assistant as an open-source npm package anyone can install on their portfolio site.

## Full project decomposition

The complete initiative has four independent sub-projects. Each has its own spec → plan → implementation cycle:

1. **Sub-project 1 (this spec):** Monorepo skeleton, `@portfolio-assistant/core`, `@portfolio-assistant/openai`, `@portfolio-assistant/react`, `@portfolio-assistant/next`, CLI `create` mode for Next.js
2. **Sub-project 2:** Additional framework adapters (Astro, Remix, SvelteKit, Vite) + CLI templates
3. **Sub-project 3:** Additional LLM provider adapters (Anthropic, Gemini)
4. **Sub-project 4:** Additional vector backend adapters (Pinecone, Supabase pgvector, local/FAISS)

---

## Section 1: Monorepo structure & release pipeline

### Repository layout

```
portfolio-assistant/
├── packages/
│   ├── core/          → @portfolio-assistant/core
│   ├── openai/        → @portfolio-assistant/openai
│   ├── react/         → @portfolio-assistant/react
│   └── next/          → @portfolio-assistant/next
├── apps/
│   └── cli/           → create-portfolio-assistant (CLI binary)
├── templates/
│   └── next/          → Next.js starter (copied by CLI, not published to npm)
├── turbo.json
├── package.json       → bun workspace root
└── .changeset/
```

### Package dependency graph

```
core  ←  openai
core  ←  react
core  ←  next  (depends on react + openai)
cli        (no package deps — copies templates, never imports them)
```

`core` has zero framework dependencies. `react` depends only on `core` + React peer deps. `next` depends on `core` + `react` + Next.js peer deps. `openai` depends on `core` + the `openai` npm package.

The CLI (`apps/cli`) copies template files at runtime — it never imports portfolio-assistant packages. The template files that get copied into the consumer's project contain imports like `from '@portfolio-assistant/next'`, but those are resolved in the consumer's project after `npm install`, not in the CLI itself.

### Tooling

- **Turborepo** — task orchestration (`build`, `test`, `typecheck` run in dependency order)
- **Bun workspaces** — package linking (consistent with francisc.cv)
- **Changesets** — versioning and changelog generation; one changeset per PR, CI publishes to npm on merge to `main`
- **GitHub Actions** — lint + typecheck + build on every PR; publish on `main` merge

---

## Section 2: Package API contracts

### User-facing config (`portfolio-assistant.config.ts` in consumer's project)

```ts
import { defineConfig } from '@portfolio-assistant/core'
import { openaiProvider, openaiVectorStore } from '@portfolio-assistant/openai'

export default defineConfig({
  name: 'Jane Doe',
  baseUrl: 'https://jane.dev',
  corpus: {
    sources: ['content/pages', 'content/projects', 'content/writing'],
  },
  provider: openaiProvider({ model: 'gpt-4o-mini' }),
  vectorStore: openaiVectorStore(),
})
```

This is the only file the consumer needs to touch for a basic setup.

### `@portfolio-assistant/core` exports

- Types: `PortfolioConfig`, `CorpusDocument`, `CorpusManifest`, `VectorStoreManifest`, `AssistantResponse`, `SupportLevel`, `ProviderAdapter`, `VectorAdapter`, `AssistantError`
- `defineConfig(config)` — config factory with Zod validation; throws `AssistantError` on invalid input
- `buildCorpus(config)` — reads source files, normalises, writes `data/assistant/`
- `uploadCorpus(config, adapters)` — uploads files via the provided adapters
- Prompt utilities and response schema (provider-agnostic)

### `@portfolio-assistant/openai` exports

- `openaiProvider(options)` — returns a `ProviderAdapter`
- `openaiVectorStore(options)` — returns a `VectorAdapter`

### `@portfolio-assistant/react` exports

```ts
// Assembled (most users)
<AssistantProvider config={config} apiUrl="/api/assistant/chat">
<AssistantTrigger className? />
<AssistantPanel className? />

// Primitives (custom layouts)
<ChatMessage message={msg} />
<SuggestedPrompts prompts={[...]} onSelect={fn} />
<CitationList citations={[...]} />
<AssistantInput onSubmit={fn} />
```

All components accept `className` (strings merged via `tailwind-merge`).

### `@portfolio-assistant/next` exports

- `createAssistantHandler(config)` — returns a Next.js `POST` route handler
- Re-exports everything from `@portfolio-assistant/react`

---

## Section 3: `@portfolio-assistant/core` internals

### `PortfolioConfig`

```ts
type PortfolioConfig = {
  name: string              // owner's name — used in system prompt
  baseUrl: string           // canonical URL for citation links
  corpus: {
    sources: string[]       // glob patterns relative to project root
    exclude?: string[]
  }
  provider: ProviderAdapter
  vectorStore: VectorAdapter
  assistant?: {
    systemPrompt?: string   // fully replaces the default system prompt
    suggestedPrompts?: string[]
    maxWords?: number       // default: 115 (midpoint of 90-140 range)
  }
}
```

`systemPrompt` fully replaces the default — it does not merge. The default prompt template is:

```
You are answering questions on behalf of {name}, a professional whose portfolio is at {baseUrl}.
Answer only from the provided source documents. Speak in first person (I, me, my).
Be concise — roughly {maxWords} words unless the question clearly needs more.
Return a JSON object with keys: answer, caveat, supportLevel.
```

### `CorpusDocument`

```ts
type CorpusDocument = {
  id: string                          // stable slug-based identifier
  slug: string                        // source file slug
  title: string                       // from frontmatter or inferred from filename
  sourceType: 'page' | 'project' | 'writing' | 'resume' | 'profile' | 'positioning' | 'faq'
  canonicalUrl: string                // baseUrl + path
  priority: number                    // 0-10, higher = more important for retrieval
  topics: string[]                    // from frontmatter tags
  audiences: string[]                 // from frontmatter, e.g. ['recruiter', 'engineer']
  excerpt: string                     // first 200 chars of content
  content: string                     // full normalised text
  filename: string                    // output filename in data/assistant/files/
  attributes: Record<string, string | number | boolean>  // additional frontmatter
}
```

**Expected frontmatter keys** (all optional, used when present):
- `title` — overrides filename-derived title
- `description` — used as excerpt if present
- `date` — ISO date string
- `tags` — string array, maps to `topics`
- `audiences` — string array
- `priority` — number 0-10
- `order` — number, used for ordering within a source type

Missing frontmatter is handled gracefully — `buildCorpus` infers title from the filename and leaves optional fields empty.

### `SupportLevel`

```ts
type SupportLevel = 'grounded' | 'partial' | 'insufficient'
```

Used as a string union throughout. No separate enum — the type alias is the single definition.

### `AssistantResponse`

```ts
type AssistantResponse = {
  answer: string
  caveat: string | null
  supportLevel: SupportLevel
  citations: CitationItem[]          // derived app-side from vector store results
  followUp: string | null            // app-controlled follow-up prompt; null for insufficient
}
```

### Adapter interfaces

```ts
type ProviderAdapter = {
  ask(request: AssistantRequest): Promise<AssistantResponse>
}

type VectorAdapter = {
  upload(documents: CorpusDocument[]): Promise<VectorStoreManifest>
  supportsSearch: boolean             // declared capability flag
  search?(query: string): Promise<CorpusDocument[]>  // required if supportsSearch is true
}
```

`supportsSearch` is a declared flag so consumers can branch without try/catch. If `supportsSearch` is `true`, `search` must be implemented. If `false`, calling `search` throws `AssistantError`.

### Error handling

All public functions throw `AssistantError` (extends `Error`) with a `code` field:

```ts
type AssistantErrorCode =
  | 'CONFIG_INVALID'        // defineConfig validation failed
  | 'CORPUS_BUILD_FAILED'   // file read or parse error during buildCorpus
  | 'CORPUS_UPLOAD_FAILED'  // partial or total upload failure
  | 'PROVIDER_ERROR'        // LLM API returned an error
  | 'PROVIDER_TIMEOUT'      // LLM request exceeded timeout
  | 'RESPONSE_INVALID'      // model output failed schema validation (triggers fallback)
  | 'VECTOR_STORE_ERROR'    // vector store operation failed
  | 'SEARCH_NOT_SUPPORTED'  // search called on adapter where supportsSearch is false
```

`uploadCorpus` with a partial failure (some files succeed, some fail) throws `CORPUS_UPLOAD_FAILED` and includes a `partial` property listing which file IDs succeeded. The manifest is written for successful files only, so re-running upload is safe.

`RESPONSE_INVALID` is internally recovered — the route handler catches it and returns the app-controlled fallback answer rather than propagating a 500.

### `buildCorpus`

Reads each source glob, parses frontmatter via `gray-matter`, normalises content into `CorpusDocument[]`, writes:
- `data/assistant/public-corpus.json` — full manifest
- `data/assistant/files/*.md` — one file per document, ready for upload

**Normaliser interface:**
```ts
type NormaliserHandler = {
  extensions: string[]
  normalise(filePath: string, raw: string): Partial<CorpusDocument>
}
```

Ships built-in handlers for `.mdx`, `.md` (gray-matter + content), `.json` (parsed as object, keys mapped to fields), and `.ts` (dynamic import of default export, must be a plain object). Custom handlers are not exposed in v1 — extension point is reserved for sub-project 2.

### `uploadCorpus`

Calls `vectorStore.upload(documents)`, receives a `VectorStoreManifest`, writes `data/assistant/vector-store-manifest.json`. The manifest maps file IDs to canonical URLs for citation rendering. Upload is idempotent — re-running replaces the manifest.

### Response schema

Provider-agnostic Zod schema in `core`:
```ts
z.object({
  answer: z.string(),
  caveat: z.string().nullable(),
  supportLevel: z.enum(['grounded', 'partial', 'insufficient']),
})
```

Each provider adapter coerces its model output into this shape before returning `AssistantResponse`.

### CLI scripts (exposed via `portfolio-assistant` binary from `core`)

```
portfolio-assistant build-corpus    # runs buildCorpus
portfolio-assistant upload-corpus   # runs uploadCorpus
```

`review-logs` is out of scope for sub-project 1 — moved to out-of-scope section.

---

## Section 4: `@portfolio-assistant/openai`

### `openaiProvider(options)`

```ts
type OpenAIProviderOptions = {
  apiKey?: string           // defaults to OPENAI_API_KEY
  model?: string            // defaults to 'gpt-4o-mini'
  projectId?: string        // defaults to OPENAI_PROJECT_ID
  reasoningEffort?: 'low' | 'medium' | 'high'  // defaults to 'low' for GPT-5 variants
  storeResponses?: boolean  // defaults to true in dev, false in prod
}
```

Internally: constructs the OpenAI client, builds the system prompt from `config.name` + `config.assistant`, submits a Responses API request with `file_search` + structured output, parses against the core Zod schema, handles incomplete JSON with a narrow fallback (`RESPONSE_INVALID` caught internally). Ported directly from `ask-portfolio-assistant.ts`.

### `openaiVectorStore(options)`

```ts
type OpenAIVectorStoreOptions = {
  apiKey?: string
  vectorStoreId?: string    // defaults to OPENAI_VECTOR_STORE_ID, then manifest
  createIfMissing?: boolean // defaults to true
}
```

Uploads each `CorpusDocument` as a `.md` file. Creates a new vector store if none is configured and `createIfMissing` is true. Persists the store ID into the local manifest.

`supportsSearch: false` — OpenAI hosted file_search is retrieval-only from the provider's side; search is handled internally by the Responses API request, not exposed as a standalone `search()` call.

### Environment variables consumed

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes | — | OpenAI API key |
| `OPENAI_PROJECT_ID` | No | — | OpenAI project ID |
| `OPENAI_VECTOR_STORE_ID` | No | from manifest | Override vector store ID |
| `OPENAI_RESPONSES_MODEL` | No | `gpt-4o-mini` | Model override |
| `OPENAI_RESPONSES_STORE` | No | `true` in dev | Store Responses API records |
| `ASSISTANT_LOG_CONTENT` | No | `true` in dev | Enable content-level logging |
| `NODE_ENV` / `VERCEL_ENV` | No | — | Used to determine dev vs prod defaults |

### Migration map (francisc.cv → package)

| francisc.cv file | Destination |
|---|---|
| `src/lib/ai/ask-portfolio-assistant.ts` | `@portfolio-assistant/openai` |
| `src/lib/ai/prompts.ts` | `core` (defaults) + `openai` (assembly) |
| `src/lib/ai/schema.ts` | `@portfolio-assistant/core` |
| `src/lib/ai/build-public-corpus.ts` | `@portfolio-assistant/core` |
| `src/lib/ai/client.ts` | `@portfolio-assistant/openai` |
| `src/lib/ai/sources.ts` | `@portfolio-assistant/core` |
| `src/lib/ai/types.ts` | `@portfolio-assistant/core` |
| `src/lib/ai/citations.ts` | `@portfolio-assistant/core` |
| `src/lib/ai/suggestions.ts` | `@portfolio-assistant/core` |
| `src/lib/ai/request-messages.ts` | `@portfolio-assistant/openai` |

francisc.cv keeps its existing components and either replaces internal imports with package equivalents, or keeps them local if custom styling diverges too far.

---

## Section 5: `@portfolio-assistant/react`

### Components

```ts
// Assembled
<AssistantProvider config={config} apiUrl="/api/assistant/chat">
<AssistantTrigger className? />
<AssistantPanel className? />

// Primitives
<ChatMessage message={msg} />
<SuggestedPrompts prompts={[...]} onSelect={fn} />
<CitationList citations={[...]} />
<AssistantInput onSubmit={fn} />
```

### Theming

Three override levels:
1. **CSS variables** — set on any ancestor element:
   - `--pa-surface` — panel background
   - `--pa-line` — borders and dividers
   - `--pa-text` — primary text
   - `--pa-text-muted` — secondary text, timestamps
   - `--pa-accent` — trigger button and interactive highlights
2. **`className` prop** — every component accepts it; Tailwind classes are merged via `tailwind-merge` so consumer classes win on conflict
3. **Full replacement** — use primitives directly, ignore assembled components

The default theme uses neutral greys that work on any background. It is not the francisc.cv blueprint aesthetic — that stays in francisc.cv.

### Peer dependencies

`react ^18 || ^19`, `typescript ^5.3`, `tailwindcss ^4` (optional — CSS variable theming works without Tailwind in the consumer project).

### Migration map (francisc.cv → package)

| francisc.cv file | Destination |
|---|---|
| `src/components/ai/assistant-context.tsx` | `@portfolio-assistant/react` |
| `src/components/ai/assistant-shell.tsx` | `@portfolio-assistant/react` |
| `src/components/ai/chat-message.tsx` | `@portfolio-assistant/react` |
| `src/components/ai/chat-panel.tsx` | `@portfolio-assistant/react` |
| `src/components/ai/suggested-prompts.tsx` | `@portfolio-assistant/react` |
| `src/lib/ai/assistant-http.ts` | `@portfolio-assistant/react` (client fetch layer) |

---

## Section 6: `@portfolio-assistant/next`

### Route handler

```ts
// consumer's app/api/assistant/chat/route.ts
import { createAssistantHandler } from '@portfolio-assistant/next'
import config from '../../../portfolio-assistant.config'

export const { POST } = createAssistantHandler(config)
export const maxDuration = 60  // consumer sets — Vercel function budget
```

`createAssistantHandler` internally:
- Validates request body against a Zod schema (throws 400 on invalid input)
- Calls `config.provider.ask(request)`
- Returns structured JSON with correct cache and CORS headers
- Catches `RESPONSE_INVALID` and returns the app-controlled fallback answer (200, not 500)
- Propagates `PROVIDER_TIMEOUT` as a 504 with a plain-text body that the client maps to a user-facing message
- Emits structured server logs to `console.log` as newline-delimited JSON

**Structured log fields (every request):**
`requestId`, `pathname`, `latencyMs`, `citationCount`, `supportLevel`, `inputTokens`, `outputTokens`, `totalTokens`, `storedInOpenAI`, `failureStage` (on error only)

**Additional fields when `ASSISTANT_LOG_CONTENT=true`:**
`userQuestionPreview`, `answerPreview`, `caveatPreview`, `citationTitles`

Consumers pipe `console.log` output into their log aggregator of choice (Vercel, Axiom, Datadog). No log aggregator is bundled.

### Timeout handling

`maxDuration = 60` is set by the consumer, not the package. The handler does not set a timeout internally. If the platform kills the function, the client receives either a platform timeout body or a connection close. The React client maps Vercel's plain-text timeout body to a user-facing `"The assistant timed out — try again"` message. Other platforms surface a generic network error. No retry logic is included in v1.

### Re-exports

`@portfolio-assistant/next` re-exports everything from `@portfolio-assistant/react`.

### Peer dependencies

`next ^15 || ^16`, `react ^18 || ^19`, `typescript ^5.3`

---

## Section 7: `create-portfolio-assistant` CLI

### `create` mode

```
$ npx create-portfolio-assistant my-portfolio
```

**Flow:**
1. Detect package manager (checks lockfiles: `bun.lockb`, `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`; falls back to npm)
2. Interactive prompts via `@clack/prompts`:
   - Owner name
   - Site base URL
   - LLM provider — OpenAI (default), Anthropic (coming soon), Gemini (coming soon)
   - Vector backend — OpenAI hosted (default), Pinecone (coming soon), Supabase pgvector (coming soon)
   - Framework — Next.js (v1 only; Astro, Remix, SvelteKit listed as coming soon)
3. Copy `templates/next/` into target directory
4. Inject CLI answers into copied files using `{{TOKEN}}` syntax (see token list below)
5. Install dependencies with detected package manager
6. Print next steps — env vars to set, `build-corpus`, `upload-corpus`, dev server command

**Template tokens injected by CLI:**

| Token | Source | Injected into |
|---|---|---|
| `{{OWNER_NAME}}` | name prompt | `portfolio-assistant.config.ts`, `README.md` |
| `{{BASE_URL}}` | base URL prompt | `portfolio-assistant.config.ts`, `README.md` |
| `{{PACKAGE_NAME}}` | directory name, slugified | `package.json` name field |
| `{{LLM_PROVIDER}}` | provider prompt | `portfolio-assistant.config.ts` |
| `{{VECTOR_BACKEND}}` | vector backend prompt | `portfolio-assistant.config.ts` |

Token replacement uses a simple `str.replaceAll('{{TOKEN}}', value)` pass — no template engine dependency.

### `add` mode (stub)

Listed in help output as "coming soon". Exits with a friendly message pointing to the docs.

### Template structure (`templates/next/`)

```
templates/next/
├── app/
│   ├── api/assistant/chat/route.ts   # createAssistantHandler
│   └── layout.tsx                    # mounts AssistantProvider + AssistantTrigger
├── content/
│   └── pages/about.mdx               # example corpus source
├── portfolio-assistant.config.ts     # pre-filled with CLI answers via {{TOKENS}}
├── .env.example                      # documents required env vars
├── package.json
├── tailwind.config.ts
└── README.md
```

Minimal but runnable Next.js 16 app — enough to have the assistant working end-to-end out of the box.

### CLI dependencies

`@clack/prompts`, `picocolors`, `fs-extra`, `minimist`. No framework or portfolio-assistant package deps — the CLI is a standalone file-copy and prompt tool.

---

## Out of scope for sub-project 1

- `add` mode (add assistant to existing site)
- Astro, Remix, SvelteKit, Vite adapters and templates
- Anthropic and Gemini provider adapters
- Pinecone, Supabase pgvector, local vector adapters
- RSC-specific React components
- `portfolio-assistant review-logs` CLI command
- Documentation site
- Rate limiting, request throttling, or caching in the route handler
- OpenAI vector store size/retention management tooling (governed by OpenAI platform limits; documented in README, not enforced by the package)
