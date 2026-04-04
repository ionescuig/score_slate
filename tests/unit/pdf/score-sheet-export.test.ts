import { describe, it, expect } from 'vitest'
import { buildScoreSlatePdfOptions } from '../../../app/utils/pdf/score-sheet-export'

describe('buildScoreSlatePdfOptions', () => {
  it('uses display title for game name in PDF subtitle', () => {
    const opts = buildScoreSlatePdfOptions({
      gameType: 'mexican-train',
      playerIds: ['p1'],
      playerNames: { p1: 'A' },
      rowLabels: [12],
      scores: { 0: { p1: 5 } },
      runningTotals: { p1: 5 },
    })
    expect(opts.subtitle).toBe('Mexican Train')
    expect(opts.gameType).toBe('mexican-train')
  })

  it('builds rows and totals', () => {
    const opts = buildScoreSlatePdfOptions({
      gameType: 'rummy',
      playerIds: ['p1', 'p2'],
      playerNames: { p1: 'A', p2: 'B' },
      rowLabels: [1],
      scores: { 0: { p1: 10, p2: 5 } },
      runningTotals: { p1: 10, p2: 5 },
    })
    expect(opts.playerNames).toEqual(['A', 'B'])
    expect(opts.headerCornerLabel).toBe('Round')
    expect(opts.rows[0]!.label).toBe('Round 1')
    expect(opts.rows[0]!.cells).toEqual(['10', '5'])
    expect(opts.totalsRow).toEqual(['10', '5'])
  })

  it('uses empty cells when no score entered', () => {
    const opts = buildScoreSlatePdfOptions({
      gameType: 'rummy',
      playerIds: ['p1'],
      playerNames: { p1: 'A' },
      rowLabels: [1],
      scores: {},
      runningTotals: { p1: 0 },
    })
    expect(opts.rows[0]!.cells).toEqual([''])
  })
})
