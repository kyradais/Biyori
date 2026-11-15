# Agent handoff

This is the shared baton for work that is continuing in another agent, model, or
session. The active task's agent updates it before handing off; the next agent
verifies it against the worktree before proceeding.

Use `idle` when no work is being handed off, `active` when another agent must
continue unfinished work, and `complete` when the task is finished.

**Status:** idle

When handing off, replace the idle state with the following information:

## Task and acceptance criteria

<!-- State the requested outcome and how to verify it. -->

## Backlog item

<!-- Use BUG-NNN or FEAT-NNN when this handoff belongs to backlog work; otherwise write "none". -->

## Coordinator and parallel workers

- Coordinator:
- Workers and owned paths:
- Worktree/branch per worker:
- Integration status:

## Progress

- Completed:
- Remaining:

## Changed files

<!-- List paths and summarize why they changed. -->

## Decisions and constraints

<!-- Include relevant user preferences and choices; do not include secrets. -->

## Validation

<!-- Record exact commands and pass/fail results, including checks not run. -->

## Blockers

<!-- State none, or describe the specific blocker and what is needed. -->

## Git and worktree state

<!-- Record relevant staged/unstaged changes and commit identifiers, if any. -->

## Next actions

<!-- Give ordered, concrete steps. Avoid “continue” or “finish the work”. -->
