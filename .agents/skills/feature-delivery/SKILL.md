---
name: feature-delivery
description: >-
  Start-of-slice delivery workflow for Score Slate — grill thin tickets, feature
  preflight, plan, Spec check, then TDD handoff. Use when beginning non-trivial
  work, opening a ticket, or the user says /feature-delivery.
---

# Feature delivery (start of slice)

Orchestrate **plan → Spec → TDD**. End-of-slice is [`delivery-gate`](../delivery-gate/SKILL.md).

**Entry:** [`.agents/README.md`](../../README.md) · **Policy:** [`docs/guides/feature-preflight-and-done-gate.md`](../../../docs/guides/feature-preflight-and-done-gate.md)

## When to use

- New game mode, scoring rule, persistence/schema change, composable seam, or multi-file scoreboard/setup work (T2+)
- Vague / thin tickets (missing acceptance criteria) — even some T1
- User says `/feature-delivery` or “start delivery for …”

Skip for T0 typos/comments. For clear single-file T1, a short boundary note + implement is enough.

## Workflow

Copy and track:

```
Feature delivery:
- [ ] 0. Tier declared (T0–T3)
- [ ] 1. Grill if thin/vague (one question at a time)
- [ ] 2. User stories (incl. ≥1 negative) + non-goals
- [ ] 3. Feature preflight boundary contract
- [ ] 4. Plan file (header includes tier)
- [ ] 5. Spec check on plan (staff-code-review Spec axis only)
- [ ] 6. Critical/high on plan? revise — else hand off to /tdd
```

### 0. Tier

Pick from [`.agents/README.md`](../../README.md). Write it in the plan header. Default daily work is **T1–T2**, not T3.

### 1. Grill (thin tickets)

If acceptance criteria are missing or fuzzy, invoke [`grill-me`](../grill-me/SKILL.md):

- **One question at a time**; wait for the answer
- Explore the codebase for facts instead of asking when possible
- Stop when: user stories (incl. one negative), boundaries/non-goals, and “done looks like …” are testable

### 2. Stories

Capture briefly (plan or preflight):

- Happy path(s) for the player / host using Score Slate
- At least one **negative** (invalid score, blocked action, empty state)
- Explicit non-goals
- Product anchors in `docs/product/` when relevant

### 3. Preflight

Fill [`docs/guides/feature-preflight-and-done-gate.md`](../../../docs/guides/feature-preflight-and-done-gate.md) (Boundary Contract). Do not start coding if any architecture self-score is below **4** without revising the design.

Confirm store shape + persistence implications before building UI against them. Name reference files to mirror.

For cross-module work, orient with [`graphify`](../graphify/SKILL.md) before undirected search.

### 4. Plan

Write a short plan under `.cursor/plans/` (local / gitignored). Header must include **tier**. Prefer vertical Vitest-testable slices. Follow [`.cursor/rules/planning.mdc`](../../../.cursor/rules/planning.mdc) for plan shape and TDD task sizing.

### 5. Spec check (cheap, before code)

Run [`staff-code-review`](../staff-code-review/SKILL.md) **Spec axis only** against the plan/preflight (not a full Standards essay). Cap ~400 words.

Fix **critical / high** Spec gaps before coding. Medium → revise plan or accept and note.

[`improve-codebase-architecture`](../improve-codebase-architecture/SKILL.md) is **off this path** unless the user scheduled a refactor session.

### 6. Hand off to TDD

Invoke [`tdd`](../tdd/SKILL.md) at agreed seams. Confirm seams with the user before the first test when unclear. Refactoring for depth belongs in review, not in the RED/GREEN loop.

When slices are implemented, run [`delivery-gate`](../delivery-gate/SKILL.md).

## Done (this skill)

- Tier + stories + preflight (when required) exist
- Spec check on plan completed for T2+
- Implementation handed to TDD — not claimed “done” here

## Related

- [`delivery-gate`](../delivery-gate/SKILL.md) — end of slice
- [`done-gate`](../done-gate/SKILL.md) — merge / ship sweep
- [`docs/infrastructure/seams-checklist.md`](../../../docs/infrastructure/seams-checklist.md)
