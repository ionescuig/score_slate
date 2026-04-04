/**
 * Coerce persisted score maps (e.g. from localStorage JSON) to a safe shape:
 * numeric round keys, only known player ids, numeric cell values.
 */
export function normalizePersistedScores(
  raw: unknown,
  playerIds: string[],
): Record<number, Record<string, number>> {
  if (!raw || typeof raw !== 'object' || playerIds.length === 0) {
    return {}
  }
  const allowed = new Set(playerIds)
  const out: Record<number, Record<string, number>> = {}
  for (const [rk, row] of Object.entries(raw as Record<string, unknown>)) {
    const ri = Number(rk)
    if (!Number.isFinite(ri) || ri < 0) {
      continue
    }
    if (!row || typeof row !== 'object') {
      continue
    }
    const inner: Record<string, number> = {}
    for (const [pid, val] of Object.entries(row as Record<string, unknown>)) {
      if (!allowed.has(pid)) {
        continue
      }
      const n = typeof val === 'number' ? val : Number(val)
      if (!Number.isNaN(n)) {
        inner[pid] = n
      }
    }
    out[ri] = inner
  }
  return out
}
