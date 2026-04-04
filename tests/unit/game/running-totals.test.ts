import { describe, it, expect } from 'vitest'
import {
  totalBeforeRound,
  totalThroughRoundInclusive,
} from '../../../app/utils/game/running-totals'

describe('running-totals', () => {
  const scores: Record<number, Record<string, number>> = {
    0: { a: 10, b: 5 },
    1: { a: 3, b: 7 },
    2: { a: 0, b: 2 },
  }

  it('totalBeforeRound sums strictly earlier rounds', () => {
    expect(totalBeforeRound(scores, 0, 'a')).toBe(0)
    expect(totalBeforeRound(scores, 1, 'a')).toBe(10)
    expect(totalBeforeRound(scores, 2, 'b')).toBe(12)
  })

  it('totalThroughRoundInclusive includes the indexed round', () => {
    expect(totalThroughRoundInclusive(scores, 0, 'a')).toBe(10)
    expect(totalThroughRoundInclusive(scores, 1, 'a')).toBe(13)
    expect(totalThroughRoundInclusive(scores, 2, 'b')).toBe(14)
  })

  it('treats missing rows or cells as zero', () => {
    expect(totalBeforeRound({}, 1, 'x')).toBe(0)
    expect(totalThroughRoundInclusive({ 0: { x: 1 } }, 2, 'x')).toBe(1)
  })
})
