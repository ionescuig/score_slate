# Agents — start here

Single entry for AI assistants (Cursor, Claude Code, Codex, etc.). This file routes; it does not duplicate contracts.

**Quality gates:** [`docs/infrastructure/quality-gates.md`](../docs/infrastructure/quality-gates.md). Product: [`docs/product/`](../docs/product/). Tech docs: [`docs/README.md`](../docs/README.md).

## Stack & baseline

- Stack: Nuxt 4, Vue 3 (Composition API), TypeScript, Pinia, Tailwind, Vitest
- App root: `app/` — run npm commands from **repo root**
- Cursor always-on: [`.cursor/rules/core.mdc`](../.cursor/rules/core.mdc), [`execution.mdc`](../.cursor/rules/execution.mdc), [`graphify.mdc`](../.cursor/rules/graphify.mdc), [`caveman.mdc`](../.cursor/rules/caveman.mdc)

## What to do (by tier)

Declare the tier in the plan/preflight header. **Do not apply T3 gates to T1 work.**

| Tier   | Examples                                              | Preflight                                                                   | Post review                                       | Mechanical                             |
| ------ | ----------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| **T0** | Typo, comment                                         | Skip                                                                        | Skip                                              | Lint on touch                          |
| **T1** | Single-file behaviour                                 | Boundary note                                                               | `staff-code-review` once (Standards only, capped) | Scoped Vitest                          |
| **T2** | New composable, store action, scoring helper, PDF map | Full [Boundary Contract](../docs/guides/feature-preflight-and-done-gate.md) | Spec + Standards (one capped review)              | `test` + `lint` (+ typecheck if types) |
| **T3** | New game mode, persistence schema, cross-feature flow | Preflight + plan Spec review + Graphify                                     | Full two-axis review                              | Full suite + seams                     |

## Delivery path

1. **Thin / vague ticket (T2+ or unclear T1)** → [`grill-me`](skills/grill-me/SKILL.md) until stories + boundaries are testable
2. **Non-trivial** → [`feature-delivery`](skills/feature-delivery/SKILL.md) (preflight → plan → Spec check → TDD)
3. **Implement** → [`tdd`](skills/tdd/SKILL.md)
4. **Done** → [`delivery-gate`](skills/delivery-gate/SKILL.md) (mechanical gates + **one** capped review)

**Severity:** fix **critical / high** before handoff. **Medium** → fix now, ticket, or accept in handoff — not a merge-block loop.

**Commits:** agent delivers; human commits unless explicitly asked.

**`gh` auth:** before PR/merge/`gh` API here, active account must be **ionescuig** (`gh auth switch -u ionescuig` if needed). Work account **gabriel-klarian** is for Klarian repos only — see `.cursor/rules/execution.mdc`.

**No CI trust shortcut:** report **real local exit codes** from quality-gate commands before claiming done.

**Merge / ship sweep:** when the user asks `/done-gate` or needs Graphify refresh + UI industrial pass, use [`done-gate`](skills/done-gate/SKILL.md).

## Skills

### Delivery (default path)

| Skill                                                    | When to invoke                                                  |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| [`feature-delivery`](skills/feature-delivery/SKILL.md)   | Start of non-trivial slice                                      |
| [`delivery-gate`](skills/delivery-gate/SKILL.md)         | End of slice / before handoff                                   |
| [`tdd`](skills/tdd/SKILL.md)                             | Test-first vertical slices                                      |
| [`grill-me`](skills/grill-me/SKILL.md)                   | Ambiguous / thin requirements                                   |
| [`staff-code-review`](skills/staff-code-review/SKILL.md) | Capped Spec + Standards review (via delivery-gate or on demand) |
| [`graphify`](skills/graphify/SKILL.md)                   | Orient before wide search; refresh after architecture edits     |
| [`done-gate`](skills/done-gate/SKILL.md)                 | Explicit merge/ship gate (structure + UI review + Graphify)     |
| [`caveman`](skills/caveman/SKILL.md)                     | **Default** terse chat replies; artifacts stay normal           |

### Invoked-only (not default delivery)

