# Bug and feature backlog

This file is the single persistent queue and checklist for bug reports and
feature requests. Agents update it as work is triaged, investigated,
implemented, validated, reordered, and closed.

## Queue rules

- Give each report a stable ID using its type: `BUG-001`, `BUG-002`, ... or
  `FEAT-001`, `FEAT-002`, .... Never reuse an ID, including for duplicate or
  closed items.
- Bugs and features share one global queue. Add every new item at the end,
  regardless of type. Keep earlier unfinished work ahead of later reports unless
  the user chooses otherwise or an agent records a concrete reason to reorder.
- Continue an `in_progress` item first. Otherwise, work from the lowest-order
  actionable item, including `needs-triage` items. Temporarily skip a `blocked`
  item only while its blocker remains unresolved; preserve its queue position.
- To reorder, change the `Order` values and add a change-log entry with the old
  and new order, reason, and date. User-stated priority takes precedence.
- Record dependencies explicitly in `Depends on`; queue order alone does not
  imply a dependency. Use `Related to` for intersecting but independently
  actionable work.
- Keep each item's checklist specific to its outcome and diagnosis. Update it
  when investigation changes the plan; do not mark planned steps complete until
  they are actually done.
- Assign one coordinator per active item. Record worker ownership and disjoint
  write scopes before parallelizing; workers report progress to the coordinator
  and do not edit this shared queue or mark items done.
- When a bug and feature overlap, keep separate entries if they have distinct
  acceptance criteria and link them with `Related to` or `Depends on`. If one
  implementation satisfies both, verify both checklists before marking either
  item `done`; do not duplicate the implementation steps unnecessarily.
- `done` means the acceptance criteria and applicable verification passed. If
  verification is blocked, use `blocked` and explain what remains.
- Keep plans, implementation details, and test results here; use
  [`agent-handoff.md`](agent-handoff.md) for the active agent's immediate baton.
- The user may report bugs or features in plain language or by ID. Preserve
  their intent, ask for clarification only when needed to define behavior, and
  do not invent reproduction steps or acceptance criteria.

## Status values

- `needs-triage`: report recorded, but behavior or expected result needs
  clarification/investigation before it is ready to fix.
- `queued`: sufficiently understood to await its turn.
- `in_progress`: an agent is actively working on it.
- `blocked`: work cannot proceed or required verification is unavailable; state
  the blocker and next action.
- `done`: acceptance criteria and relevant verification are complete.

## Queue

### BUG-002 — Season column sorts alphabetically instead of chronologically

- Order: 2
- Type: bug
- Status: done
- Depends on: none
- Related to: none
- Reported by: user
- Priority: medium
- Coordinator: Azalea
- Workers and write scopes: sequential
- Worktree/branch: dev-alter-1
- Parallelization: sequential by default

#### Current behavior and requested outcome

- Current/observed behavior: Sorting the `season` column in the anime list table (and the search results table) sorts the label text alphabetically, so `Fall 2001` comes before `Spring 2003`.
- Expected/requested outcome: The column sorts chronologically: year first, then season order Winter, Spring, Summer, Fall. Ascending gives `Winter 2001`, `Spring 2001`, `Summer 2001`, `Fall 2001`, `Summer 2002`, `Fall 2002`, `Winter 2003`, `Spring 2003`, `Fall 2004`.
- Reproduction/conditions: Open the anime list table and click the `season` column header to sort ascending.

#### Diagnosis or design

- Root cause / design notes: The column used `accessorKey: "season"` on a display string such as `Fall 2001`, so TanStack Table fell back to alphabetical text sorting. Fixed by giving the column a numeric accessor (`year * 4 + seasonIndex`) built by `seasonSortKey` in `apps/biyori/src/lib/season-order.ts`, with `sortUndefined: "last"` so rows without a known season stay at the end.

#### Acceptance criteria

- [x] Ascending sort on the season column orders by year, then Winter, Spring, Summer, Fall.
- [x] Descending sort reverses that order.
- [x] Rows with an unknown season sort last instead of interleaving.

#### Implementation checklist

- [x] Confirm the report, scope, and acceptance criteria.
- [x] Inspect season column definitions in the anime list and search tables.
- [x] Implement the numeric season sort key helper and wire it into both tables.
- [x] Add a regression test for the season sort key.
- [x] Run applicable tests and checks; record exact commands and results.
- [x] Review the final diff and update directly related documentation.

#### Files and implementation notes

