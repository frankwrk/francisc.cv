## Development workflow (solo, agent‑friendly)

This repo is solo‑maintained, but `main` should stay clean and always‑deployable. The steps below are tuned for working with AI agents (Cursor / Claude Code) without letting them create chaos.

---

### Branch & worktree model

- **Never develop directly on `main`** for non‑trivial work.
- For each task/feature:

```bash
# 1. Sync main
git switch main
git pull

# 2. Create a task branch
git switch -c <short-task-name>

# 3. (Recommended) Create a separate worktree for that branch
git worktree add ../francisc.cv-<short-task-name> <short-task-name>
```

Examples:

```bash
git switch -c scaffold-ruler-spacing
git worktree add ../francisc.cv-scaffold scaffold-ruler-spacing
```

Open the **worktree** directory in Cursor (not the root repo) so AI sessions are naturally scoped to that branch.

---

### Per‑task loop

Inside the worktree:

1. **Clarify the task in writing**
   - 1–3 bullets in a note / TODO / comment:
     - What you’re changing
     - Why it matters
     - How you’ll verify it works

2. **Let the agent implement in small steps**
   - Keep the scope tight: only the files that actually need to change.
   - After each meaningful batch of edits:

   ```bash
   bun run lint
   bun run typecheck
   ```

   - Run any focused tests you care about (e.g. Playwright) rather than skipping verification.

3. **You review before committing**

```bash
git status
git diff
```

Look for:
- Only expected files changed (no stray edits or formatting churn)
- No debug code
- No accidental config changes

4. **Commit with a “why” message**

One logical commit per small unit of work:

```bash
git commit -am "refactor: align scaffold paddings with config"
git commit -am "fix: update side ruler ticks for dynamic height"
```

Focus commit messages on intent and effect, not just “fix stuff”.

5. **Merge back to main**

From the root repo (not the worktree):

```bash
git switch main
git merge <short-task-name>
git push
```

Optionally open a PR against `main` and review your own work before merging.

6. **Clean up the worktree and branch**

```bash
git worktree remove ../francisc.cv-<short-task-name>
git branch -d <short-task-name>
```

---

### How to use AI agents in this workflow

When working inside a task worktree:

- **Good responsibilities for the agent**
  - Mechanical edits across multiple files (e.g. Tailwind v4 variable migration)
  - Implementing clearly‑scoped changes you’ve described
  - Running `bun run lint` / `bun run typecheck` and summarizing issues
  - Producing short summaries of what changed and why

- **Your responsibilities**
  - Define the task and its boundaries
  - Decide which files *should* be touched
  - Review diffs and behavior before committing
  - Control when to commit, merge, and deploy

**Rules of thumb**

- Don’t let agents:
  - Commit or merge unless you explicitly ask for it
  - “Clean up” unrelated areas in the same branch
  - Reformat large swaths of code without a reason

- Do require agents to:
  - Run lint/typecheck after non‑trivial edits
  - Tell you exactly which files they changed and why
  - Keep changesets small and reviewable

---

### Project‑specific checks

For this repo:

- **Lint:** `bun run lint`
- **Types:** `bun run typecheck`
- **Dev server:** `bun dev`
- **Build:** `bun run build`

Before merging to `main`, `bun run lint` and `bun run typecheck` should both pass with **no errors**. Warnings are allowed but should be understood and intentional.

