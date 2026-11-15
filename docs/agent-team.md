# Collaboration map

These are areas of familiarity and ownership, not a fixed team that every task
must spawn. An agent may work across areas when the change is cohesive. Read
[`../AGENTS.md`](../AGENTS.md) first.

| Area | Primary paths | Useful context |
|---|---|---|
| Main/backend | `apps/biyori/src/main/track/**`, `apps/biyori/src/main/router/**`, `apps/biyori/src/main/services/**`, `apps/biyori/src/main/db/**`, `apps/biyori/src/lib/**`, `packages/recognition`, `packages/hana` | SQLite with Drizzle, Hana scan/identify, candidate cache in `track/match.ts`, `notifyLibraryIndex`, app settings schema |
| Renderer | `apps/biyori/src/renderer/src/**`, `packages/translations/locales/*` | TanStack Router conventions, shared UI components, `useAppLiveSync` invalidation, tRPC client |
| Cross-cutting | Shared contracts, generated `routeTree.gen.ts`, Drizzle migrations, Electron config, unowned paths | Coordinate interfaces and migrations with the relevant area owner; run relevant checks |

## Working across agents

- Prefer one agent for a continuous investigation or trace. Split work only when
  tasks are genuinely independent and have bounded outputs.
- Assign one owner to files or contracts that multiple work areas need to change.
  Avoid concurrent edits to the same files.
- Agree on shared interfaces before parallel implementation. The integrator
  checks the combined diff and resolves conflicts; reviewers remain read-only.
- Reviewers should report actionable, confirmed findings with file and line
  references. They should not reimplement or silently edit the reviewed work.
- Do not assume a particular agent framework, messaging tool, fixed team size, or
  commit workflow. Follow the active environment and the user's instructions.

## Multi-agent execution protocol

Every work item has one **coordinator/integrator**. That role can move to the
next model or agent at a handoff, but only one coordinator owns the shared queue,
integration, and final completion decision at a time.

### Before parallelizing

1. The coordinator records the work ID, acceptance criteria, dependencies, and
   parallelization decision in [`work-backlog.md`](work-backlog.md).
2. Delegate only bounded tasks that can make progress independently. Give every
   worker an explicit write scope, paths it must not change, shared contracts to
   follow, and the expected report and validation.
3. Keep write scopes disjoint. If tasks need the same files, generated routes,
   schemas, IPC contracts, or database migrations, assign one owner and sequence
   those changes instead of editing them concurrently.
4. Use a separate Git worktree/branch for each parallel writer when available.
   Never let multiple writers edit the same worktree concurrently. If isolation
   is unavailable, parallelize read-only investigation/review and serialize
   edits.
5. Workers do not edit the shared backlog or handoff, change queue order, or
   declare work done. They return a concise report to the coordinator with:
   summary, changed paths, tests/checks and exact results, unresolved questions,
   blockers, and any unintegrated commit or worktree location. Do not commit
   unless the user requested it.

Use this brief when assigning a worker; omit sections that do not apply:

```text
Work ID and goal:
Acceptance criteria:
Allowed write paths:
Do not edit:
Shared contract / decisions to follow:
Validation to run:
Return: summary, changed paths, exact check results, blockers, remaining work
```

### Integration checklist

The coordinator does not mark a work item `done` until it has:

- [ ] Collected each worker's report and confirmed which changes are integrated.
- [ ] Inspected the combined diff, including user changes and generated files.
- [ ] Resolved conflicts and verified the final write scopes did not overlap
  unsafely.
- [ ] Run the relevant validation against the integrated tree, not just worker
  branches.
- [ ] Checked every acceptance criterion, including linked bug/feature items.
- [ ] Updated the work backlog and handoff with results and remaining work.

## Handoff

Before passing work to another agent, update [`agent-handoff.md`](agent-handoff.md)
using its status and sections. Include verified progress, changed paths, decisions,
commands and results, blockers, Git/worktree state, and the next concrete steps.
The receiving agent must read the note and verify it against the current worktree
before continuing. Mark the note complete when the task is done.

For bug fixes and features, also update [`work-backlog.md`](work-backlog.md): the
backlog owns shared queue order and per-item checklists; the handoff note owns
the current agent's short-term continuation details.

Follow [`.rules.md`](../.rules.md) for test scope and mockup behavior. For tests,
prefer focused `*.test.ts` cases beside the code for parsing, matching, trust
boundaries, migrations, and non-trivial logic. Do not add tests that merely repeat
constants, labels, defaults, or one-line behavior.
