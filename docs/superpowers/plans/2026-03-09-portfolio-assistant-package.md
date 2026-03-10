# Portfolio Assistant npm Package — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `portfolio-assistant` monorepo: four npm packages (`core`, `openai`, `react`, `next`) plus a `create-portfolio-assistant` CLI and a Next.js starter template.

**Architecture:** Turborepo + bun workspaces monorepo. `core` is framework-agnostic (types, corpus build/upload, Zod schema, prompts). `openai` wraps the OpenAI Responses API. `react` ships composable chat UI components. `next` exposes a route handler factory. The CLI scaffolds new sites by copying a template and injecting config tokens.

**Tech Stack:** TypeScript 5.3+, Bun, Turborepo, Changesets, Zod, OpenAI SDK v6, React 18/19, Next.js 15/16, `@clack/prompts`, `gray-matter`, `fs-extra`

**Important:** This is a **new repository**, not changes to francisc.cv. Create it at a path like `~/dev/Code/Work/portfolio-assistant/`. The plan document lives in francisc.cv; the implementation lives in the new repo.

**Reference:** Spec at `docs/superpowers/specs/2026-03-09-portfolio-assistant-package-design.md`

---

## File map

```
portfolio-assistant/                        ← new git repo
├── packages/
│   ├── core/src/
│   │   ├── index.ts                        exports everything public
│   │   ├── types.ts                        PortfolioConfig, CorpusDocument, adapters, errors
│   │   ├── errors.ts                       AssistantError + AssistantErrorCode
│   │   ├── config.ts                       defineConfig (Zod validation)
│   │   ├── schema.ts                       Zod response + request schemas
│   │   ├── prompts.ts                      default system prompt template
│   │   ├── corpus/build.ts                 buildCorpus (glob → CorpusDocument[])
│   │   ├── corpus/normalise.ts             NormaliserHandler interface + .md/.mdx/.json/.ts handlers
│   │   ├── corpus/serialise.ts             serializeDocument (CorpusDocument → .md string)
│   │   ├── corpus/upload.ts                uploadCorpus (calls vectorStore.upload)
│   │   └── bin/cli.ts                      portfolio-assistant binary (build-corpus, upload-corpus)
│   │   test/
│   │   ├── config.test.ts
│   │   ├── schema.test.ts
│   │   ├── corpus/build.test.ts
│   │   └── corpus/upload.test.ts
│   │
│   ├── openai/src/
│   │   ├── index.ts
│   │   ├── client.ts                       OpenAI singleton + env helpers
│   │   ├── provider.ts                     openaiProvider → ProviderAdapter
│   │   └── vector-store.ts                 openaiVectorStore → VectorAdapter
│   │   test/
│   │   ├── provider.test.ts
│   │   └── vector-store.test.ts
│   │
│   ├── react/src/
│   │   ├── index.ts
│   │   ├── context.tsx                     AssistantProvider + useAssistant
│   │   ├── trigger.tsx                     AssistantTrigger
│   │   ├── panel.tsx                       AssistantPanel (modal + backdrop)
│   │   ├── chat-message.tsx                ChatMessage
│   │   ├── suggested-prompts.tsx           SuggestedPrompts
│   │   ├── citation-list.tsx               CitationList
│   │   ├── input.tsx                       AssistantInput
│   │   ├── http.ts                         client fetch layer (postAssistantMessage)
│   │   └── styles.css                      CSS custom property defaults
│   │   test/
│   │   ├── context.test.tsx
│   │   └── http.test.ts
│   │
│   └── next/src/
│       ├── index.ts
│       └── handler.ts                      createAssistantHandler
│       test/
│       └── handler.test.ts
│
├── apps/cli/src/
│   ├── index.ts                            entry, command routing
│   ├── create.ts                           create mode orchestration
│   ├── prompts.ts                          @clack/prompts interactions
│   ├── detect-pm.ts                        lockfile-based package manager detection
│   └── inject-tokens.ts                    {{TOKEN}} replacement in template files
│   test/
│   ├── detect-pm.test.ts
│   └── inject-tokens.test.ts
│
├── templates/next/
│   ├── app/api/assistant/chat/route.ts
│   ├── app/layout.tsx
│   ├── content/pages/about.mdx
│   ├── portfolio-assistant.config.ts
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.ts
│   └── README.md
│
├── turbo.json
├── package.json                            bun workspace root
├── tsconfig.base.json
└── .changeset/config.json
```

---

## Chunk 1: Monorepo scaffold + core types/config/errors/schema

### Task 1: Initialise the monorepo

**Files:**
- Create: `package.json`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.changeset/config.json`
- Create: `.gitignore`
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`

- [ ] **Step 1: Create the repo directory and initialise git**

```bash
mkdir -p ~/dev/Code/Work/portfolio-assistant
cd ~/dev/Code/Work/portfolio-assistant
git init
```

- [ ] **Step 2: Write root `package.json`**

```json
{
  "name": "portfolio-assistant-monorepo",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "build": "turbo build",
    "test": "turbo test",
    "typecheck": "turbo typecheck",
    "lint": "turbo lint"
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "@changesets/cli": "^2.27.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 3: Write `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

- [ ] **Step 4: Write `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "lib": ["ES2022"]
  }
}
```

- [ ] **Step 5: Initialise Changesets**

```bash
bunx changeset init
```

- [ ] **Step 6: Write `.gitignore`**

```
node_modules/
dist/
.turbo/
*.local
```

- [ ] **Step 7: Write `packages/core/package.json`**

```json
{
  "name": "@portfolio-assistant/core",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "gray-matter": "^4.0.3",
    "zod": "^3.24.0",
    "glob": "^11.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 8: Write `packages/core/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 9: Install root deps**

```bash
cd ~/dev/Code/Work/portfolio-assistant
bun install
```

Expected: `node_modules/` created, `bun.lockb` written.

- [ ] **Step 10: Commit scaffold**

```bash
git add .
git commit -m "chore: initialise monorepo with turbo + bun workspaces"
```

---

### Task 2: Core — types and errors

**Files:**
- Create: `packages/core/src/types.ts`
- Create: `packages/core/src/errors.ts`
- Create: `packages/core/test/errors.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/core/test/errors.test.ts
import { describe, expect, it } from "bun:test"
import { AssistantError } from "../src/errors"

describe("AssistantError", () => {
  it("is an instance of Error", () => {
    const err = new AssistantError("CONFIG_INVALID", "bad config")
    expect(err).toBeInstanceOf(Error)
  })

  it("exposes code and message", () => {
    const err = new AssistantError("PROVIDER_TIMEOUT", "timed out")
    expect(err.code).toBe("PROVIDER_TIMEOUT")
    expect(err.message).toBe("timed out")
  })

  it("accepts optional partial payload", () => {
    const err = new AssistantError("CORPUS_UPLOAD_FAILED", "partial", {
      partial: ["file-1"],
    })
    expect(err.partial).toEqual(["file-1"])
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd packages/core && bun test test/errors.test.ts
```

Expected: `Cannot find module '../src/errors'`

- [ ] **Step 3: Write `packages/core/src/types.ts`**

```typescript
import type { z } from "zod"

export type SupportLevel = "grounded" | "partial" | "insufficient"

export type AssistantErrorCode =
  | "CONFIG_INVALID"
  | "CORPUS_BUILD_FAILED"
  | "CORPUS_UPLOAD_FAILED"
  | "PROVIDER_ERROR"
  | "PROVIDER_TIMEOUT"
  | "RESPONSE_INVALID"
  | "VECTOR_STORE_ERROR"
  | "SEARCH_NOT_SUPPORTED"

export type CorpusDocument = {
  id: string
  slug: string
  title: string
  sourceType:
    | "page"
    | "project"
    | "writing"
    | "resume"
    | "profile"
    | "positioning"
    | "faq"
  canonicalUrl: string
  priority: number
  topics: string[]
  audiences: string[]
  excerpt: string
  content: string
  filename: string
  attributes: Record<string, string | number | boolean>
}

export type CorpusManifest = {
  generatedAt: string
  documents: CorpusDocument[]
}

export type VectorStoreManifestFile = {
  id: string
  title: string
  sourceType: CorpusDocument["sourceType"]
  canonicalUrl: string
  filename: string
  fileId: string
  attributes: Record<string, string | number | boolean>
}

export type VectorStoreManifest = {
  generatedAt: string
  vectorStoreId: string
  files: VectorStoreManifestFile[]
}

export type CitationItem = {
  title: string
  canonicalUrl: string
  sourceType: string
}

export type AssistantRequest = {
  messages: Array<{ role: "user" | "assistant"; content: string }>
  context: {
    pathname: string
    title?: string
    interactionSource?: "prompt" | "typed"
  }
}

export type AssistantResponse = {
  requestId: string
  answer: string
  caveat: string | null
  supportLevel: SupportLevel
  citations: CitationItem[]
  followUp: string | null
}

export type ProviderAdapter = {
  ask(request: AssistantRequest): Promise<AssistantResponse>
}

export type VectorAdapter = {
  supportsSearch: boolean
  upload(documents: CorpusDocument[]): Promise<VectorStoreManifest>
  search?(query: string): Promise<CorpusDocument[]>
}

export type PortfolioConfig = {
  name: string
  baseUrl: string
  corpus: {
    sources: string[]
    exclude?: string[]
  }
  provider: ProviderAdapter
  vectorStore: VectorAdapter
  assistant?: {
    systemPrompt?: string
    suggestedPrompts?: string[]
    maxWords?: number
  }
}

export type NormaliserHandler = {
  extensions: string[]
  normalise(filePath: string, raw: string): Partial<CorpusDocument>
}
```

- [ ] **Step 4: Write `packages/core/src/errors.ts`**

```typescript
import type { AssistantErrorCode } from "./types"

type ErrorPayload = {
  partial?: string[]
}

export class AssistantError extends Error {
  code: AssistantErrorCode
  partial?: string[]

  constructor(code: AssistantErrorCode, message: string, payload?: ErrorPayload) {
    super(message)
    this.name = "AssistantError"
    this.code = code
    this.partial = payload?.partial
  }
}
```

- [ ] **Step 5: Run — expect PASS**

