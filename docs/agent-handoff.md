# Agent handoff

This is the shared baton for work that is continuing in another agent, model, or
session. The active task's agent updates it before handing off; the next agent
verifies it against the worktree before proceeding.

Use `idle` when no work is being handed off, `active` when another agent must
continue unfinished work, and `complete` when the task is finished.

**Status:** active

When handing off, replace the idle state with the following information:

## Task and acceptance criteria

- Task: BUG-001 VLC playback title detection returns Unknown Title.
- Criteria: VLC window title is captured and parsed correctly without showing "Unknown Title".

## Backlog item

- BUG-001

## Coordinator and parallel workers

- Coordinator: Azalea
- Workers and owned paths: None
- Worktree/branch: dev-ikky
- Integration status: In progress

## Progress

- Completed: Modified `packages/hana/src/detect/linux.rs` to fetch window title using `xdotool` on Linux and fallback to title parsing for VLC playback.
- Remaining: Commit changes to `dev-ikky` and push.

## Changed files

- packages/hana/src/detect/linux.rs
- docs/work-backlog.md
- docs/agent-handoff.md

## Decisions and constraints

- Follow AGENTS.md guidelines.

## Validation

- Native build blocked due to missing `cc` linker on host environment. Code is ready to be compiled on user's Kubuntu system.

## Blockers

- Lack of `gcc` on backend server prevents local `cargo build` for AppImage.

## Git and worktree state

- Branch: dev-ikky
- Untracked/Modified: `packages/hana/src/detect/linux.rs`, `docs/work-backlog.md`, `docs/agent-handoff.md`.

## Next actions

- Commit the modified files using Conventional Commits and push to `origin/dev-ikky`.