| Skill                                                                            | When                                                                                                             |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [`ui-industrial-reviewer`](skills/ui-industrial-reviewer/SKILL.md)               | Scoreboard/setup UI polish (also pulled by done-gate when UI touched)                                            |
| Design / Impeccable pack                                                         | Via [`.cursor/rules/design-skills.mdc`](../.cursor/rules/design-skills.mdc) — only when user asks or design task |
| [`improve-codebase-architecture`](skills/improve-codebase-architecture/SKILL.md) | **Refactor sessions only** — off the delivery path                                                               |
| [`staff-code-planner`](skills/staff-code-planner/SKILL.md)                       | Turn findings into a staged improvement plan                                                                     |
| [`review-to-plan`](skills/review-to-plan/SKILL.md)                               | Convert review output into an executable fix plan                                                                |
| [`ubiquitous-language`](skills/ubiquitous-language/SKILL.md)                     | Domain glossary                                                                                                  |

## Policy (read, don’t duplicate here)

| Topic             | Canonical doc                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| Quality gates     | [`docs/infrastructure/quality-gates.md`](../docs/infrastructure/quality-gates.md)                     |
| Feature preflight | [`docs/guides/feature-preflight-and-done-gate.md`](../docs/guides/feature-preflight-and-done-gate.md) |
| Seams checklist   | [`docs/infrastructure/seams-checklist.md`](../docs/infrastructure/seams-checklist.md)                 |
| Chat style        | [`docs/infrastructure/caveman.md`](../docs/infrastructure/caveman.md)                                 |
| Testing           | [`docs/infrastructure/testing.md`](../docs/infrastructure/testing.md)                                 |
| Architecture      | [`docs/architecture/overview.md`](../docs/architecture/overview.md)                                   |
| Product / PRD     | [`docs/product/`](../docs/product/)                                                                    |

## Verification commands (local)

From repo root:

| Intent             | Command                                      |
| ------------------ | -------------------------------------------- |
| Unit / seam tests  | `npm run test`                               |
| Scoped test        | `npm run test -- tests/path/to/file.test.ts` |
| Lint               | `npm run lint`                               |
| Typecheck          | `npx nuxi typecheck`                         |
| Full handoff (T2+) | `npm run test && npm run lint`               |

Report **exact command + exit code**. Do not claim green without running.

## Graphify

Orient with `graphify-out/` before undirected search. Policy: [`.cursor/rules/graphify.mdc`](../.cursor/rules/graphify.mdc) · skill: [`graphify`](skills/graphify/SKILL.md) · REFERENCE: [`skills/graphify/REFERENCE.md`](skills/graphify/REFERENCE.md).

| Phase                                  | Action                                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Start** (non-trivial / cross-module) | Stale/missing → `graphify update .` → `GRAPH_REPORT.md` → `graphify query` / `path` before undirected search |
| **During**                             | Re-query when tracing a new seam                                                                             |
| **End** (`/delivery-gate`)             | `graphify update .` when architecture-relevant                                                               |
| **End** (`/done-gate`)                 | `graphify update .` always (when on PATH)                                                                    |

```bash
graphify update .
graphify query "…"
graphify path "A" "B"
graphify benchmark graphify-out/graph.json
```

Skip Graphify for single-file, known-symbol fixes. If `graphify` is not on PATH, note it and use search/reads.

Recovery: `rm -f graphify-out/graph.json && graphify update .`

## Caveman (default)

Terse **chat** replies by default (intensity **full**). Does not change code/docs/PR prose. Opt out: `stop caveman` / `normal mode`. Policy: [`docs/infrastructure/caveman.md`](../docs/infrastructure/caveman.md) · skill: [`caveman`](skills/caveman/SKILL.md). Pairs with Graphify (input vs output tokens).

## Cursor rules

`.cursor/rules/` — tiny always-on invariants + requestable patterns. Workflows live in **skills**, not fat rules.

| Rule                    | Purpose                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `core`                  | Invariants, non-trivial feature start, reference map (always apply) |
| `execution`             | Verification + pointers to delivery-gate (always apply)             |
| `graphify`              | Knowledge graph before wide search (always apply)                   |
| `caveman`               | Default terse chat style; artifacts normal (always apply)           |
| `planning`              | Pointer to `feature-delivery` + TDD                                 |
| `ssr-patterns`          | Client/SSR guards                                                   |
| `state-and-persistence` | Pinia + localStorage                                                |
| `branch-policy`         | Branch review structure                                             |
| `debugging`             | Root-cause phases                                                   |
| `design-skills`         | Impeccable skill routing                                            |
| `rules-authoring`       | When editing `.mdc` rules                                           |