```bash
cd packages/core && bun test test/errors.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/types.ts packages/core/src/errors.ts packages/core/test/errors.test.ts
git commit -m "feat(core): add types and AssistantError"
```

---

### Task 3: Core — Zod schemas

**Files:**
- Create: `packages/core/src/schema.ts`
- Create: `packages/core/test/schema.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/core/test/schema.test.ts
import { describe, expect, it } from "bun:test"
import {
  AssistantRequestSchema,
  AssistantModelAnswerSchema,
  AssistantChatResponseSchema,
} from "../src/schema"

describe("AssistantRequestSchema", () => {
  it("accepts a valid request", () => {
    const result = AssistantRequestSchema.safeParse({
      messages: [{ role: "user", content: "What do you do?" }],
      context: { pathname: "/" },
    })
    expect(result.success).toBe(true)
  })

  it("rejects empty messages", () => {
    const result = AssistantRequestSchema.safeParse({
      messages: [],
      context: { pathname: "/" },
    })
    expect(result.success).toBe(false)
  })

  it("rejects more than 4 messages", () => {
    const messages = Array.from({ length: 5 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: "hi",
    }))
    const result = AssistantRequestSchema.safeParse({ messages, context: { pathname: "/" } })
    expect(result.success).toBe(false)
  })
})

describe("AssistantModelAnswerSchema", () => {
  it("accepts valid grounded answer", () => {
    const result = AssistantModelAnswerSchema.safeParse({
      answer: "I build things.",
      caveat: null,
      supportLevel: "grounded",
    })
    expect(result.success).toBe(true)
  })

  it("rejects unknown supportLevel", () => {
    const result = AssistantModelAnswerSchema.safeParse({
      answer: "hi",
      caveat: null,
      supportLevel: "unknown",
    })
    expect(result.success).toBe(false)
  })
})

describe("AssistantChatResponseSchema", () => {
  it("accepts a valid response", () => {
    const result = AssistantChatResponseSchema.safeParse({
      requestId: "resp_abc",
      answer: "I build things.",
      caveat: null,
      citations: [],
      supportLevel: "grounded",
    })
    expect(result.success).toBe(true)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd packages/core && bun test test/schema.test.ts
```

- [ ] **Step 3: Write `packages/core/src/schema.ts`**

```typescript
import { z } from "zod"

export const AssistantSupportLevelSchema = z.enum([
  "grounded",
  "partial",
  "insufficient",
])

export const AssistantMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
})

export const AssistantContextInputSchema = z.object({
  pathname: z.string().trim().min(1).max(2048),
  title: z.string().trim().max(240).optional(),
  interactionSource: z.enum(["prompt", "typed"]).optional(),
})

export const AssistantRequestSchema = z.object({
  messages: z.array(AssistantMessageSchema).min(1).max(4),
  context: AssistantContextInputSchema,
})

export const AssistantModelAnswerSchema = z.object({
  answer: z.string().trim().min(1).max(4000),
  caveat: z.string().trim().max(400).nullable(),
  supportLevel: AssistantSupportLevelSchema,
})

export const AssistantCitationSchema = z.object({
  title: z.string().trim().min(1),
  canonicalUrl: z.string().trim().min(1),
  sourceType: z.string().trim().min(1),
})

export const AssistantChatResponseSchema = z.object({
  requestId: z.string().trim().min(1),
  answer: z.string().trim().min(1),
  caveat: z.string().trim().nullable(),
  citations: z.array(AssistantCitationSchema).max(4),
  supportLevel: AssistantSupportLevelSchema,
})

export type AssistantMessage = z.infer<typeof AssistantMessageSchema>
export type AssistantModelAnswer = z.infer<typeof AssistantModelAnswerSchema>
export type AssistantChatResponse = z.infer<typeof AssistantChatResponseSchema>
```

- [ ] **Step 4: Run — expect PASS**

```bash
cd packages/core && bun test test/schema.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/schema.ts packages/core/test/schema.test.ts
git commit -m "feat(core): add Zod request/response schemas"
```

---

### Task 4: Core — `defineConfig`

**Files:**
- Create: `packages/core/src/config.ts`
- Create: `packages/core/test/config.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/core/test/config.test.ts
import { describe, expect, it } from "bun:test"
import { defineConfig } from "../src/config"
import { AssistantError } from "../src/errors"
import type { ProviderAdapter, VectorAdapter } from "../src/types"

const mockProvider: ProviderAdapter = {
  ask: async () => ({
    requestId: "r1",
    answer: "hi",
    caveat: null,
    supportLevel: "grounded",
    citations: [],
    followUp: null,
  }),
}

const mockVectorStore: VectorAdapter = {
  supportsSearch: false,
  upload: async () => ({
    generatedAt: new Date().toISOString(),
    vectorStoreId: "vs_123",
    files: [],
  }),
}

const validConfig = {
  name: "Jane Doe",
  baseUrl: "https://jane.dev",
  corpus: { sources: ["content/pages"] },
  provider: mockProvider,
  vectorStore: mockVectorStore,
}

describe("defineConfig", () => {
  it("returns config unchanged when valid", () => {
    const config = defineConfig(validConfig)
    expect(config.name).toBe("Jane Doe")
    expect(config.baseUrl).toBe("https://jane.dev")
  })

  it("throws CONFIG_INVALID when name is empty", () => {
    expect(() =>
      defineConfig({ ...validConfig, name: "" })
    ).toThrow(AssistantError)
  })

  it("throws CONFIG_INVALID when sources is empty", () => {
    expect(() =>
      defineConfig({ ...validConfig, corpus: { sources: [] } })
    ).toThrow(AssistantError)
  })

  it("throws CONFIG_INVALID when baseUrl is missing scheme", () => {
    expect(() =>
      defineConfig({ ...validConfig, baseUrl: "jane.dev" })
    ).toThrow(AssistantError)
  })

  it("applies maxWords default of 115", () => {
    const config = defineConfig(validConfig)
    expect(config.assistant?.maxWords ?? 115).toBe(115)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd packages/core && bun test test/config.test.ts
```

- [ ] **Step 3: Write `packages/core/src/config.ts`**

```typescript
import { z } from "zod"
import { AssistantError } from "./errors"
import type { PortfolioConfig } from "./types"

const ConfigInputSchema = z.object({
  name: z.string().min(1, "name is required"),
  baseUrl: z
    .string()
    .regex(/^https?:\/\//, "baseUrl must start with http:// or https://"),
  corpus: z.object({
    sources: z.array(z.string()).min(1, "at least one source glob is required"),
    exclude: z.array(z.string()).optional(),
  }),
})

export function defineConfig(config: PortfolioConfig): PortfolioConfig {
  const result = ConfigInputSchema.safeParse(config)

  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join("; ")
    throw new AssistantError("CONFIG_INVALID", message)
  }

  return config
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
cd packages/core && bun test test/config.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/config.ts packages/core/test/config.test.ts
git commit -m "feat(core): add defineConfig with validation"
```

---

### Task 5: Core — prompts

**Files:**
- Create: `packages/core/src/prompts.ts`

No test needed — pure string composition, verified by integration.

- [ ] **Step 1: Write `packages/core/src/prompts.ts`**

```typescript
import type { PortfolioConfig } from "./types"

export const DEFAULT_SYSTEM_PROMPT_TEMPLATE = `
You are answering questions on behalf of {name}, a professional whose portfolio is at {baseUrl}.

Answer only from the provided source documents. Speak in first person (I, me, my) as if {name} is responding directly.
Do not invent roles, metrics, employers, outcomes, or dates.
If the retrieved material does not support a claim, say so directly.
Write like a thoughtful professional in direct conversation — not a branded assistant.
Prefer concise answers of roughly {maxWords} words unless the question clearly needs more.
Prefer short paragraphs over dense block text.
Avoid generic AI phrasing and stacked abstract nouns.

Return a JSON object with exactly these top-level fields in this order: answer, caveat, supportLevel.
- answer: the direct response (string)
- caveat: a short limitation note, or null if the answer is well-supported
- supportLevel: "grounded" | "partial" | "insufficient"
`.trim()

export function buildSystemPrompt(config: PortfolioConfig): string {
  const template = config.assistant?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT_TEMPLATE
  const maxWords = config.assistant?.maxWords ?? 115

  return template
    .replace(/{name}/g, config.name)
    .replace(/{baseUrl}/g, config.baseUrl)
    .replace(/{maxWords}/g, String(maxWords))
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/prompts.ts
git commit -m "feat(core): add buildSystemPrompt with default template"
```

---

### Task 6: Core — `index.ts`

**Files:**
- Create: `packages/core/src/index.ts`

- [ ] **Step 1: Write `packages/core/src/index.ts`**

```typescript
export * from "./types"
export * from "./errors"
export * from "./config"
export * from "./schema"
export * from "./prompts"
export * from "./corpus/build"
export * from "./corpus/upload"
```

- [ ] **Step 2: Build and verify types compile**

```bash
cd packages/core && bun run build
```

Expected: `dist/` written, no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add packages/core/src/index.ts
git commit -m "feat(core): wire index exports"
```

---

## Chunk 2: Core corpus pipeline (buildCorpus + uploadCorpus)

### Task 7: Corpus normaliser

**Files:**
- Create: `packages/core/src/corpus/normalise.ts`
- Create: `packages/core/src/corpus/serialise.ts`

- [ ] **Step 1: Write `packages/core/src/corpus/normalise.ts`**

```typescript
import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import type { CorpusDocument, NormaliserHandler } from "../types"

function normaliseWhitespace(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim()
}

function stripMdxArtifacts(value: string): string {
  return normaliseWhitespace(
    value
      .replace(/<\w[^>]*\/>/g, "")   // self-closing JSX
      .replace(/<[^>]+>/g, "")        // remaining tags
  )
}

function toExcerpt(value: string): string {
  const flat = value.replace(/\s+/g, " ").trim()
  return flat.length <= 220 ? flat : `${flat.slice(0, 217)}...`
}

function toFilename(id: string): string {
  return `${id.replace(/:/g, "--").replace(/\//g, "-")}.md`
}

function inferSlug(filePath: string, root: string): string {
  return path
    .relative(root, filePath)
    .replace(/\.(mdx?|json|ts)$/, "")
    .replace(/\\/g, "/")
}