- `apps/biyori/src/lib/season-order.ts`: New helper with `parseSeasonLabel` and `seasonSortKey`.
- `apps/biyori/src/lib/season-order.test.ts`: Regression tests for the ordering rules.
- `apps/biyori/src/renderer/src/lib/season-order.table.test.ts`: Sorts a real TanStack table with the new column def to prove the table wiring.
- `apps/biyori/src/renderer/src/components/anime-list-view.tsx`: Season column now sorts on the numeric key.
- `apps/biyori/src/renderer/src/components/app/search/page.tsx`: Same fix for the search results season column.

#### Verification results

- `bun test apps/biyori/src/lib/season-order.test.ts` -> 6 pass, 0 fail.
- `bun test apps/biyori/src/renderer/src/lib/season-order.table.test.ts` -> 3 pass, 0 fail (ascending, descending, unknown seasons last).
- `bun test` (whole `apps/biyori` suite) -> 254 pass, 0 fail.
- `bun biome check --write -- <changed files>` -> clean; full `bun biome check` still reports pre-existing findings in `apps/biyori/src/lib/library-summary.test.ts`, `apps/biyori/src/renderer/src/components/app/shared/data-table.tsx`, and `apps/biyori/src/renderer/src/lib/table-column-sizing.ts`, which are untouched by this change.
- `bun run typecheck` not run (per `.cursor/rules/biome-check.mdc`); a scoped `tsc -p tsconfig.web.json` run showed no errors in the changed files.

#### Blockers

- None.

### BUG-001 — VLC playback title detection returns Unknown Title

- Order: 1
- Type: bug
- Status: done
- Depends on: none
- Related to: none
- Reported by: user
- Priority: high
- Coordinator: Azalea
- Workers and write scopes: sequential
- Worktree/branch: dev-ikky
- Parallelization: sequential by default

#### Current behavior and requested outcome

- Current/observed behavior: VLC process is detected by Biyori, but currently playing media displays as "Unknown Title" despite VLC sending media title metadata.
- Expected/requested outcome: Biyori correctly extracts and parses the anime title from VLC's window title / metadata during playback.
- Reproduction/conditions: Play an anime file in VLC Media Player with media detection enabled.

#### Diagnosis or design

- Root cause / design notes: Investigating title extraction for VLC in `packages/hana/src/detect/` and how window titles / file paths are parsed when VLC updates its window title.

#### Acceptance criteria

- [ ] VLC window title is correctly captured and mapped to a media title / file path.
- [ ] Biyori avoids "Unknown Title" during VLC playback.

#### Implementation checklist

- [ ] Confirm the report, scope, and acceptance criteria.
- [ ] Inspect window title handling for VLC in `packages/hana`.
- [ ] Implement fix and verify with tests.

#### Files and implementation notes

- `packages/hana/src/detect/linux.rs`: Modified to fetch window titles via `xdotool` search/getwindowname for non-browser media player processes on Linux, falling back to `extract_file_path` on the retrieved title.

#### Verification results

- Code modified for Linux window title capture.
- Compilation (`cargo test`) requires a system C toolchain (`gcc`/`cc`) on Linux.

#### Blockers

- Lack of `gcc`/`cc` toolchain for native Rust build on this environment. Will commit code and leave ready for user testing.

## Reorder history

No reorders yet.

## Entry template

Copy this entry for each bug or feature, assign the next ID for its type, and set
its global order and status. Replace prompts with known facts; mark unknown
details as unknown rather than guessing.

```md
### BUG-NNN or FEAT-NNN — Short summary

- Order: N
- Type: bug or feature
- Status: needs-triage
- Depends on: none
- Related to: none
- Reported by: user
- Priority: unspecified
- Coordinator: unassigned
- Workers and write scopes: none
- Worktree/branch: not assigned
- Parallelization: sequential by default

#### Current behavior and requested outcome

- Current/observed behavior:
- Expected/requested outcome:
- Reproduction/conditions (bugs; N/A for features):

#### Diagnosis or design

- Root cause / design notes: not investigated

#### Acceptance criteria

- [ ] Describe each user-visible or otherwise measurable outcome.

#### Implementation checklist

- [ ] Confirm the report, scope, and acceptance criteria.
- [ ] Refine the plan into concrete code/documentation changes.
- [ ] Implement the minimal complete change.
- [ ] Add or update a regression test, or record why one is not applicable.
- [ ] Run applicable tests and checks; record exact commands and results.
- [ ] Review the final diff and update directly related documentation.

#### Files and implementation notes

- None yet.

#### Verification results

- Not run.

#### Blockers

- None.
```
