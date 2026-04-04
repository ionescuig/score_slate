import type { GameType } from './game-types'

export function rummyLimitReached(
  totalsByPlayerId: Record<string, number>,
  limit: number | null | undefined,
): boolean {
  if (limit == null || Number.isNaN(limit)) {
    return false
  }
  return Object.values(totalsByPlayerId).some((t) => t >= limit)
}

/**
 * Returns player ids tied for the win (all co-winners). Empty if no players.
 */
export function winnerPlayerIds(
  gameType: GameType,
  totalsByPlayerId: Record<string, number>,
): string[] {
  const entries = Object.entries(totalsByPlayerId)
  if (entries.length === 0) {
    return []
  }
  if (gameType === 'mexican-train') {
    const min = Math.min(...entries.map(([, v]) => v))
    return entries.filter(([, v]) => v === min).map(([id]) => id)
  }
  const max = Math.max(...entries.map(([, v]) => v))
  return entries.filter(([, v]) => v === max).map(([id]) => id)
}

/**
 * Leaders on the live scoreboard only after round 1 is done (round index ≥ 1),
 * or when the game is finished (so single-round games still show a winner at the end).
 * Before that, everyone is often tied at 0 — no meaningful leader yet.
 */
export function leaderPlayerIdsForScoreboard(
  gameType: GameType,
  totalsByPlayerId: Record<string, number>,
  phase: 'idle' | 'playing' | 'finished',
  currentRoundIndex: number,
): string[] {
  if (phase === 'playing' && currentRoundIndex < 1) {
    return []
  }
  return winnerPlayerIds(gameType, totalsByPlayerId)
}