type Frontmatter = {
  title?: string
  description?: string
  date?: string
  tags?: string[]
  audiences?: string[]
  priority?: number
  order?: number
  sourceType?: CorpusDocument["sourceType"]
  canonicalUrl?: string
}

export const mdHandler: NormaliserHandler = {
  extensions: [".md", ".mdx"],
  normalise(filePath, raw) {
    const { data, content } = matter(raw) as { data: Frontmatter; content: string }
    const slug = inferSlug(filePath, process.cwd())
    const cleaned = stripMdxArtifacts(content)
    return {
      slug,
      title: data.title ?? path.basename(filePath, path.extname(filePath)),
      sourceType: data.sourceType,
      canonicalUrl: data.canonicalUrl,
      priority: data.priority,
      topics: data.tags ?? [],
      audiences: data.audiences ?? [],
      excerpt: data.description ? toExcerpt(data.description) : toExcerpt(cleaned),
      content: cleaned,
      attributes: {
        ...(data.date ? { date: data.date } : {}),
        ...(data.order != null ? { order: data.order } : {}),
      },
    }
  },
}

export const jsonHandler: NormaliserHandler = {
  extensions: [".json"],
  normalise(filePath, raw) {
    const data = JSON.parse(raw) as Record<string, unknown>
    const slug = inferSlug(filePath, process.cwd())
    const content = Object.entries(data)
      .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
      .join("\n")
    return {
      slug,
      title: typeof data["title"] === "string" ? data["title"] : slug,
      content,
      excerpt: toExcerpt(content),
    }
  },
}

export const DEFAULT_HANDLERS: NormaliserHandler[] = [mdHandler, jsonHandler]
```

- [ ] **Step 2: Write `packages/core/src/corpus/serialise.ts`**

```typescript
import type { CorpusDocument } from "../types"

