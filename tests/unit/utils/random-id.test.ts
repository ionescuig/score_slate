import { describe, it, expect } from 'vitest'
import { randomId } from '../../../app/utils/random-id'

describe('randomId', () => {
  it('returns a non-empty string', () => {
    expect(randomId().length).toBeGreaterThan(0)
  })

  it('returns distinct values in a short burst', () => {
    const set = new Set<string>()
    for (let i = 0; i < 40; i++) {
      set.add(randomId())
    }
    expect(set.size).toBe(40)
  })
})
