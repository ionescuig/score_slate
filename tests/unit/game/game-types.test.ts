import { describe, expect, it } from 'vitest'
import {
  displayTitleForGameType,
  parseGameTypeFromRouteParam,
} from '~/utils/game/game-types'

describe('parseGameTypeFromRouteParam', () => {
  it('maps dynamic route segments', () => {
    expect(parseGameTypeFromRouteParam('rummy')).toBe('rummy')
    expect(parseGameTypeFromRouteParam('mexican-train')).toBe('mexican-train')
    expect(parseGameTypeFromRouteParam('whist')).toBe('whist')
  })

  it('returns null for unknown segments', () => {
    expect(parseGameTypeFromRouteParam('')).toBeNull()
    expect(parseGameTypeFromRouteParam('chess')).toBeNull()
  })
})

describe('displayTitleForGameType', () => {
  it('returns human titles', () => {
    expect(displayTitleForGameType('rummy')).toBe('Rummy')
    expect(displayTitleForGameType('mexican-train')).toBe('Mexican Train')
    expect(displayTitleForGameType('whist')).toBe('Whist')
  })

  it('returns fallback when null', () => {
    expect(displayTitleForGameType(null)).toBe('Game')
  })
})