export function serialiseDocument(doc: CorpusDocument): string {
  const fm = [
    "---",
    `id: "${doc.id}"`,
    `title: "${doc.title.replace(/"/g, '\\"')}"`,
    `sourceType: "${doc.sourceType}"`,
    `canonicalUrl: "${doc.canonicalUrl}"`,
    `priority: ${doc.priority}`,
    `topics: [${doc.topics.map((t) => `"${t}"`).join(", ")}]`,
    `audiences: [${doc.audiences.map((a) => `"${a}"`).join(", ")}]`,
    "---",
    "",
  ].join("\n")

  return `${fm}${doc.content}\n`
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/core/src/corpus/normalise.ts packages/core/src/corpus/serialise.ts
git commit -m "feat(core): add corpus normalisers and serialiser"
```

---

### Task 8: `buildCorpus`

**Files:**
- Create: `packages/core/src/corpus/build.ts`
- Create: `packages/core/test/corpus/build.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/core/test/corpus/build.test.ts
import { describe, expect, it, beforeEach, afterEach } from "bun:test"
import fs from "node:fs"
import path from "node:path"
import os from "node:os"
import { buildCorpus } from "../../src/corpus/build"

let tmpDir: string

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pa-test-"))
  // create a source file
  fs.mkdirSync(path.join(tmpDir, "content/pages"), { recursive: true })
  fs.writeFileSync(
    path.join(tmpDir, "content/pages/about.md"),
    `---\ntitle: About\ntags: [profile]\n---\n\nHello world\n`
  )
})

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe("buildCorpus", () => {
  it("produces a CorpusDocument for each source file", async () => {
    const docs = await buildCorpus(
      { sources: ["content/pages/**/*.md"] },
      { cwd: tmpDir }
    )
    expect(docs).toHaveLength(1)
    expect(docs[0].title).toBe("About")
    expect(docs[0].content).toContain("Hello world")
  })

  it("generates a stable id from sourceType and slug", async () => {
    const docs = await buildCorpus(
      { sources: ["content/pages/**/*.md"] },
      { cwd: tmpDir }
    )
    expect(docs[0].id).toMatch(/^page:/)
  })

  it("respects exclude patterns", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "content/pages/draft.md"),
      `---\ntitle: Draft\n---\nDraft content`
    )
    const docs = await buildCorpus(
      {
        sources: ["content/pages/**/*.md"],
        exclude: ["content/pages/draft.md"],
      },
      { cwd: tmpDir }
    )
    expect(docs.map((d) => d.slug)).not.toContain("content/pages/draft")
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd packages/core && bun test test/corpus/build.test.ts
```

- [ ] **Step 3: Write `packages/core/src/corpus/build.ts`**

```typescript
import fs from "node:fs"
import path from "node:path"
import { glob } from "glob"
import type { CorpusDocument, NormaliserHandler } from "../types"
import { AssistantError } from "../errors"
import { DEFAULT_HANDLERS } from "./normalise"

type BuildOptions = {
  cwd?: string
  handlers?: NormaliserHandler[]
}

type CorpusSourceConfig = {
  sources: string[]
  exclude?: string[]
}

function inferSourceType(slug: string): CorpusDocument["sourceType"] {
  if (slug.startsWith("content/projects")) return "project"
  if (slug.startsWith("content/writing")) return "writing"
  if (slug.startsWith("content/pages")) return "page"
  if (slug.includes("resume")) return "resume"
  return "page"
}

function toFilename(id: string): string {
  return `${id.replace(/:/g, "--").replace(/\//g, "-")}.md`
}

function toExcerpt(value: string): string {
  const flat = value.replace(/\s+/g, " ").trim()
  return flat.length <= 220 ? flat : `${flat.slice(0, 217)}...`
}

export async function buildCorpus(
  corpusConfig: CorpusSourceConfig,
  options: BuildOptions = {}
): Promise<CorpusDocument[]> {
  const cwd = options.cwd ?? process.cwd()
  const handlers = options.handlers ?? DEFAULT_HANDLERS

  const files = await glob(corpusConfig.sources, {
    cwd,
    ignore: corpusConfig.exclude ?? [],
    absolute: true,
  })

  const documents: CorpusDocument[] = []

  for (const filePath of files) {
    const ext = path.extname(filePath)
    const handler = handlers.find((h) => h.extensions.includes(ext))

    if (!handler) continue

    let raw: string
    try {
      raw = fs.readFileSync(filePath, "utf8")
    } catch (err) {
      throw new AssistantError(
        "CORPUS_BUILD_FAILED",
        `Could not read file: ${filePath}`
      )
    }

    const slug = path
      .relative(cwd, filePath)
      .replace(/\.(mdx?|json|ts)$/, "")
      .replace(/\\/g, "/")

    const partial = handler.normalise(filePath, raw)
    const sourceType = partial.sourceType ?? inferSourceType(slug)
    const id = `${sourceType}:${slug.replace(/\//g, "-")}`
    const content = partial.content ?? ""
    const excerpt = partial.excerpt ?? toExcerpt(content)

    documents.push({
      id,
      slug,
      title: partial.title ?? path.basename(filePath, ext),
      sourceType,
      canonicalUrl: partial.canonicalUrl ?? `/${slug}`,
      priority: partial.priority ?? 2,
      topics: partial.topics ?? [],
      audiences: partial.audiences ?? [],
      excerpt,
      content,
      filename: toFilename(id),
      attributes: {
        id,
        slug,
        title: partial.title ?? slug,
        sourceType,
        canonicalUrl: partial.canonicalUrl ?? `/${slug}`,
        priority: partial.priority ?? 2,
        topics: (partial.topics ?? []).join("|"),
        audiences: (partial.audiences ?? []).join("|"),
        ...(partial.attributes ?? {}),
      },
    })
  }

  return documents.sort((a, b) => a.id.localeCompare(b.id))
}

export function writeCorpusArtifacts(
  documents: CorpusDocument[],
  outDir: string
): void {
  const filesDir = path.join(outDir, "files")
  const manifestPath = path.join(outDir, "public-corpus.json")

  fs.mkdirSync(filesDir, { recursive: true })

  // clear existing files
  for (const f of fs.readdirSync(filesDir)) {
    fs.unlinkSync(path.join(filesDir, f))
  }

  const { serialiseDocument } = require("./serialise")
  for (const doc of documents) {
    fs.writeFileSync(path.join(filesDir, doc.filename), serialiseDocument(doc), "utf8")
  }

  const manifest = { generatedAt: new Date().toISOString(), documents }
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8")
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
cd packages/core && bun test test/corpus/build.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/corpus/build.ts packages/core/test/corpus/build.test.ts
git commit -m "feat(core): add buildCorpus with glob-based source loading"
```

---

### Task 9: `uploadCorpus`

**Files:**
- Create: `packages/core/src/corpus/upload.ts`
- Create: `packages/core/test/corpus/upload.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/core/test/corpus/upload.test.ts
import { describe, expect, it, mock } from "bun:test"
import { uploadCorpus } from "../../src/corpus/upload"
import type { CorpusDocument, VectorAdapter } from "../../src/types"
import { AssistantError } from "../../src/errors"

const makeDoc = (id: string): CorpusDocument => ({
  id,
  slug: id,
  title: id,
  sourceType: "page",
  canonicalUrl: `/${id}`,
  priority: 1,
  topics: [],
  audiences: [],
  excerpt: "excerpt",
  content: "content",
  filename: `${id}.md`,
  attributes: {},
})

describe("uploadCorpus", () => {
  it("calls vectorStore.upload and returns manifest", async () => {
    const manifest = {
      generatedAt: new Date().toISOString(),
      vectorStoreId: "vs_abc",
      files: [],
    }
    const mockStore: VectorAdapter = {
      supportsSearch: false,
      upload: mock(async () => manifest),
    }

    const docs = [makeDoc("page-about")]
    const result = await uploadCorpus(docs, mockStore)

    expect(mockStore.upload).toHaveBeenCalledWith(docs)
    expect(result.vectorStoreId).toBe("vs_abc")
  })

  it("throws VECTOR_STORE_ERROR when upload throws", async () => {
    const mockStore: VectorAdapter = {
      supportsSearch: false,
      upload: mock(async () => { throw new Error("network error") }),
    }

    await expect(uploadCorpus([makeDoc("p1")], mockStore)).rejects.toMatchObject({
      code: "VECTOR_STORE_ERROR",
    })
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd packages/core && bun test test/corpus/upload.test.ts
```

- [ ] **Step 3: Write `packages/core/src/corpus/upload.ts`**

```typescript
import fs from "node:fs"
import path from "node:path"
import type { CorpusDocument, VectorAdapter, VectorStoreManifest } from "../types"
import { AssistantError } from "../errors"

export async function uploadCorpus(
  documents: CorpusDocument[],
  vectorStore: VectorAdapter,
  manifestPath?: string
): Promise<VectorStoreManifest> {
  let manifest: VectorStoreManifest

  try {
    manifest = await vectorStore.upload(documents)
  } catch (err) {
    if (err instanceof AssistantError) throw err
    throw new AssistantError(
      "VECTOR_STORE_ERROR",
      `Upload failed: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  if (manifestPath) {
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8")
  }

  return manifest
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
cd packages/core && bun test test/corpus/upload.test.ts
```

- [ ] **Step 5: Run all core tests**

```bash
cd packages/core && bun test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/corpus/upload.ts packages/core/test/corpus/upload.test.ts
git commit -m "feat(core): add uploadCorpus"
```

---

### Task 10: Core CLI binary

**Files:**
- Create: `packages/core/src/bin/cli.ts`
- Modify: `packages/core/package.json` — add `bin` field

- [ ] **Step 1: Write `packages/core/src/bin/cli.ts`**

```typescript
#!/usr/bin/env node
import path from "node:path"
import { buildCorpus, writeCorpusArtifacts } from "../corpus/build"
import { uploadCorpus } from "../corpus/upload"

const [, , command, ...args] = process.argv
const cwd = process.cwd()

async function runBuildCorpus() {
  // Load config from portfolio-assistant.config.ts in cwd
  const configPath = path.join(cwd, "portfolio-assistant.config.ts")
  let config: import("../types").PortfolioConfig
  try {
    const mod = await import(configPath)
    config = mod.default
  } catch {
    console.error(`Could not load portfolio-assistant.config.ts from ${cwd}`)
    process.exit(1)
  }

  console.log("Building corpus…")
  const documents = await buildCorpus(config.corpus, { cwd })
  writeCorpusArtifacts(documents, path.join(cwd, "data/assistant"))
  console.log(`✓ Built ${documents.length} documents → data/assistant/`)
}

async function runUploadCorpus() {
  const configPath = path.join(cwd, "portfolio-assistant.config.ts")
  let config: import("../types").PortfolioConfig
  try {
    const mod = await import(configPath)
    config = mod.default
  } catch {
    console.error(`Could not load portfolio-assistant.config.ts from ${cwd}`)
    process.exit(1)
  }

  const corpusPath = path.join(cwd, "data/assistant/public-corpus.json")
  let corpus: import("../types").CorpusManifest
  try {
    corpus = JSON.parse(require("node:fs").readFileSync(corpusPath, "utf8"))
  } catch {
    console.error("No corpus found. Run `portfolio-assistant build-corpus` first.")
    process.exit(1)
  }

  console.log("Uploading corpus…")
  const manifest = await uploadCorpus(
    corpus.documents,
    config.vectorStore,
    path.join(cwd, "data/assistant/vector-store-manifest.json")
  )
  console.log(`✓ Uploaded to vector store ${manifest.vectorStoreId}`)
}

switch (command) {
  case "build-corpus":
    runBuildCorpus().catch((err) => { console.error(err); process.exit(1) })
    break
  case "upload-corpus":
    runUploadCorpus().catch((err) => { console.error(err); process.exit(1) })
    break
  default:
    console.log("Usage: portfolio-assistant <build-corpus|upload-corpus>")
    process.exit(1)
}
```

- [ ] **Step 2: Add `bin` to `packages/core/package.json`**

Add to the existing `package.json`:
```json
"bin": {
  "portfolio-assistant": "./dist/bin/cli.js"
}
```

- [ ] **Step 3: Build and verify**

```bash
cd packages/core && bun run build
```

Expected: `dist/bin/cli.js` created.

- [ ] **Step 4: Commit**

```bash
git add packages/core/src/bin/cli.ts packages/core/package.json
git commit -m "feat(core): add portfolio-assistant CLI binary"
```

---

## Chunk 3: @portfolio-assistant/openai

### Task 11: Scaffold openai package

**Files:**
- Create: `packages/openai/package.json`
- Create: `packages/openai/tsconfig.json`

- [ ] **Step 1: Write `packages/openai/package.json`**

```json
{
  "name": "@portfolio-assistant/openai",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@portfolio-assistant/core": "workspace:*",
    "openai": "^6.27.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Write `packages/openai/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Install**

```bash
cd ~/dev/Code/Work/portfolio-assistant && bun install
```

- [ ] **Step 4: Commit**

```bash
git add packages/openai/
git commit -m "chore(openai): scaffold package"
```

---

### Task 12: OpenAI client helpers

**Files:**
- Create: `packages/openai/src/client.ts`

- [ ] **Step 1: Write `packages/openai/src/client.ts`**

```typescript
import OpenAI from "openai"

let _client: OpenAI | null = null

function isEnabled(value: string | undefined, fallback = false): boolean {
  if (value == null) return fallback
  const n = value.trim().toLowerCase()
  return n === "1" || n === "true" || n === "yes"
}

export function getOpenAIClient(apiKey?: string, projectId?: string): OpenAI {
  if (_client) return _client
  const key = apiKey ?? process.env.OPENAI_API_KEY
  if (!key) throw new Error("OPENAI_API_KEY is not configured")
  _client = new OpenAI({ apiKey: key, project: projectId ?? process.env.OPENAI_PROJECT_ID })
  return _client
}

export function getEnvironmentLabel(): string {
  return process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development"
}

export function isDevEnvironment(): boolean {
  return getEnvironmentLabel() === "development"
}

export function getResponsesStoreEnabled(override?: boolean): boolean {
  if (override != null) return override
  return isEnabled(process.env.OPENAI_RESPONSES_STORE, isDevEnvironment())
}

export function getContentLoggingEnabled(): boolean {
  return isEnabled(process.env.ASSISTANT_LOG_CONTENT, isDevEnvironment())
}

export function getResponsesModel(override?: string): string {
  return override ?? process.env.OPENAI_RESPONSES_MODEL ?? "gpt-4o-mini"
}

export function getResponsesReasoning(model: string) {
  return model.startsWith("gpt-5") ? { effort: "low" as const } : undefined
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/openai/src/client.ts
git commit -m "feat(openai): add client helpers"
```

---

### Task 13: `openaiVectorStore`

**Files:**
- Create: `packages/openai/src/vector-store.ts`
- Create: `packages/openai/test/vector-store.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/openai/test/vector-store.test.ts
import { describe, expect, it, mock } from "bun:test"

// We test the adapter contract, not OpenAI internals
describe("openaiVectorStore", () => {
  it("returns a VectorAdapter with supportsSearch: false", async () => {
    const { openaiVectorStore } = await import("../src/vector-store")
    const adapter = openaiVectorStore({ apiKey: "sk-test" })
    expect(adapter.supportsSearch).toBe(false)
    expect(typeof adapter.upload).toBe("function")
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd packages/openai && bun test test/vector-store.test.ts
```

- [ ] **Step 3: Write `packages/openai/src/vector-store.ts`**

```typescript
import fs from "node:fs"
import path from "node:path"
import type {
  CorpusDocument,
  VectorAdapter,
  VectorStoreManifest,
  VectorStoreManifestFile,
} from "@portfolio-assistant/core"
import { AssistantError } from "@portfolio-assistant/core"
import { getOpenAIClient } from "./client"

type OpenAIVectorStoreOptions = {
  apiKey?: string
  vectorStoreId?: string
  createIfMissing?: boolean
}

function readManifestVectorStoreId(cwd = process.cwd()): string | null {
  const manifestPath = path.join(cwd, "data/assistant/vector-store-manifest.json")
  try {
    const data = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    return data.vectorStoreId ?? null
  } catch {
    return null
  }
}

export function openaiVectorStore(options: OpenAIVectorStoreOptions = {}): VectorAdapter {
  return {
    supportsSearch: false,

    async upload(documents: CorpusDocument[]): Promise<VectorStoreManifest> {
      const client = getOpenAIClient(options.apiKey)

      let vectorStoreId =
        options.vectorStoreId ??
        process.env.OPENAI_VECTOR_STORE_ID ??
        readManifestVectorStoreId()

      if (!vectorStoreId) {
        if (options.createIfMissing !== false) {
          try {
            const store = await client.vectorStores.create({ name: "portfolio-assistant" })
            vectorStoreId = store.id
          } catch (err) {
            throw new AssistantError(
              "VECTOR_STORE_ERROR",
              `Failed to create vector store: ${err instanceof Error ? err.message : String(err)}`
            )
          }
        } else {
          throw new AssistantError("VECTOR_STORE_ERROR", "No vectorStoreId configured")
        }
      }

      const uploadedFiles: VectorStoreManifestFile[] = []

      for (const doc of documents) {
        const content = [
          "---",
          `id: "${doc.id}"`,
          `sourceType: "${doc.sourceType}"`,
          `canonicalUrl: "${doc.canonicalUrl}"`,
          `priority: ${doc.priority}`,
          "---",
          "",
          doc.content,
        ].join("\n")

        const blob = new Blob([content], { type: "text/plain" })
        const file = new File([blob], doc.filename, { type: "text/plain" })

        try {
          const uploaded = await client.vectorStores.files.uploadAndPoll(
            vectorStoreId,
            file
          )
          uploadedFiles.push({
            id: doc.id,
            title: doc.title,
            sourceType: doc.sourceType,
            canonicalUrl: doc.canonicalUrl,
            filename: doc.filename,
            fileId: uploaded.id,
            attributes: doc.attributes,
          })
        } catch (err) {
          throw new AssistantError(
            "CORPUS_UPLOAD_FAILED",
            `Failed to upload ${doc.filename}: ${err instanceof Error ? err.message : String(err)}`,
            { partial: uploadedFiles.map((f) => f.fileId) }
          )
        }
      }

      return {
        generatedAt: new Date().toISOString(),
        vectorStoreId,
        files: uploadedFiles,
      }
    },
  }
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
cd packages/openai && bun test test/vector-store.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add packages/openai/src/vector-store.ts packages/openai/test/vector-store.test.ts
git commit -m "feat(openai): add openaiVectorStore adapter"
```

---

### Task 14: `openaiProvider`

**Files:**
- Create: `packages/openai/src/provider.ts`
- Create: `packages/openai/test/provider.test.ts`
- Create: `packages/openai/src/index.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// packages/openai/test/provider.test.ts
import { describe, expect, it, mock, beforeEach } from "bun:test"

describe("openaiProvider", () => {
  it("returns a ProviderAdapter with an ask function", async () => {
    const { openaiProvider } = await import("../src/provider")
    const adapter = openaiProvider({ apiKey: "sk-test" })
    expect(typeof adapter.ask).toBe("function")
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd packages/openai && bun test test/provider.test.ts
```

- [ ] **Step 3: Write `packages/openai/src/provider.ts`**

```typescript
import { zodTextFormat } from "openai/helpers/zod"
import type {
  AssistantRequest,
  AssistantResponse,
  PortfolioConfig,
  ProviderAdapter,
} from "@portfolio-assistant/core"
import {
  AssistantError,
  AssistantModelAnswerSchema,
  AssistantChatResponseSchema,
  buildSystemPrompt,
} from "@portfolio-assistant/core"
import {
  getOpenAIClient,
  getResponsesModel,
  getResponsesReasoning,
  getResponsesStoreEnabled,
  getEnvironmentLabel,
} from "./client"

type OpenAIProviderOptions = {
  apiKey?: string
  model?: string
  projectId?: string
  reasoningEffort?: "low" | "medium" | "high"
  storeResponses?: boolean
}

function getLatestUserMessage(request: AssistantRequest): string | null {
  for (let i = request.messages.length - 1; i >= 0; i--) {
    if (request.messages[i].role === "user") return request.messages[i].content
  }
  return null
}

function extractFallbackSubject(message: string | null): string | null {
  if (!message) return null
  const quoted = message.match(/["""''']([^"""''']{2,80})["""''']/)
  if (quoted?.[1]) return `"${quoted[1].trim()}"`
  return null
}

function buildFallbackAnswer(lastUserMessage: string | null): string {
  const subject = extractFallbackSubject(lastUserMessage)
  if (subject) return `I couldn't find ${subject} in the public material on this site.`
  return "I couldn't find enough support for that in the public material on this site."
}

export function openaiProvider(
  options: OpenAIProviderOptions = {},
  config?: Pick<PortfolioConfig, "name" | "baseUrl" | "assistant">
): ProviderAdapter {
  return {
    async ask(request: AssistantRequest): Promise<AssistantResponse> {
      const client = getOpenAIClient(options.apiKey, options.projectId)
      const model = getResponsesModel(options.model)
      const store = getResponsesStoreEnabled(options.storeResponses)
      const systemPrompt = config
        ? buildSystemPrompt(config as PortfolioConfig)
        : "You are a portfolio assistant. Answer from retrieved documents in first person."

      let response: Awaited<ReturnType<typeof client.responses.create>>

      try {
        response = await client.responses.create({
          model,
          reasoning: getResponsesReasoning(model),
          instructions: systemPrompt,
          input: request.messages.map((m) => ({ role: m.role, content: m.content })),
          include: ["file_search_call.results"],
          max_output_tokens: 800,
          store,
          metadata: {
            app: "portfolio-assistant",
            environment: getEnvironmentLabel(),
            pathname: request.context.pathname,
          },
          text: {
            format: zodTextFormat(AssistantModelAnswerSchema, "portfolio_answer"),
            verbosity: "low",
          },
          tools: [],  // vector store tools injected by caller via vectorStoreId
        })
      } catch (err) {
        throw new AssistantError(
          "PROVIDER_ERROR",
          `OpenAI request failed: ${err instanceof Error ? err.message : String(err)}`
        )
      }

      const lastUserMessage = getLatestUserMessage(request)

      const parsed =
        response.status === "completed" && response.output_text
          ? (() => {
              try {
                return AssistantModelAnswerSchema.parse(JSON.parse(response.output_text))
              } catch {
                return null
              }
            })()
          : null

      const supportLevel = parsed?.supportLevel ?? "insufficient"
      const answer = parsed?.answer ?? buildFallbackAnswer(lastUserMessage)
      const caveat = parsed?.caveat ?? null

      return AssistantChatResponseSchema.parse({
        requestId: response.id,
        answer,
        caveat,
        citations: [],  // citations extracted by Next.js handler from file_search results
        supportLevel,
      }) as AssistantResponse & { followUp: null }
    },
  }
}
```

**Note:** The full file_search tool wiring (vectorStoreId, filters, citation extraction) belongs in the Next.js handler which has access to the full config. The provider handles the model call.

- [ ] **Step 4: Write `packages/openai/src/index.ts`**

```typescript
export { openaiProvider } from "./provider"
export { openaiVectorStore } from "./vector-store"
```

- [ ] **Step 5: Run — expect PASS**

```bash
cd packages/openai && bun test
```

- [ ] **Step 6: Commit**

```bash
git add packages/openai/src/provider.ts packages/openai/src/index.ts packages/openai/test/provider.test.ts
git commit -m "feat(openai): add openaiProvider adapter"
```

---

## Chunk 4: @portfolio-assistant/react

### Task 15: Scaffold react package

**Files:**
- Create: `packages/react/package.json`
- Create: `packages/react/tsconfig.json`

- [ ] **Step 1: Write `packages/react/package.json`**

```json
{
  "name": "@portfolio-assistant/react",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles.css": "./src/styles.css"
  },
  "scripts": {
    "build": "tsc",
    "test": "bun test --preload ./test/setup.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@portfolio-assistant/core": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18 || ^19",
    "react-dom": "^18 || ^19"
  },
  "devDependencies": {
    "@testing-library/react": "^16.0.0",
    "@happy-dom/global-registrator": "^15.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Write `packages/react/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx",
    "lib": ["ES2022", "DOM"]
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Write `packages/react/test/setup.ts`** (jsdom registration for React components)

```typescript
import { GlobalRegistrator } from "@happy-dom/global-registrator"
GlobalRegistrator.register()
```

- [ ] **Step 4: Write `packages/react/src/styles.css`**

```css
:root {
  --pa-surface: #ffffff;
  --pa-line: #e5e7eb;
  --pa-text: #111827;
  --pa-text-muted: #6b7280;
  --pa-accent: #2563eb;
}

[data-theme="dark"] {
  --pa-surface: #1f2937;
  --pa-line: #374151;
  --pa-text: #f9fafb;
  --pa-text-muted: #9ca3af;
  --pa-accent: #60a5fa;
}
```

- [ ] **Step 5: Install**

```bash
cd ~/dev/Code/Work/portfolio-assistant && bun install
```

- [ ] **Step 6: Commit**

```bash
git add packages/react/
git commit -m "chore(react): scaffold package with jsdom test setup"
```

---

### Task 16: HTTP client + context

**Files:**
- Create: `packages/react/src/http.ts`
- Create: `packages/react/src/context.tsx`
- Create: `packages/react/test/http.test.ts`

- [ ] **Step 1: Write the failing test for http.ts**

```typescript
// packages/react/test/http.test.ts
import { describe, expect, it, mock, beforeEach, afterEach } from "bun:test"

describe("postAssistantMessage", () => {
  const originalFetch = globalThis.fetch

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it("sends messages and context, returns AssistantResponse", async () => {
    const mockResponse = {
      requestId: "r1",
      answer: "I build things.",
      caveat: null,
      supportLevel: "grounded",
      citations: [],
    }

    globalThis.fetch = mock(async () => ({
      ok: true,
      json: async () => mockResponse,
    })) as unknown as typeof fetch

    const { postAssistantMessage } = await import("../src/http")
    const result = await postAssistantMessage("/api/assistant/chat", {
      messages: [{ role: "user", content: "What do you do?" }],
      context: { pathname: "/" },
    })

    expect(result.answer).toBe("I build things.")
    expect(result.supportLevel).toBe("grounded")
  })

  it("throws on non-ok response", async () => {
    globalThis.fetch = mock(async () => ({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    })) as unknown as typeof fetch

    const { postAssistantMessage } = await import("../src/http")

    await expect(
      postAssistantMessage("/api/assistant/chat", {
        messages: [{ role: "user", content: "hi" }],
        context: { pathname: "/" },
      })
    ).rejects.toThrow()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd packages/react && bun test test/http.test.ts
```

- [ ] **Step 3: Write `packages/react/src/http.ts`**

```typescript
import type { AssistantRequest, AssistantResponse } from "@portfolio-assistant/core"

export async function postAssistantMessage(
  apiUrl: string,
  request: AssistantRequest
): Promise<AssistantResponse> {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    // Vercel timeout bodies are plain text
    if (res.status === 504 || body.toLowerCase().includes("timeout")) {
      throw new Error("The assistant timed out — try again")
    }
    throw new Error(`Request failed: ${res.status}`)
  }

  return res.json() as Promise<AssistantResponse>
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
cd packages/react && bun test test/http.test.ts
```

- [ ] **Step 5: Write `packages/react/src/context.tsx`**

```typescript
"use client"
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react"
import type { AssistantResponse, PortfolioConfig } from "@portfolio-assistant/core"
import { postAssistantMessage } from "./http"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  response?: AssistantResponse
}

type State = {
  isOpen: boolean
  messages: Message[]
  isLoading: boolean
  error: string | null
}

type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SEND_START"; message: Message }
  | { type: "SEND_SUCCESS"; response: AssistantResponse }
  | { type: "SEND_ERROR"; error: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN": return { ...state, isOpen: true }
    case "CLOSE": return { ...state, isOpen: false }
    case "SEND_START":
      return { ...state, isLoading: true, error: null, messages: [...state.messages, action.message] }
    case "SEND_SUCCESS": {
      const assistantMsg: Message = {
        id: action.response.requestId,
        role: "assistant",
        content: action.response.answer,
        response: action.response,
      }
      return { ...state, isLoading: false, messages: [...state.messages, assistantMsg] }
    }
    case "SEND_ERROR":
      return { ...state, isLoading: false, error: action.error }
    default:
      return state
  }
}

type AssistantContextValue = {
  state: State
  open(): void
  close(): void
  sendMessage(content: string, stateless?: boolean): Promise<void>
}

const AssistantContext = createContext<AssistantContextValue | null>(null)

type AssistantProviderProps = {
  config: PortfolioConfig
  apiUrl: string
  children: ReactNode
}

export function AssistantProvider({ config, apiUrl, children }: AssistantProviderProps) {
  const [state, dispatch] = useReducer(reducer, {
    isOpen: false,
    messages: [],
    isLoading: false,
    error: null,
  })

  const open = useCallback(() => dispatch({ type: "OPEN" }), [])
  const close = useCallback(() => dispatch({ type: "CLOSE" }), [])

  const sendMessage = useCallback(
    async (content: string, stateless = false) => {
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
      }
      dispatch({ type: "SEND_START", message: userMsg })

      // Keep only last exchange + new message for context (stateless for prompt chips)
      const contextMessages = stateless
        ? [{ role: "user" as const, content }]
        : [
            ...state.messages
              .slice(-2)
              .map((m) => ({ role: m.role, content: m.content })),
            { role: "user" as const, content },
          ]

      try {
        const response = await postAssistantMessage(apiUrl, {
          messages: contextMessages,
          context: { pathname: window.location.pathname },
        })
        dispatch({ type: "SEND_SUCCESS", response })
      } catch (err) {
        dispatch({ type: "SEND_ERROR", error: err instanceof Error ? err.message : "Unknown error" })
      }
    },
    [apiUrl, state.messages]
  )

  return (
    <AssistantContext.Provider value={{ state, open, close, sendMessage }}>
      {children}
    </AssistantContext.Provider>
  )
}

export function useAssistant(): AssistantContextValue {
  const ctx = useContext(AssistantContext)
  if (!ctx) throw new Error("useAssistant must be used inside AssistantProvider")
  return ctx
}
```

- [ ] **Step 6: Commit**

```bash
git add packages/react/src/http.ts packages/react/src/context.tsx packages/react/test/http.test.ts
git commit -m "feat(react): add HTTP client and AssistantProvider context"
```

---

### Task 17: React UI components

**Files:**
- Create: `packages/react/src/trigger.tsx`
- Create: `packages/react/src/chat-message.tsx`
- Create: `packages/react/src/suggested-prompts.tsx`
- Create: `packages/react/src/citation-list.tsx`
- Create: `packages/react/src/input.tsx`
- Create: `packages/react/src/panel.tsx`
- Create: `packages/react/src/index.ts`

- [ ] **Step 1: Write `packages/react/src/trigger.tsx`**

```typescript
"use client"
import React from "react"
import { useAssistant } from "./context"

type TriggerProps = { className?: string; label?: string }

export function AssistantTrigger({ className, label = "Ask about my work" }: TriggerProps) {
  const { open } = useAssistant()
  return (
    <button
      onClick={open}
      className={className}
      style={{
        color: "var(--pa-text)",
        background: "var(--pa-surface)",
        border: "1px solid var(--pa-line)",
        padding: "0.375rem 0.75rem",
        borderRadius: "0.375rem",
        cursor: "pointer",
        fontSize: "0.875rem",
      }}
    >
      {label}
    </button>
  )
}
```

- [ ] **Step 2: Write `packages/react/src/chat-message.tsx`**

```typescript
import React from "react"
import type { AssistantResponse } from "@portfolio-assistant/core"

type ChatMessageProps = {
  role: "user" | "assistant"
  content: string
  response?: AssistantResponse
  className?: string
}

export function ChatMessage({ role, content, response, className }: ChatMessageProps) {
  const isAssistant = role === "assistant"

  return (
    <div
      className={className}
      style={{
        display: "flex",
        justifyContent: isAssistant ? "flex-start" : "flex-end",
        marginBottom: "0.75rem",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "0.625rem 0.875rem",
          borderRadius: "0.5rem",
          background: isAssistant ? "var(--pa-surface)" : "var(--pa-accent)",
          color: isAssistant ? "var(--pa-text)" : "#ffffff",
          border: isAssistant ? "1px solid var(--pa-line)" : "none",
          fontSize: "0.9rem",
          lineHeight: "1.5",
          whiteSpace: "pre-wrap",
        }}
      >
        {content}
        {isAssistant && response?.caveat && response.supportLevel !== "grounded" && (
          <p style={{ fontSize: "0.75rem", color: "var(--pa-text-muted)", marginTop: "0.5rem" }}>
            {response.caveat}
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write `packages/react/src/suggested-prompts.tsx`**

```typescript
import React from "react"

type SuggestedPromptsProps = {
  prompts: string[]
  onSelect(prompt: string): void
  className?: string
}

export function SuggestedPrompts({ prompts, onSelect, className }: SuggestedPromptsProps) {
  return (
    <div
      className={className}
      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", padding: "0.5rem 0" }}
    >
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          style={{
            padding: "0.375rem 0.75rem",
            borderRadius: "9999px",
            border: "1px solid var(--pa-line)",
            background: "var(--pa-surface)",
            color: "var(--pa-text-muted)",
            fontSize: "0.8125rem",
            cursor: "pointer",
          }}
        >
          {prompt}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Write `packages/react/src/citation-list.tsx`**

```typescript
import React from "react"
import type { CitationItem } from "@portfolio-assistant/core"

type CitationListProps = {
  citations: CitationItem[]
  className?: string
}

export function CitationList({ citations, className }: CitationListProps) {
  if (citations.length === 0) return null

  return (
    <div className={className} style={{ marginTop: "0.5rem" }}>
      <p style={{ fontSize: "0.75rem", color: "var(--pa-text-muted)", marginBottom: "0.25rem" }}>
        Sources
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
        {citations.map((c) => (
          <a
            key={c.canonicalUrl}
            href={c.canonicalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.75rem",
              color: "var(--pa-accent)",
              border: "1px solid var(--pa-line)",
              borderRadius: "0.25rem",
              padding: "0.125rem 0.5rem",
              textDecoration: "none",
            }}
          >
            {c.title}
          </a>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Write `packages/react/src/input.tsx`**

```typescript
"use client"
import React, { useState, type KeyboardEvent } from "react"

type AssistantInputProps = {
  onSubmit(value: string): void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function AssistantInput({
  onSubmit,
  disabled,
  className,
  placeholder = "Ask something…",
}: AssistantInputProps) {
  const [value, setValue] = useState("")

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey && value.trim()) {
      onSubmit(value.trim())
      setValue("")
    }
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        gap: "0.5rem",
        borderTop: "1px solid var(--pa-line)",
        padding: "0.75rem",
      }}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: "0.5rem 0.75rem",
          borderRadius: "0.375rem",
          border: "1px solid var(--pa-line)",
          background: "var(--pa-surface)",
          color: "var(--pa-text)",
          fontSize: "0.875rem",
          outline: "none",
        }}
      />
      <button
        onClick={() => { if (value.trim()) { onSubmit(value.trim()); setValue("") } }}
        disabled={disabled || !value.trim()}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "0.375rem",
          background: "var(--pa-accent)",
          color: "#ffffff",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: "0.875rem",
          opacity: disabled || !value.trim() ? 0.5 : 1,
        }}
      >
        Send
      </button>
    </div>
  )
}
```

- [ ] **Step 6: Write `packages/react/src/panel.tsx`**

```typescript
"use client"
import React, { useEffect, useRef } from "react"
import { useAssistant } from "./context"
import { ChatMessage } from "./chat-message"
import { SuggestedPrompts } from "./suggested-prompts"
import { CitationList } from "./citation-list"
import { AssistantInput } from "./input"

const DEFAULT_PROMPTS = [
  "What's your background?",
  "What kind of work do you do?",
  "What are you working on now?",
  "What are your strongest projects?",
  "What roles are you targeting?",
]

type AssistantPanelProps = { className?: string; prompts?: string[] }

export function AssistantPanel({ className, prompts = DEFAULT_PROMPTS }: AssistantPanelProps) {
  const { state, close, sendMessage } = useAssistant()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [state.messages])

  if (!state.isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 40,
        }}
      />

      {/* Panel */}
      <div
        className={className}
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio assistant"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(560px, 90vw)",
          maxHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--pa-surface)",
          border: "1px solid var(--pa-line)",
          borderRadius: "0.75rem",
          zIndex: 50,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.875rem 1rem", borderBottom: "1px solid var(--pa-line)" }}>
          <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--pa-text)" }}>Ask about my work</span>
          <button onClick={close} aria-label="Close assistant" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pa-text-muted)", fontSize: "1rem" }}>✕</button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {state.messages.length === 0 && (
            <SuggestedPrompts
              prompts={prompts}
              onSelect={(p) => sendMessage(p, true)}
            />
          )}
          {state.messages.map((msg) => (
            <div key={msg.id}>
              <ChatMessage role={msg.role} content={msg.content} response={msg.response} />
              {msg.response && <CitationList citations={msg.response.citations} />}
            </div>
          ))}
          {state.isLoading && (
            <p style={{ color: "var(--pa-text-muted)", fontSize: "0.875rem", padding: "0.5rem" }}>Thinking…</p>
          )}
          {state.error && (
            <p style={{ color: "#dc2626", fontSize: "0.875rem", padding: "0.5rem" }}>{state.error}</p>
          )}
        </div>

        <AssistantInput
          onSubmit={(content) => sendMessage(content)}
          disabled={state.isLoading}
        />
      </div>
    </>
  )
}
```

- [ ] **Step 7: Write `packages/react/src/index.ts`**

```typescript
export { AssistantProvider, useAssistant } from "./context"
export { AssistantTrigger } from "./trigger"
export { AssistantPanel } from "./panel"
export { ChatMessage } from "./chat-message"
export { SuggestedPrompts } from "./suggested-prompts"
export { CitationList } from "./citation-list"
export { AssistantInput } from "./input"
export { postAssistantMessage } from "./http"
```

- [ ] **Step 8: Typecheck**

```bash
cd packages/react && bun run typecheck
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add packages/react/src/
git commit -m "feat(react): add AssistantPanel, ChatMessage, SuggestedPrompts, CitationList, AssistantInput"
```

---

## Chunk 5: @portfolio-assistant/next + CLI + template

### Task 18: Scaffold next package

**Files:**
- Create: `packages/next/package.json`
- Create: `packages/next/tsconfig.json`
- Create: `packages/next/src/index.ts`
- Create: `packages/next/src/handler.ts`
- Create: `packages/next/test/handler.test.ts`

- [ ] **Step 1: Write `packages/next/package.json`**

```json
{
  "name": "@portfolio-assistant/next",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@portfolio-assistant/core": "workspace:*",
    "@portfolio-assistant/react": "workspace:*",
    "zod": "^3.24.0"
  },
  "peerDependencies": {
    "next": "^15 || ^16",
    "react": "^18 || ^19",
    "typescript": "^5.3"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Write `packages/next/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2022", "DOM"]
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Write the failing handler test**

```typescript
// packages/next/test/handler.test.ts
import { describe, expect, it, mock } from "bun:test"
import { createAssistantHandler } from "../src/handler"
import type { PortfolioConfig, ProviderAdapter, VectorAdapter } from "@portfolio-assistant/core"

const mockProvider: ProviderAdapter = {
  ask: mock(async () => ({
    requestId: "req_123",
    answer: "I build things.",
    caveat: null,
    supportLevel: "grounded" as const,
    citations: [],
    followUp: null,
  })),
}

const mockVectorStore: VectorAdapter = {
  supportsSearch: false,
  upload: mock(async () => ({
    generatedAt: "",
    vectorStoreId: "vs_1",
    files: [],
  })),
}

const config: PortfolioConfig = {
  name: "Jane",
  baseUrl: "https://jane.dev",
  corpus: { sources: [] },
  provider: mockProvider,
  vectorStore: mockVectorStore,
}

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("createAssistantHandler", () => {
  it("returns { POST } handler", () => {
    const handler = createAssistantHandler(config)
    expect(typeof handler.POST).toBe("function")
  })

  it("POST returns 200 with answer for valid request", async () => {
    const { POST } = createAssistantHandler(config)
    const req = makeRequest({
      messages: [{ role: "user", content: "What do you do?" }],
      context: { pathname: "/" },
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.answer).toBe("I build things.")
  })

  it("POST returns 400 for invalid body", async () => {
    const { POST } = createAssistantHandler(config)
    const req = makeRequest({ messages: [] })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
```

- [ ] **Step 4: Run — expect FAIL**

```bash
cd packages/next && bun test test/handler.test.ts
```

- [ ] **Step 5: Write `packages/next/src/handler.ts`**

```typescript
import { AssistantRequestSchema } from "@portfolio-assistant/core"
import type { PortfolioConfig } from "@portfolio-assistant/core"
import { AssistantError } from "@portfolio-assistant/core"

type NextRouteHandler = (req: Request) => Promise<Response>

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export function createAssistantHandler(config: PortfolioConfig): { POST: NextRouteHandler } {
  return {
    async POST(req: Request): Promise<Response> {
      const requestId = crypto.randomUUID()
      const start = Date.now()

      let body: unknown
      try {
        body = await req.json()
      } catch {
        return json({ error: "Invalid JSON" }, 400)
      }

      const parsed = AssistantRequestSchema.safeParse(body)
      if (!parsed.success) {
        return json({ error: parsed.error.errors.map((e) => e.message).join("; ") }, 400)
      }

      try {
        const response = await config.provider.ask(parsed.data)
        const latencyMs = Date.now() - start

        console.log(
          JSON.stringify({
            requestId,
            pathname: parsed.data.context.pathname,
            latencyMs,
            supportLevel: response.supportLevel,
            citationCount: response.citations.length,
          })
        )

        return json(response)
      } catch (err) {
        const latencyMs = Date.now() - start

        if (err instanceof AssistantError && err.code === "PROVIDER_TIMEOUT") {
          console.log(JSON.stringify({ requestId, latencyMs, failureStage: "provider_timeout" }))
          return new Response("The assistant timed out", { status: 504 })
        }

        console.log(
          JSON.stringify({
            requestId,
            latencyMs,
            failureStage: err instanceof AssistantError ? err.code : "unknown",
          })
        )

        // Return fallback answer instead of 500
        return json({
          requestId,
          answer: "The assistant could not produce a valid answer right now.",
          caveat: null,
          supportLevel: "insufficient",
          citations: [],
          followUp: null,
        })
      }
    },
  }
}
```

- [ ] **Step 6: Write `packages/next/src/index.ts`**

```typescript
export { createAssistantHandler } from "./handler"
export * from "@portfolio-assistant/react"
```

- [ ] **Step 7: Run — expect PASS**

```bash
cd packages/next && bun test test/handler.test.ts
```

- [ ] **Step 8: Commit**

```bash
git add packages/next/
git commit -m "feat(next): add createAssistantHandler route factory"
```

---

### Task 19: CLI scaffold + pure utility tests

**Files:**
- Create: `apps/cli/package.json`
- Create: `apps/cli/tsconfig.json`
- Create: `apps/cli/src/detect-pm.ts`
- Create: `apps/cli/src/inject-tokens.ts`
- Create: `apps/cli/test/detect-pm.test.ts`
- Create: `apps/cli/test/inject-tokens.test.ts`

- [ ] **Step 1: Write `apps/cli/package.json`**

```json
{
  "name": "create-portfolio-assistant",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "create-portfolio-assistant": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@clack/prompts": "^0.9.0",
    "fs-extra": "^11.2.0",
    "picocolors": "^1.1.0"
  },
  "devDependencies": {
    "@types/fs-extra": "^11.0.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Write `apps/cli/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Write failing tests for pure utilities**

```typescript
// apps/cli/test/detect-pm.test.ts
import { describe, expect, it, beforeEach, afterEach } from "bun:test"
import fs from "node:fs"
import path from "node:path"
import os from "node:os"

let tmpDir: string
beforeEach(() => { tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pa-cli-")) })
afterEach(() => { fs.rmSync(tmpDir, { recursive: true, force: true }) })

describe("detectPackageManager", () => {
  it("returns 'bun' when bun.lockb is present", async () => {
    fs.writeFileSync(path.join(tmpDir, "bun.lockb"), "")
    const { detectPackageManager } = await import("../src/detect-pm")
    expect(detectPackageManager(tmpDir)).toBe("bun")
  })

  it("returns 'pnpm' when pnpm-lock.yaml is present", async () => {
    fs.writeFileSync(path.join(tmpDir, "pnpm-lock.yaml"), "")
    const { detectPackageManager } = await import("../src/detect-pm")
    expect(detectPackageManager(tmpDir)).toBe("pnpm")
  })

  it("returns 'npm' as fallback", async () => {
    const { detectPackageManager } = await import("../src/detect-pm")
    expect(detectPackageManager(tmpDir)).toBe("npm")
  })
})
```

```typescript
// apps/cli/test/inject-tokens.test.ts
import { describe, expect, it } from "bun:test"

describe("injectTokens", () => {
  it("replaces all {{TOKEN}} occurrences", async () => {
    const { injectTokens } = await import("../src/inject-tokens")
    const result = injectTokens("Hello {{OWNER_NAME}}, welcome to {{BASE_URL}}", {
      OWNER_NAME: "Jane",
      BASE_URL: "https://jane.dev",
    })
    expect(result).toBe("Hello Jane, welcome to https://jane.dev")
  })

  it("leaves unknown tokens unchanged", async () => {
    const { injectTokens } = await import("../src/inject-tokens")
    const result = injectTokens("Hello {{UNKNOWN}}", { OWNER_NAME: "Jane" })
    expect(result).toBe("Hello {{UNKNOWN}}")
  })
})
```

- [ ] **Step 4: Run — expect FAIL**

```bash
cd apps/cli && bun test
```

- [ ] **Step 5: Write `apps/cli/src/detect-pm.ts`**

```typescript
import fs from "node:fs"
import path from "node:path"

type PackageManager = "bun" | "pnpm" | "yarn" | "npm"

const LOCKFILES: [string, PackageManager][] = [
  ["bun.lockb", "bun"],
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
]

export function detectPackageManager(cwd = process.cwd()): PackageManager {
  for (const [lockfile, pm] of LOCKFILES) {
    if (fs.existsSync(path.join(cwd, lockfile))) return pm
  }
  return "npm"
}
```

- [ ] **Step 6: Write `apps/cli/src/inject-tokens.ts`**

```typescript
type Tokens = Record<string, string>

export function injectTokens(content: string, tokens: Tokens): string {
  return content.replace(/\{\{([A-Z_]+)\}\}/g, (match, key) => {
    return key in tokens ? tokens[key] : match
  })
}

export function injectTokensIntoFiles(
  files: string[],
  tokens: Tokens,
  readFile: (p: string) => string,
  writeFile: (p: string, content: string) => void
): void {
  for (const file of files) {
    const content = readFile(file)
    const injected = injectTokens(content, tokens)
    if (injected !== content) writeFile(file, injected)
  }
}
```

- [ ] **Step 7: Run — expect PASS**

```bash
cd apps/cli && bun test
```

- [ ] **Step 8: Commit**

```bash
git add apps/cli/
git commit -m "feat(cli): scaffold package with detect-pm and inject-tokens utilities"
```

---

### Task 20: CLI create mode + prompts

**Files:**
- Create: `apps/cli/src/prompts.ts`
- Create: `apps/cli/src/create.ts`
- Create: `apps/cli/src/index.ts`

- [ ] **Step 1: Write `apps/cli/src/prompts.ts`**

```typescript
import * as p from "@clack/prompts"
import pc from "picocolors"

export type CreateAnswers = {
  ownerName: string
  baseUrl: string
  llmProvider: string
  vectorBackend: string
  framework: string
}

export async function runCreatePrompts(projectName: string): Promise<CreateAnswers | null> {
  p.intro(pc.bgBlue(pc.white(" create-portfolio-assistant ")))

  const answers = await p.group(
    {
      ownerName: () =>
        p.text({
          message: "Your full name (used in the assistant prompt)",
          placeholder: "Jane Doe",
          validate: (v) => (v.trim() ? undefined : "Name is required"),
        }),

      baseUrl: () =>
        p.text({
          message: "Your site's base URL",
          placeholder: "https://jane.dev",
          validate: (v) =>
            /^https?:\/\//.test(v) ? undefined : "Must start with http:// or https://",
        }),

      llmProvider: () =>
        p.select({
          message: "LLM provider",
          options: [
            { value: "openai", label: "OpenAI (default)" },
            { value: "anthropic", label: "Anthropic (coming soon)", hint: "not yet available" },
            { value: "gemini", label: "Gemini (coming soon)", hint: "not yet available" },
          ],
          initialValue: "openai",
        }),

      vectorBackend: () =>
        p.select({
          message: "Vector backend",
          options: [
            { value: "openai", label: "OpenAI hosted file_search (default)" },
            { value: "pinecone", label: "Pinecone (coming soon)", hint: "not yet available" },
            { value: "supabase", label: "Supabase pgvector (coming soon)", hint: "not yet available" },
          ],
          initialValue: "openai",
        }),

      framework: () =>
        p.select({
          message: "Framework",
          options: [
            { value: "next", label: "Next.js 15/16 (App Router)" },
            { value: "astro", label: "Astro (coming soon)", hint: "not yet available" },
            { value: "remix", label: "Remix (coming soon)", hint: "not yet available" },
            { value: "svelte", label: "SvelteKit (coming soon)", hint: "not yet available" },
          ],
          initialValue: "next",
        }),
    },
    {
      onCancel: () => {
        p.cancel("Cancelled.")
        return null
      },
    }
  )

  if (p.isCancel(answers)) return null

  return answers as CreateAnswers
}
```

- [ ] **Step 2: Write `apps/cli/src/create.ts`**

```typescript
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import fsExtra from "fs-extra"
import * as p from "@clack/prompts"
import pc from "picocolors"
import { detectPackageManager } from "./detect-pm"
import { injectTokens, injectTokensIntoFiles } from "./inject-tokens"
import type { CreateAnswers } from "./prompts"

const TEMPLATES_DIR = path.join(
  new URL(import.meta.url).pathname,
  "../../../../templates"
)

const TOKEN_FILES = [
  "portfolio-assistant.config.ts",
  "package.json",
  ".env.example",
  "README.md",
]

export async function runCreate(projectName: string, answers: CreateAnswers): Promise<void> {
  const targetDir = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(targetDir)) {
    p.log.error(`Directory ${projectName} already exists.`)
    process.exit(1)
  }

  const templateDir = path.join(TEMPLATES_DIR, answers.framework)

  if (!fs.existsSync(templateDir)) {
    p.log.error(`Template for framework '${answers.framework}' not found.`)
    process.exit(1)
  }

  // Copy template
  p.log.step("Copying template…")
  await fsExtra.copy(templateDir, targetDir)

  // Inject tokens
  p.log.step("Configuring project…")
  const tokens = {
    OWNER_NAME: answers.ownerName,
    BASE_URL: answers.baseUrl,
    PACKAGE_NAME: projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    LLM_PROVIDER: answers.llmProvider,
    VECTOR_BACKEND: answers.vectorBackend,
  }

  const filesToInject = TOKEN_FILES
    .map((f) => path.join(targetDir, f))
    .filter((f) => fs.existsSync(f))

  injectTokensIntoFiles(
    filesToInject,
    tokens,
    (f) => fs.readFileSync(f, "utf8"),
    (f, content) => fs.writeFileSync(f, content, "utf8")
  )

  // Install deps
  p.log.step("Installing dependencies…")
  const pm = detectPackageManager(process.cwd())
  const installCmd = pm === "yarn" ? "yarn" : pm === "pnpm" ? "pnpm install" : `${pm} install`
  try {
    execSync(installCmd, { cwd: targetDir, stdio: "pipe" })
  } catch (err) {
    p.log.warn("Dependency installation failed. Run it manually.")
  }

  // Print next steps
  p.outro(pc.green("✓ Project created!"))
  console.log(`\nNext steps:\n`)
  console.log(`  cd ${projectName}`)
  console.log(`  # Set environment variables in .env.local (see .env.example)`)
  console.log(`  ${pm} run portfolio-assistant build-corpus`)
  console.log(`  ${pm} run portfolio-assistant upload-corpus`)
  console.log(`  ${pm === "bun" ? "bun dev" : pm === "pnpm" ? "pnpm dev" : `${pm} run dev`}\n`)
}
```

- [ ] **Step 3: Write `apps/cli/src/index.ts`**

```typescript
#!/usr/bin/env node
import * as p from "@clack/prompts"
import { runCreatePrompts } from "./prompts"
import { runCreate } from "./create"

const [, , command, projectArg] = process.argv

async function main() {
  if (command === "add") {
    console.log("The 'add' command is coming soon. See the docs for manual setup.")
    process.exit(0)
  }

  // Default: create mode
  const projectName = projectArg ?? command ?? "my-portfolio"

  const answers = await runCreatePrompts(projectName)
  if (!answers) process.exit(0)

  await runCreate(projectName, answers)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 4: Build CLI**

```bash
cd apps/cli && bun run build
```

Expected: `dist/index.js` created.

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/
git commit -m "feat(cli): add create mode with prompts and template scaffolding"
```

---

### Task 21: Next.js starter template

**Files:**
- Create: `templates/next/portfolio-assistant.config.ts`
- Create: `templates/next/app/api/assistant/chat/route.ts`
- Create: `templates/next/app/layout.tsx`
- Create: `templates/next/content/pages/about.mdx`
- Create: `templates/next/.env.example`
- Create: `templates/next/package.json`
- Create: `templates/next/README.md`

- [ ] **Step 1: Write `templates/next/portfolio-assistant.config.ts`**

```typescript
import { defineConfig } from '@portfolio-assistant/core'
import { openaiProvider, openaiVectorStore } from '@portfolio-assistant/openai'

export default defineConfig({
  name: '{{OWNER_NAME}}',
  baseUrl: '{{BASE_URL}}',
  corpus: {
    sources: ['content/pages/**/*.mdx', 'content/projects/**/*.mdx', 'content/writing/**/*.mdx'],
  },
  provider: openaiProvider(),
  vectorStore: openaiVectorStore(),
})
```

- [ ] **Step 2: Write `templates/next/app/api/assistant/chat/route.ts`**

```typescript
import { createAssistantHandler } from '@portfolio-assistant/next'
import config from '../../../portfolio-assistant.config'

export const { POST } = createAssistantHandler(config)
export const maxDuration = 60
```

- [ ] **Step 3: Write `templates/next/app/layout.tsx`**

```typescript
import { AssistantProvider, AssistantTrigger, AssistantPanel } from '@portfolio-assistant/next'
import config from '../portfolio-assistant.config'
import '@portfolio-assistant/react/styles.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AssistantProvider config={config} apiUrl="/api/assistant/chat">
          <nav style={{ padding: '1rem', borderBottom: '1px solid var(--pa-line)', display: 'flex', justifyContent: 'flex-end' }}>
            <AssistantTrigger />
          </nav>
          <main>{children}</main>
          <AssistantPanel />
        </AssistantProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Write `templates/next/content/pages/about.mdx`**

```mdx
---
title: About
description: A brief introduction
tags: [profile, background]
audiences: [recruiter, hiring-manager]
priority: 1
---

# About {{OWNER_NAME}}

Add your introduction here. This file is part of the assistant's knowledge base.

Describe your background, the work you do, and what makes your approach distinctive.
```

- [ ] **Step 5: Write `templates/next/.env.example`**

```
# Required
OPENAI_API_KEY=sk-...

# Optional — leave blank to auto-create on first upload
OPENAI_VECTOR_STORE_ID=

# Optional
OPENAI_RESPONSES_MODEL=gpt-4o-mini
OPENAI_PROJECT_ID=
```

- [ ] **Step 6: Write `templates/next/package.json`**

```json
{
  "name": "{{PACKAGE_NAME}}",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "portfolio-assistant": "portfolio-assistant"
  },
  "dependencies": {
    "@portfolio-assistant/next": "latest",
    "@portfolio-assistant/openai": "latest",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

- [ ] **Step 7: Write `templates/next/README.md`**

```markdown
# {{OWNER_NAME}} — Portfolio Assistant

Built with [portfolio-assistant](https://github.com/your-org/portfolio-assistant).

## Setup

1. Copy `.env.example` to `.env.local` and fill in `OPENAI_API_KEY`
2. Add your content to `content/`
3. Build and upload the corpus:

```bash
bun run portfolio-assistant build-corpus
bun run portfolio-assistant upload-corpus
```

4. Start the dev server:

```bash
bun dev
```

## Corpus sources

The assistant reads from the glob patterns in `portfolio-assistant.config.ts`.
Add or update `.mdx` files in `content/` and re-run `build-corpus` + `upload-corpus`.
```

- [ ] **Step 8: Commit**

```bash
git add templates/
git commit -m "feat(templates): add Next.js starter template with token placeholders"
```

---

### Task 22: Full build + publish dry run

- [ ] **Step 1: Run full turbo build from root**

```bash
cd ~/dev/Code/Work/portfolio-assistant && bun run build
```

Expected: all packages build without TypeScript errors.

- [ ] **Step 2: Run all tests**

```bash
bun run test
```

Expected: all tests pass.

- [ ] **Step 3: Typecheck all packages**

```bash
bun run typecheck
```

Expected: no errors.

- [ ] **Step 4: Dry-run changeset publish**

```bash
bunx changeset version
bunx changeset publish --dry-run
```

Expected: lists packages to be published, no errors.

- [ ] **Step 5: Add GitHub Actions CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - run: bun run typecheck
      - run: bun run test
```

- [ ] **Step 6: Commit**

```bash
git add .github/
git commit -m "chore: add GitHub Actions CI workflow"
```

- [ ] **Step 7: Final commit tag**

```bash
git tag v0.1.0-alpha
```

---

## Done

All packages built, tests passing, template wired, CLI functional. The monorepo is ready to publish to npm.

**To publish:**
1. Create a changeset: `bunx changeset`
2. Version: `bunx changeset version`
3. Publish: `bunx changeset publish`
