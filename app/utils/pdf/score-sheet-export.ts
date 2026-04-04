import { GAME_TYPE_DISPLAY_TITLE, type GameType } from '~/utils/game/game-types'
import {
  rowLabelForScoreSheet,
  scoreCellDisplayString,
} from '~/utils/game/score-display'
import type { BuildScoreSlatePdfOptions } from '~/utils/pdf/score-slate-pdf'

export interface ScoreSheetPdfSnapshot {
  gameType: GameType
  playerIds: string[]
  playerNames: Record<string, string>
  rowLabels: number[]
  scores: Record<number, Record<string, number>>
  runningTotals: Record<string, number>
}

export { rowLabelForScoreSheet, scoreCellDisplayString }

/** Pure mapping from session snapshot → PDF options (shared with UI table labels). */
export function buildScoreSlatePdfOptions(
  input: ScoreSheetPdfSnapshot,
): BuildScoreSlatePdfOptions {
  const names = input.playerIds.map((id) => input.playerNames[id] ?? id)
  const rows = input.rowLabels.map((_, ri) => ({
    label: rowLabelForScoreSheet(input.gameType, input.rowLabels, ri),
    cells: input.playerIds.map((pid) =>
      scoreCellDisplayString(input.scores, ri, pid),
    ),
  }))
  const totals = input.playerIds.map((pid) =>
    String(input.runningTotals[pid] ?? 0),
  )
  return {
    title: 'Score Slate',
    subtitle: GAME_TYPE_DISPLAY_TITLE[input.gameType],
    gameType: input.gameType,
    headerCornerLabel: 'Round',
    playerNames: names,
    rows,
    totalsRow: totals,
  }
}
