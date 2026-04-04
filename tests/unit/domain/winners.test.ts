import { describe, it, expect } from 'vitest'
import {
  winnerPlayerIds,
  leaderPlayerIdsForScoreboard,
  rummyLimitReached,
} from '../../../app/utils/game/winners'

describe('winnerPlayerIds', () => {
  it('picks max for rummy', () => {
    const ids = winnerPlayerIds('rummy', { a: 10, b: 12, c: 12 })
    expect(ids.sort()).toEqual(['b', 'c'].sort())
  })

  it('picks min for mexican train', () => {
    const ids = winnerPlayerIds('mexican-train', { a: 5, b: 0, c: 3 })
    expect(ids).toEqual(['b'])
  })

  it('picks max for whist', () => {
    const ids = winnerPlayerIds('whist', { a: 1, b: 4 })
    expect(ids).toEqual(['b'])
  })
})

describe('leaderPlayerIdsForScoreboard', () => {
  const totals = { a: 10, b: 5, c: 5 }

  it('returns no leaders during round 1 while playing', () => {
    expect(
      leaderPlayerIdsForScoreboard('rummy', totals, 'playing', 0),
    ).toEqual([])
  })

  it('returns leaders from round 2 onward while playing', () => {
    expect(
      leaderPlayerIdsForScoreboard('rummy', totals, 'playing', 1).sort(),
    ).toEqual(['a'])
  })

  it('returns leaders when finished even on round 1 (single-round games)', () => {
    expect(
      leaderPlayerIdsForScoreboard('rummy', totals, 'finished', 0).sort(),
    ).toEqual(['a'])
  })
})

describe('rummyLimitReached', () => {
  it('is false without limit', () => {
    expect(rummyLimitReached({ a: 500 }, null)).toBe(false)
    expect(rummyLimitReached({ a: 500 }, undefined)).toBe(false)
  })

  it('is true when any total >= limit', () => {
    expect(rummyLimitReached({ a: 400, b: 500 }, 500)).toBe(true)
    expect(rummyLimitReached({ a: 499 }, 500)).toBe(false)
  })
})
