---
name: done-gate
description: >-
  Score Slate merge/ship done gate — delivery-gate plus file structure sweep, UI
  industrial review when UI touched, Graphify refresh; block on critical/high
  only. Use when the user says /done-gate, or wants a merge-ready pass. For
  routine slice handoff, prefer delivery-gate.
---

# Done gate (merge / ship sweep)

Heavier end-of-slice workflow for **merge or ship-ready** passes. Builds on [`delivery-gate`](../delivery-gate/SKILL.md) severity and mechanical gates; adds file-structure review, optional UI industrial review, and mandatory Graphify refresh when available.

Pair with **preflight:** [`docs/guides/feature-preflight-and-done-gate.md`](../../../docs/guides/feature-preflight-and-done-gate.md). Default handoff without the heavy sweep: [`delivery-gate`](../delivery-gate/SKILL.md).

## Trigger phrases

- `/done-gate`
- “run the done gate” / “done gate before merge”
- “review with all skills required and address findings, repeat if required”

## Severity (aligned with delivery-gate)

| Severity            | Action                                                      |
| ------------------- | ----------------------------------------------------------- |
| **critical / high** | Must fix before handoff                                     |
| **medium**          | Fix now, ticket, or **accept** in the handoff (state which) |
| **low**             | Optional follow-up                                          |

Do **not** loop until zero medium. Do **not** require a second full LLM confirmation pass — re-run mechanical gates after fixes. `invariant` critical/high → add/update a Vitest test.

Improve-architecture is **off this path** unless the user scheduled a refactor session.

## Workflow

```
Done gate:
- [ ] 1. Scope — identify changed files / feature slice
- [ ] 2. File structure review
- [ ] 3. Delivery-mode staff-code-review (Spec + Standards, capped)
- [ ] 4. UI industrial review (if UI touched)
- [ ] 5. Seams checklist
- [ ] 6. Fix critical/high; medium → fix | ticket | accept
- [ ] 7. invariant → test
- [ ] 8. Verification gate (mechanical only after fixes)
- [ ] 9. Graphify — `graphify update .`
- [ ] 10. Report with evidence (exit codes)
```

### 1. Scope

- `git diff` / recent edits under `app/`, `tests/`, `docs/`
- For cross-module orientation: `graphify query` if graph exists; refresh in step 9

### 2. File structure review

Confirm new/changed code lives in the right layer. Read:

- [`docs/architecture/overview.md`](../../../docs/architecture/overview.md)
- [`docs/infrastructure/seams-checklist.md`](../../../docs/infrastructure/seams-checklist.md)

Use the seams table (pages / components / composables / stores / utils / plugins / tests). Classify structure issues with severity tags. Fix **critical/high** from this slice; medium → fix / ticket / accept.

### 3. Staff code review

Follow [staff-code-review](../staff-code-review/SKILL.md) in **delivery mode** (Spec + Standards, ~400 words each, tagged findings).

### 4. UI industrial review

If any Vue pages, components, layouts, or scoreboard/setup visuals changed:

Read and follow [ui-industrial-reviewer](../ui-industrial-reviewer/SKILL.md).

### 5. Seams checklist

Read [`docs/infrastructure/seams-checklist.md`](../../../docs/infrastructure/seams-checklist.md).

### 6–7. Fix + learn

- Fix all **critical / high**
- Medium: fix, ticket, or accept (state which in the report)
- `invariant` tags → regression test under `tests/unit/`

### 8. Verification gate (required)

```bash
npm run test && npm run lint
```

When types / Vue / Nuxt config changed: `npx nuxi typecheck` (run `npx nuxt prepare` first if types fail).

- `read_lints` on changed files
- Browser MCP spot-check if UI changed (setup + play scoreboard; landscape if touched); prefer already-running `http://localhost:3000`

### 9. Graphify refresh (required when available)

```bash
graphify update .
```

Follow [graphify](../graphify/SKILL.md) · [REFERENCE](../graphify/REFERENCE.md). If `graphify` not on PATH, note skip in the report.

### 10. Report

1. What was reviewed
2. File structure findings (fixed / ticketed / accepted)
3. Other findings (critical/high fixed; medium disposition)
4. New/updated invariant tests
5. Verification evidence (**exit codes**)
6. UI review headline (if applicable)
7. Graphify refresh evidence

**Do not commit** unless explicitly asked.

## Related

- [`delivery-gate`](../delivery-gate/SKILL.md) — routine handoff
- [`docs/guides/feature-preflight-and-done-gate.md`](../../../docs/guides/feature-preflight-and-done-gate.md)
- [`.agents/README.md`](../../README.md)
