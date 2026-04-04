import type { GameType } from '~/utils/game/game-types'

/** At least one player has a value recorded for this round (undefined = not entered yet). */
export function roundHasRecordedScore(
  scores: Record<number, Record<string, number>>,
  roundIndex: number,
  playerIds: string[],
): boolean {
  const row = scores[roundIndex]
  if (!row) {
    return false
  }
  return playerIds.some((pid) => row[pid] !== undefined)
}

export interface VisibleRoundsParams {
  gameType: GameType | null
  phase: 'idle' | 'playing' | 'finished'
  /** Rummy: false = unlimited rounds until Finish. */
  rummyHasRoundLimit: boolean
  rowLabelsLength: number
  scores: Record<number, Record<string, number>>
  playerIds: string[]
}

/**
 * Row indices to show in the score grid / PDF.
 * Rummy unlimited + finished: omit rounds with no scores (e.g. advanced to next row but never played).
 */
export function visibleRoundIndices(params: VisibleRoundsParams): number[] {
  const indices = Array.from({ length: params.rowLabelsLength }, (_, i) => i)
  if (
    params.phase !== 'finished' ||
    params.gameType !== 'rummy' ||
    params.rummyHasRoundLimit
  ) {
    return indices
  }
  return indices.filter((ri) =>
    roundHasRecordedScore(params.scores, ri, params.playerIds),
  )
}
