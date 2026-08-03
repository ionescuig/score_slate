---
name: delivery-gate
description: >-
  End-of-slice done gate for Score Slate — local mechanical checks, seams
  self-check, one capped Spec+Standards review; block on critical/high only;
  invariant findings require tests. Use when finishing a slice, before handoff,
  or user says /delivery-gate. For merge/ship sweeps with Graphify + UI review,
  prefer done-gate.
---

# Delivery gate (end of slice)

Single invokable handoff workflow. One capped review + mechanical confirmation — no multi-pass LLM remediate loops.

**Entry:** [`.agents/README.md`](../../README.md) · **Commands:** [`docs/infrastructure/quality-gates.md`](../../../docs/infrastructure/quality-gates.md)

## Trigger phrases

- `/delivery-gate`
- “run done gate” / “handoff gate” (when not asking for the heavy merge sweep)
- Before claiming a non-trivial slice complete

For `/done-gate` / “merge-ready” / “ship pass”, use [`done-gate`](../done-gate/SKILL.md).

## Workflow

```
Delivery gate:
- [ ] 1. Tier check (skip full review for T0; light for T1)
- [ ] 2. Mechanical: test + lint (+ typecheck when types touched)
- [ ] 3. Seams checklist self-check
- [ ] 4. One capped staff-code-review (Spec + Standards per tier)
- [ ] 5. Fix critical/high only; medium → fix | ticket | accept
- [ ] 6. invariant-tagged findings → add/update test before handoff
- [ ] 7. Re-run mechanical only (no second LLM confirmation pass)
- [ ] 8. `graphify update .` if architecture-relevant
- [ ] 9. Handoff report with exit codes
```

### 1. Tier

Respect the tier declared in the plan ([`.agents/README.md`](../../README.md)):

| Tier  | Review                                                 |
| ----- | ------------------------------------------------------ |
| T0    | Mechanical only                                        |
| T1    | Standards only, capped (~400 words)                    |
| T2–T3 | Spec + Standards, one pass each axis (~400 words each) |

Improve-architecture / Impeccable sweeps are **off this path** unless the user scheduled them.

### 2. Mechanical (required)

```bash
npm run test && npm run lint
```

When types / Vue SFCs / `nuxt.config` changed, also:

```bash
npx nuxi typecheck
```

For scoped T1, prefer:

```bash
npm run test -- <scoped-path> && npm run lint
```

Report **exact command, exit code, and scope**. Do not claim green without running.

Also run `read_lints` on every file you changed and fix diagnostics in those files.

### 3. Seams

Self-check [`docs/infrastructure/seams-checklist.md`](../../../docs/infrastructure/seams-checklist.md) for changed boundaries (scoring utils, stores, persistence, scoreboard UI).

### 4. One capped review

Follow [`staff-code-review`](../staff-code-review/SKILL.md) in **delivery mode**:

- Diff: committed + staged + unstaged changes for the slice
- Parallel axes: **Spec** (stories/preflight) and **Standards** (docs + seams) — do not merge findings across axes
- Word cap ~400 per axis
- Tag every finding: `invariant` | `design-debt` | `one-off`

### 5. Severity policy

| Severity            | Action                                                             |
| ------------------- | ------------------------------------------------------------------ |
| **critical / high** | Must fix before handoff                                            |
| **medium**          | Fix now, open a ticket, or **accept** in the handoff (state which) |
| **low**             | Note for follow-up                                                 |

Do **not** loop until zero medium. Do **not** run a second full LLM “confirmation” review — re-run mechanical gates after fixes.

If the same critical/high survives **three** fix iterations, stop and report the blocker.

### 6. Learn: invariant → test

For each **critical / high** (and repeating mediums) tagged `invariant`:

- Add or extend a regression test under `tests/unit/`, **or**
- Open an explicit follow-up task before claiming done

Prefer Vitest through public `utils/` / store interfaces.

### 7. Mechanical confirmation

After code fixes: re-run the same `npm run test` / `lint` (and typecheck if used) commands only.

### 8. Graphify

If composables, stores, scoring rules, persistence, or cross-feature imports changed:

```bash
graphify update .
```

Skip if `graphify` is not on PATH — note it in the handoff. [`done-gate`](../done-gate/SKILL.md) always refreshes when Graphify is available.

### 9. Handoff report

Include:

- Tier
- Commands run + **exit codes**
- Review: critical/high count (should be 0); mediums fixed / ticketed / accepted
- New/updated tests for `invariant` tags (or follow-up links)
- Low findings (optional)

**Do not commit** unless the user explicitly asked.

## Related

- [`feature-delivery`](../feature-delivery/SKILL.md) — start of slice
- [`done-gate`](../done-gate/SKILL.md) — merge/ship sweep
- [`docs/infrastructure/testing.md`](../../../docs/infrastructure/testing.md)
