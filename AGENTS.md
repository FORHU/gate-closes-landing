<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Branching: Continuous Staging and On-Demand Main Synchronization

> This section takes precedence over any other branch or pull-request-target instruction in this file.
> `main` is this repository's production branch.

The development workflow is continuous and is not restricted to a daily schedule, a single task, or a fixed number of tasks.

- Before beginning a new development cycle, inspect the relationship between `main` and `staging` and synchronize them when necessary.
- All task branches must originate from the latest `staging`.
- Completed tasks must be submitted through PRs targeting `staging`.
- Developers may continue starting and completing additional tasks for as long as needed.
- Do not synchronize `staging` into `main` automatically after each task, after a fixed time interval, or simply because the day has ended.
- Synchronize `staging` into `main` only when the team explicitly decides that the accumulated changes are ready for delivery.
- Before synchronization, validate the combined changes and complete all required reviews and checks.
- Never merge unfinished or known-broken changes into `main`.
- After synchronization, verify the resulting branch state before continuing.
- **When a task is done, ask the repository owner / team lead whether it is all good.** They decide whether it merges and when `staging` is synchronized; an agent's or author's own judgment is not approval.
- **Check deploy triggers before merging into `staging`:** some repos deploy on pushes to `staging` (see `.github/workflows/`). Merging is a deployment decision, not just a code review.
- **Project board:** move the item through the product's GitHub Project — Backlog → To-Do → In progress → Done.

**Workflow:** Establish baseline → Develop tasks → Merge completed tasks into staging → Continue working or synchronize to main when ready → Repeat.

`staging` is the continuous integration branch. `main` is updated on demand when the team chooses to deliver the accumulated changes.

```bash
# Start a task
git fetch origin
git log --oneline origin/main..origin/staging   # what staging has that main doesn't
git checkout staging && git pull
git checkout -b <type>/<short-description>      # feat/, fix/, docs/, test/, chore/ ...

# Finish a task: open a PR into staging (never into main)
gh pr create --base staging

# Deliver (only when the owner decides): one PR from staging into main
gh pr create --base main --head staging
```


---

## 1. Work Safety

### Inspect Before Editing
- Before changing anything, check `git status`, the current branch and `git diff`.
- Work out whether any uncommitted changes belong to the current task.
- Never discard, reset, clean, stash or commit existing work without explicit authorization.

### One Branch Per Task
- Before writing code or changing files, create or switch to a dedicated task branch. Never develop directly on `main`, `master` or `staging`.
- Branch names:
  - `feat/<short-description>`: new features
  - `fix/<short-description>`: bug fixes
  - `perf/<short-description>`: performance improvements
  - `refactor/<short-description>`: refactoring
  - `docs/<short-description>`: documentation
  - `test/<short-description>`: tests
  - `chore/<short-description>`: tooling, CI, dependencies
- Never mix unrelated work into one branch (no caching work in an auth branch).
- **Cross-repo consistency:** if a task spans `gate-closes-api-v2`, `gate-closes-app-v2` and `gate-closes-landing`, use the same branch name in each affected repo.
- The `feature-branching` skill (`.claude/skills/feature-branching/SKILL.md`) has the step-by-step procedure.

### Preserve Existing Work
- If the working tree has unrelated uncommitted changes, do not commit, stash or move them on your own.
- If existing changes overlap the task, or their ownership is unclear, stop and ask before editing.
- Before switching branches, check that uncommitted changes won't be carried into another task.

### Branch Creation and Checkpoints
- Check whether the branch already exists (`git branch -a`) before creating it. If it does, inspect its status and history before reusing it.
- Never reset or overwrite an existing branch to force-match a preferred starting point.
- For risky or multi-step changes, set a recoverable baseline while the tree is clean (a local `checkpoint-<task>-baseline` tag). Never commit unrelated changes to create one.

### Commits, Pushes and Pull Requests
- **Commit only when the user explicitly asks for a commit.** "Proceed", "ok" or "continue" are not commit requests.
- Use conventional commit messages (`feat(scope): ...`, `fix(scope): ...`), one commit per feature.
- Do not push, open a pull request, merge into a shared branch or deploy unless the user asks.
- **Never delete branches** (local or remote: `git branch -d`/`-D`, `git push --delete`), even after a merge, unless the user explicitly says so. Branches are kept for audit, rollback and recovery.
- Never commit `.env` files, credentials, tokens, private keys or real user data (boarding passes, tickets, emails).

---

## 2. Scope and Honesty

- **Stay in scope:** no unrelated refactors, formatting sweeps or behaviour changes.
- **Keep what works working:** never regress existing flows (sign-in, seeding, offers, maps).
- Keep comments, docs and error handling that are unrelated to the change.
- **Report honestly:** if a test, lint or check fails, report the exact failure. A passing build or typecheck is not proof the feature works.
- Never declare a task complete while required verification is failing or was not run. Keep what was implemented separate from what was only planned.

---

## 3. This Repo

The Gate Closes marketing site and staff admin: Next.js (see the Next.js note at the top of this file), pnpm.
- The landing page is at `/`; the admin is at `/admin` and `/fagc-admin-login`.
- The admin talks to `gate-closes-api-v2`.

Read before working:
- `CONTEXT.md`: landing-page vocabulary (Section Container, Hero Scene, and so on). Use its terms.
- `docs/adr/`: architecture decisions
- `lib/site.ts`: sitewide facts (name, tagline, links, contact). Every product claim in the copy must match shipped behaviour.

### Deploys and CI
- `ci.yml` runs on pushes and PRs to `main` and `staging`.
- `deploy-dev.yml` deploys on **every push to `main`**, and manually through `workflow_dispatch`. Delivering `staging` into `main` is therefore a deployment.

---

## 4. Rules

- **Don't change the existing landing or admin colors, themes or page structure unless explicitly asked.** That design work is owned by its author.
- The landing page is dark-only (the `.dark` wrapper in `app/page.tsx`); admin and 404 keep the root theme.
- Architecture boundaries are enforced by `pnpm validate` (`tools/validate-architecture.mjs`). Fix the code, not the validator.

---

## 5. Verification Checklist

1. `pnpm type-check`
2. `pnpm lint`
3. `pnpm validate`
4. `pnpm build`

---

## Completion Report

Before ending a task, report:
- **Branch:** the branch used in each repo.
- **Changes:** what was implemented or fixed.
- **Files:** the important files created, changed or removed.
- **Database:** schema changes, migrations, seeds (or "none").
- **Security:** auth, permissions or data-integrity implications (or "none").
- **Verification:** each check from the checklist above, marked one of:
  - **Passed**
  - **Failed (changes):** caused by this task; must be fixed before completion
  - **Pre-existing failure:** unrelated, and already failing before the task
  - **Blocked:** could not run (missing env or service); say what is missing

  Never skip a check silently or report a blocked check as passed.
- **Remaining work:** known gaps, edge cases and follow-ups.
