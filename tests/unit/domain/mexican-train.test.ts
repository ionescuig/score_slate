import { describe, it, expect } from 'vitest'
import { mexicanTrainRowLabels } from '../../../app/utils/game/mexican-train'

describe('mexicanTrainRowLabels', () => {
  it('returns 12 down to 0', () => {
    const labels = mexicanTrainRowLabels()
    expect(labels).toHaveLength(13)
    expect(labels[0]).toBe(12)
    expect(labels[12]).toBe(0)
    expect(labels).toEqual([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
  })
})
