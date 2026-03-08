# Performance Optimizations

## 2026-03-08: Assistant Token-Usage Reduction Pass

### Goal

Reduce token burn in the portfolio assistant without degrading the core interaction:

- calm, concise answers
- grounded retrieval over public material
- stable modal UX
- better visibility into model behavior over time

### Changes

1. Removed model-generated follow-up questions.

- The assistant no longer spends output tokens generating `suggestedQuestions`.
- The UI already has strong local route-aware prompt suggestions in `src/lib/ai/suggestions.ts`.
- This cuts output size and removes one source of structured-output sprawl.

2. Removed `supportPoints` from the model contract.

- The UI was not rendering these points anymore.
- Keeping them in the schema still forced the model to budget for an extra array field on every answer.
- The answer body now carries the useful substance directly.

3. Made prompt-chip questions stateless.

- Clicking a suggested prompt now sends only the clicked question to `/api/assistant/chat`.
- This avoids replaying the full session transcript for one-off recruiter-style questions.
- The session still remains visible in the UI; the optimization only affects what is sent to the model.

4. Capped typed follow-up context to the most recent exchange.

- Typed follow-ups now send:
  - previous user turn
  - previous assistant answer
  - current user turn
- This preserves enough local continuity for references like "that project" or "that role" without paying to resend the entire conversation.

5. Lowered verbosity and added usage telemetry.

- GPT-5 requests already use `reasoning.effort = "low"`.
- This pass also forces `text.verbosity = "low"` to keep answers shorter and more recruiter-readable.
- Route logs now record:
  - `interactionSource`
  - `requestMessageCount`
  - `inputTokens`
  - `cachedInputTokens`
  - `outputTokens`
  - `reasoningTokens`
  - `totalTokens`

### Why these changes

The main token-cost driver was not retrieval alone. It was repeated prompt shape:

- replaying the entire transcript on every turn
- asking the model to generate follow-up prompts already available locally
- keeping schema fields that the UI no longer needed
- letting the model speak more than the product required

These optimizations attack those waste points first because they reduce both cost and failure risk:

- fewer prompt tokens
- fewer completion tokens
- fewer structured-output cutoffs
- better observability when behavior shifts after model changes

### Files changed

- `src/lib/ai/schema.ts`
- `src/lib/ai/prompts.ts`
- `src/lib/ai/ask-portfolio-assistant.ts`
- `src/lib/ai/request-messages.ts`
- `src/components/ai/assistant-context.tsx`
- `src/components/ai/assistant-shell.tsx`
- `src/app/api/assistant/chat/route.ts`
- `README.md`
- `docs/portfolio-assistant.md`

### Validation

Validated with:

- `bun run test`
- `bun run lint`
- `bun run typecheck`
- `bun run build`

### Next measurements to watch

- average `inputTokens` by `interactionSource`
- average `reasoningTokens` for GPT-5 requests
- cache-hit share via `cachedInputTokens`
- timeout rate
- answer quality differences between `gpt-5-mini` and lower-cost fallback models
