# Quality gates

Local verification commands for agents and humans. **Report exact command + exit code.** Do not claim green without running.

**Agent entry:** [`.agents/README.md`](../../.agents/README.md) · **End of slice:** [`delivery-gate`](../../.agents/skills/delivery-gate/SKILL.md) · **Merge sweep:** [`done-gate`](../../.agents/skills/done-gate/SKILL.md)

Commands run from **repo root**.

## Commands

| Intent                  | Command                                      | When                                        |
| ----------------------- | -------------------------------------------- | ------------------------------------------- |
| Full handoff (T2+)      | `npm run test && npm run lint`               | Before claiming non-trivial slice done      |
| Scoped unit/seam test   | `npm run test -- tests/path/to/file.test.ts` | Behaviour change in that area               |
| Lint                    | `npm run lint`                               | Every non-trivial handoff; after fixes      |
| Typecheck (optional)    | `npx nuxi typecheck`                         | When types / Vue SFCs / nuxt config touched |
| Edited-file diagnostics | `read_lints` on changed files                | After every edit batch (Cursor)             |

After Vue/Nuxt type failures, run `npx nuxt prepare` then retry typecheck.

## Severity (delivery)

| Severity            | Action                                                             |
| ------------------- | ------------------------------------------------------------------ |
| **critical / high** | Must fix before handoff                                            |
| **medium**          | Fix now, ticket, or **accept** in handoff — not a merge-block loop |
| **low**             | Optional follow-up                                                 |

## Learn from findings

Findings tagged `invariant` (especially critical/high) → **add or update a Vitest test** in the same session, or open an explicit follow-up before handoff. Prefer tests under `tests/unit/` through public `utils/` / store interfaces.

## First-pass quality (build to the rubric)

- Boundary Contract before coding for non-trivial work: public inputs/outputs, where business rules live (and must not), explicit non-goals.
- Scoring / win rules in pure `app/utils/game/` — not duplicated in pages or SFCs.
- One deep module with a small interface over multiple shallow pass-through helpers.
- Expected staff-review below 4/5 in any category → revise design before implementing.

## Pre-merge self-review gate

Before calling work done (or via delivery-gate), fix failures on:

1. **Boundaries:** pages thin; domain rules not inlined in templates.
2. **Coupling:** store ↔ persistence ↔ UI contracts explicit.
3. **Complexity:** no avoidable indirection; abstractions remove cognitive load.
4. **Data flow:** no repeated reshape chains for the same scoreboard/PDF payload.
5. **Local-first:** no accidental remote/API assumptions in scoring core.
6. **Testability/depth:** behavior concentrated in deep modules, tested through public interfaces.

Also: [`seams-checklist.md`](./seams-checklist.md).

## Review-to-execution closure

When architectural findings exist:

1. Convert each **critical / high** into a concrete fix item (medium → fix now, ticket, or accept).
2. Apply the smallest fix that resolves root cause at the seam — not the symptom.
3. `invariant` tags → add/adjust tests exercising the boundary behavior.
4. Verify (`read_lints`, relevant tests, lint) — report exit codes.
5. Re-check neighboring modules for ripple effects.

No second full LLM confirmation review after fixes — re-run mechanical gates only.

## Debugging

Detail lives in [`.cursor/rules/debugging.mdc`](../../.cursor/rules/debugging.mdc). Short form: root cause → pattern → one hypothesis → single fix. No symptom-only patches.

## Related

- [`testing.md`](./testing.md) — what to test and file layout
- [`seams-checklist.md`](./seams-checklist.md) — pre-merge self-check
- Always-on pointer: `.cursor/rules/execution.mdc`
