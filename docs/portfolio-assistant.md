# Portfolio Assistant

V1 ships as a single server-side portfolio assistant built on the OpenAI Responses API with hosted `file_search`.

## Why this architecture

- The core problem is grounded retrieval over a narrow public corpus, not multi-agent orchestration.
- Hosted vector stores remove the need to own chunking, embeddings, and retrieval infrastructure on day one.
- The request path stays simple: one route, one constrained prompt, one structured response envelope.
- The code is shaped so an Agents SDK wrapper can be added later if tracing, sessions, or guardrails need to move into the runtime.

This is intentionally different from the earlier self-managed vector DB direction. For V1, hosted file search reduces operational surface area and keeps the retrieval system aligned with the OpenAI request path already used for generation.

## Public source policy

The assistant answers only from approved public material:

- `content/pages/*`
- `content/projects/*`
- `content/writing/*`
- `content/assistant/*`
- `src/config/site-home.ts`
- `src/config/site-resume.ts`
- `src/app/profile.json/route.ts`

Resume PDFs remain publishing outputs. Retrieval uses curated markdown resume documents under `content/assistant/resume/`.

## Prompt rules

The assistant is a public portfolio assistant, not a personal simulation.

It is instructed to:

- answer from evidence first
- avoid inventing claims, metrics, dates, or employers
- state uncertainty explicitly when the corpus is thin
- distinguish fact from synthesis
- stay within public professional scope
- keep tone aligned with `OVERVIEW.md`: restrained, clear, and non-hyped

## Response contract

The server validates every model answer against a strict schema:

- `answer`
- `supportPoints`
- `caveat`
- `suggestedQuestions`
- `citations`
- `supportLevel`

This keeps rendering stable and makes unsupported answers degrade predictably instead of drifting into free-form chat output.

The UI intentionally suppresses visible `supportPoints` for normal responses. The answer itself should carry the useful substance, while caveats are only surfaced when support is partial or insufficient. This keeps the assistant from reading like it is exposing internal reasoning under the main answer.

## Corpus workflow

1. Curate or update source content in `content/` and the relevant config files.
2. Build the normalized corpus:

```bash
bun run assistant:build-corpus
```

This writes:

- `data/assistant/public-corpus.json`
- `data/assistant/files/*.md`

3. Upload the corpus to the hosted vector store:

```bash
bun run assistant:upload-corpus
```

This writes `data/assistant/vector-store-manifest.json`, which maps uploaded file IDs back to public URLs for citation rendering.

## Environment variables

- `OPENAI_API_KEY`
- `OPENAI_RESPONSES_MODEL`
- `OPENAI_VECTOR_STORE_ID`
- `OPENAI_PROJECT_ID` (optional)

If `OPENAI_VECTOR_STORE_ID` is omitted, the upload script can create a vector store and persist its ID into the local manifest.

The runtime default for `OPENAI_RESPONSES_MODEL` is `gpt-5-mini`.

The assistant request does not send `temperature`. This is intentional: GPT-5 Responses requests for this flow reject that parameter, and the assistant does not need sampling control for narrow retrieval-grounded answers.

The server treats incomplete structured output as recoverable. If the model is cut off before it finishes valid JSON, the route returns a narrow fallback answer instead of failing the request.

## UI behavior

- The assistant is mounted globally from the scaffold, not page-by-page.
- It is hidden on `/art` because the art editor uses a separate shell.
- It is hidden when machine mode is active.
- Desktop entry lives in the top navigation, immediately before the theme toggle, as an `Ask about my work` trigger with a restrained shiny text treatment.
- Mobile entry is exposed from the navigation menu instead of a floating button.
- The chat opens as a centered modal with a blurred page backdrop, not a corner drawer. This keeps the interaction calmer and makes the assistant feel subordinate to the portfolio rather than a separate product surface.
- The panel hierarchy is intentionally quiet: one primary surface, lighter prompt chips, and softer user/assistant message separation.

## Analytics and logging

Client analytics events:

- `assistant_opened`
- `assistant_prompt_clicked`
- `assistant_message_sent`
- `assistant_answer_received`
- `assistant_source_clicked`

Server logs include:

- `requestId`
- `pathname`
- `latencyMs`
- `tool`
- `citationCount`
- `failureStage` on errors
