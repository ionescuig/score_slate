import type { GameType } from '~/utils/game/game-types'

/** Row label for score grid / PDF (shared presentation; not PDF-specific). */
export function rowLabelForScoreSheet(
  gameType: GameType,
  rowLabels: number[],
  i: number,
): string {
  const v = rowLabels[i]
  if (v === undefined) {
    return ''
  }
  if (gameType === 'rummy') {
    return `Round ${v}`
  }
  return String(v)
}

export function scoreCellDisplayString(
  scores: Record<number, Record<string, number>>,
  roundIdx: number,
  playerId: string,
): string {
  const v = scores[roundIdx]?.[playerId]
  if (v === undefined || v === null) {
    return ''
  }
  return String(v)
}
