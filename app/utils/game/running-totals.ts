/**
 * Pure helpers for sums over `scores[round][playerId]` (same shape as the game store).
 */

export function totalBeforeRound(
  scores: Record<number, Record<string, number>>,
  roundIdx: number,
  playerId: string,
): number {
  let t = 0;
  for (let r = 0; r < roundIdx; r += 1) {
    t += scores[r]?.[playerId] ?? 0;
  }
  return t;
}

export function totalThroughRoundInclusive(
  scores: Record<number, Record<string, number>>,
  roundIdx: number,
  playerId: string,
): number {
  let t = 0;
  for (let r = 0; r <= roundIdx; r += 1) {
    t += scores[r]?.[playerId] ?? 0;
  }
  return t;
}
