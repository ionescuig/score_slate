# Testing

## Direction

- **Vitest** for unit and component tests; **Playwright** later for critical flows if needed.
- **Highest value:** pure **domain** functions (scoring, win conditions, limits) — fast, no DOM.
- **Next:** Pinia stores with focused tests (actions, getters) using test utils as the app stabilizes.
- **Components:** test when they encode non-trivial behaviour or validation; skip trivial layout-only SFCs unless regressions appear.

## Layout

```
tests/
  unit/
    domain/       # dealer, mexican-train, whist, winners
    game/         # pure helpers: persist shape, round visibility, running totals,
                  # scoreboard row rules, grid view-model build, rummy setup, etc.
    pdf/          # PDF export payload (pure mapping)
    stores/       # Pinia player + game
```

## Related

- `.cursor/rules/execution.mdc`
- `.agents/skills/tdd/SKILL.md`
