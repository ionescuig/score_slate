import { describe, it, expect } from 'vitest'
import { normalizePersistedScores } from '../../../app/utils/game/persist'

describe('normalizePersistedScores', () => {
  it('keeps only known player ids and numeric rounds', () => {
    const raw = {
      0: { a: 1, b: 2, evil: 999 },
      '1': { a: 3 },
      bad: { a: 1 },
    }
    const out = normalizePersistedScores(raw, ['a', 'b'])
    expect(out[0]).toEqual({ a: 1, b: 2 })
    expect(out[0]!.evil).toBeUndefined()
    expect(out[1]).toEqual({ a: 3 })
    expect(out.bad).toBeUndefined()
  })

  it('returns empty when no player ids', () => {
    expect(normalizePersistedScores({ 0: { x: 1 } }, [])).toEqual({})
  })

  it('coerces string numbers from JSON', () => {
    const out = normalizePersistedScores(
      { 0: { a: '10' } as Record<string, unknown> },
      ['a'],
    )
    expect(out[0]!.a).toBe(10)
  })
})
