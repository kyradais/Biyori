# Agent instructions

These instructions apply to the whole repository and to every agent/model working
in it, regardless of editor or tool.

## Before starting

1. Read this file, [`.rules.md`](.rules.md), and [`docs/agent-team.md`](docs/agent-team.md).
2. Read [`docs/work-backlog.md`](docs/work-backlog.md) before starting bug or
   feature work. Continue an in-progress item or take the earliest actionable
   unfinished item by order unless the user explicitly selects another one.
   Triage an earlier `needs-triage` item before starting a later queued one;
   temporarily skip a blocked item only while its blocker remains unresolved.
3. Read [`docs/agent-handoff.md`](docs/agent-handoff.md). If its status is `active`,
   treat the work as a continuation, then verify the notes against the current
   worktree and user request.
4. Check `git status --short` and inspect existing changes before editing. Preserve
   work that was not made for your task.
5. Read the relevant `.cursor/rules/*.mdc` files when working on areas they cover.
   Cursor may load them automatically; other agents must read them explicitly.

The handoff note is context, not proof: confirm the current files, diff, and test
results yourself. If notes conflict with the user's latest request, follow the
latest request and explain the discrepancy.

## Project map

Biyori is a Bun-workspace monorepo for an Electron desktop application.

- `apps/biyori/src/main`: Electron main process, services, database, providers,
  and filesystem-facing work.
- `apps/biyori/src/preload`: the isolated bridge between main and renderer.
- `apps/biyori/src/renderer/src`: React UI and TanStack Router.
- `apps/biyori/src/shared` and `apps/biyori/src/lib`: shared contracts and helpers.
- `packages/`: reusable workspace packages, including Hana's Rust native addon.
- `apps/docs`: product and developer documentation.

The root manifest specifies Bun 1.4.4 and requires Node.js 24.22.1 or newer.
Hana builds require the Rust toolchain. Install workspace packages with
`bun install --frozen-lockfile`; do not update the lockfile unless dependencies
are intentionally changing.

Use the existing patterns at the nearest call sites. Validate IPC inputs with Zod
in the router, use bound database queries, and validate renderer-provided paths
against the library roots. Reuse existing UI components and avoid adding
dependencies unless the task requires them.

## Change and validation rules

- Make the smallest complete change for the request. Keep unrelated work untouched.
- Update documentation directly affected by behavior or workflow changes.
- Add focused regression tests for meaningful behavior changes; follow
  [`.rules.md`](.rules.md) for what should and should not be tested.
- For changed JS/TS/JSON/CSS files, run the scoped Biome command described in
  [`.cursor/rules/biome-check.mdc`](.cursor/rules/biome-check.mdc). Do not run
  `bun run typecheck` or a package typecheck after editing unless the user asks.
- Run the relevant focused tests and report commands that could not be run.
- Biyori is an Electron app, not a browser app. Do not open its Vite dev server in
  a browser; follow `.rules.md` for mockups.
- Do not commit unless the user asks. If asked, use Conventional Commits and stage
  only files belonging to that change.

Read [`.cursor/rules/renderer-freeze.mdc`](.cursor/rules/renderer-freeze.mdc)
before changing hash search params, settings overlays/tables, or React Hook Form
settings code. Read [`.cursor/rules/conventional-commits.mdc`](.cursor/rules/conventional-commits.mdc)
when the user asks for a commit.

## Bug and feature backlog

[`docs/work-backlog.md`](docs/work-backlog.md) is the persistent source of truth
for reported bugs, feature requests, queue order, and implementation checklists.

- Add each bug and feature as an item with a stable `BUG-NNN` or `FEAT-NNN` ID.
  Both types use one global queue; append every new item at the end by default.
- Before implementation, record current behavior/requested outcome, acceptance
  criteria, diagnosis or design, and a concrete, item-specific checklist. Refine
  the checklist as investigation clarifies the scope.
- Update status and checklist as work proceeds. Mark an item `done` only after
  its acceptance criteria and applicable validation are satisfied. If validation
  cannot run, record the blocker and do not mark it done.
- Do not skip earlier queued work just because a newer bug or feature was
  mentioned. Follow an explicit user selection if they ask for a different item.
- An agent may reorder the queue when investigation finds a dependency, a
  materially higher user impact, or another concrete reason. Update queue
  positions and add the reason to the change log before starting reordered work.
  The user's explicit priority always wins.
- Record explicit dependencies; queue order alone does not mean one item depends
  on another. Link overlapping bugs and features with `Related to` or
  `Depends on`; verify both acceptance criteria if one implementation addresses
  both items.
- For parallel work, follow the coordinator and file-ownership protocol in
  [`docs/agent-team.md`](docs/agent-team.md). Only the coordinator edits the
  shared backlog and handoff while workers are active; workers report progress
  and evidence to the coordinator.

## Handoff between agents or sessions

When work will continue in another agent, model, or session:

1. Update [`docs/agent-handoff.md`](docs/agent-handoff.md) before stopping.
2. Include the active `BUG-NNN` or `FEAT-NNN` if the work belongs to the backlog.
   Record completed checklist items, remaining work, files changed,
   decisions/constraints, exact validation results, blockers, and current Git
   state. Write concrete next actions rather than “continue”.
3. Do not include credentials, tokens, private user data, or unrelated source
   dumps in the handoff.
4. The next agent reads the handoff, checks the worktree and diff, then continues
   without redoing completed work.
5. When the task is complete, mark the handoff `complete` and summarize the
   outcome. For a new task, replace the old note only after it is complete.
6. If parallel workers were used, record each worker's owned paths and whether
   its changes are integrated or remain in another worktree/branch.

If work ends without a handoff, leave the note `idle`. The handoff template is
shared project state; do not use it as a place for unrelated planning.
