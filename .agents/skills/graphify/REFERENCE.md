# Graphify reference (this repository)

Policy for using the project knowledge graph in `graphify-out/`. Applies to **any editor or AI assistant**.

**Invocation contract:** [SKILL.md](./SKILL.md) (`/graphify` and fallback pipeline). **Index:** [.agents/README.md](../../README.md).

## Why Graphify (token cost)

Wide codebase exploration is expensive. Graphify front-loads structure into `graphify-out/` so agents can:

1. **Orient** in one read (`GRAPH_REPORT.md` — check freshness vs your edits)
2. **Trace** cross-module flows with `graphify query` / `graphify path`
3. **Target** only the 2–5 files that matter, then read implementations

**Default:** Graphify first for architecture and cross-module work; direct reads for a known file/symbol.

## When to use Graphify (read/query)

| Situation                                                                              | Required approach                                                                           |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Non-trivial feature (new game mode, composable seam, persistence, multi-file refactor) | Read `GRAPH_REPORT.md`, then **≥1** `graphify query` or `graphify path` before broad search |
| Cross-module flow (scoreboard → store → localStorage)                                  | Query/path **first**; confirm in source                                                     |
| Architecture or staff review spanning many files                                       | Orient from graph                                                                           |
| Single file, known symbol                                                              | Read code directly                                                                          |
| `graphify` not on PATH                                                                 | Skip; use search and reads                                                                  |

## Agent workflow

### At task start

1. If `graphify-out/graph.json` is missing or stale vs architecture edits → `graphify update .`.
2. Skim `graphify-out/GRAPH_REPORT.md` (communities, god nodes). Prefer wiki index if present. **Do not** read `graph.json` raw.
3. Run targeted queries, e.g.:
   ```bash
   graphify query "How does score persistence reach localStorage?"
   graphify path "useGameSession" "localStorage"
   ```
4. Open only files the graph highlights.

### During implementation

- After adding or moving imports between layers, run one `graphify query` before duplicating patterns.

### Before claiming done

Run `graphify update .` once if you changed architecture-relevant code (`/delivery-gate` when relevant; `/done-gate` always when Graphify is available).

## Maintaining the graph

| When                                                                                           | Action                                               |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `graphify-out/graph.json` missing                                                              | `graphify update .` immediately                      |
| Stale vs architecture edits                                                                    | `graphify update .` before PR / task complete        |
| **`/done-gate`**                                                                               | Always `graphify update .` (when on PATH)            |
| **`/delivery-gate`** (architecture-relevant)                                                   | `graphify update .`                                  |
| **Any** of: composables, Pinia stores, scoring rules, persistence layer, cross-feature imports | **Update**                                           |
| Docs-only, copy, trivial CSS                                                                   | **Skip** (unless `/done-gate`)                       |
| Overwrite refused                                                                              | `rm -f graphify-out/graph.json && graphify update .` |

`graphify-out/` is gitignored.

**Exclusions:** `.graphifyignore` at repo root (committed; keep `graphify-out/` gitignored).

## CLI reference

```bash
graphify update .
graphify query "<question>"
graphify path "ConceptA" "ConceptB"
graphify watch .
graphify benchmark graphify-out/graph.json
```

## Resolution order (`/graphify` runs)

1. Global Graphify skill (if installed).
2. Local [SKILL.md](./SKILL.md) fallback.
3. Same output paths and report shape in all cases.
