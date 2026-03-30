# Testing

## Direction

- **Vitest** for unit and component tests; **Playwright** later for critical flows if needed.
- **Highest value:** pure **domain** functions (scoring, win conditions, limits) — fast, no DOM.
- **Next:** Pinia stores with focused tests (actions, getters) using test utils as the app stabilizes.
- **Components:** test when they encode non-trivial behaviour or validation; skip trivial layout-only SFCs unless regressions appear.

## Layout (target)

Mirror source under `tests/` (exact paths TBD once `app/` / `components/` exist), e.g.:

```
tests/
  unit/
    domain/           # rummy, whist, mexican-train scoring helpers
    stores/           # optional store tests
  components/         # as needed
```

## Related

- `.cursor/rules/execution.mdc`
- `.agents/skills/tdd/SKILL.md`
