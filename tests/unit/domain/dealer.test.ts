import { describe, it, expect } from 'vitest'
import { dealerIndex } from '../../../app/utils/game/dealer'

describe('dealerIndex', () => {
  it('uses (n-1+r) mod n', () => {
    expect(dealerIndex(4, 0)).toBe(3)
    expect(dealerIndex(4, 1)).toBe(0)
    expect(dealerIndex(4, 2)).toBe(1)
    expect(dealerIndex(5, 0)).toBe(4)
    expect(dealerIndex(5, 1)).toBe(0)
  })

  it('throws for zero players', () => {
    expect(() => dealerIndex(0, 0)).toThrow()
  })
})
