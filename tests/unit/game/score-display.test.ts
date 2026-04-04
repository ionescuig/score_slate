import { describe, it, expect } from 'vitest'
import {
  rowLabelForScoreSheet,
  scoreCellDisplayString,
} from '../../../app/utils/game/score-display'

describe('rowLabelForScoreSheet', () => {
  it('labels rummy rounds', () => {
    expect(rowLabelForScoreSheet('rummy', [1, 2], 0)).toBe('Round 1')
  })

  it('labels pip/cards as plain numbers', () => {
    expect(rowLabelForScoreSheet('mexican-train', [12, 11], 0)).toBe('12')
  })
})

describe('scoreCellDisplayString', () => {
  it('renders numeric cell', () => {
    expect(
      scoreCellDisplayString({ 0: { p1: 7 } }, 0, 'p1'),
    ).toBe('7')
  })

  it('returns empty when missing', () => {
    expect(scoreCellDisplayString({}, 0, 'p1')).toBe('')
  })
})
