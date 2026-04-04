import { describe, it, expect } from 'vitest'
import {
  roundHasRecordedScore,
  visibleRoundIndices,
} from '../../../app/utils/game/round-visibility'

describe('roundHasRecordedScore', () => {
  it('is false when row missing or all undefined', () => {
    expect(roundHasRecordedScore({}, 0, ['a'])).toBe(false)
    expect(roundHasRecordedScore({ 0: {} }, 0, ['a'])).toBe(false)
    expect(roundHasRecordedScore({ 0: { a: undefined } }, 0, ['a'])).toBe(
      false,
    )
  })

  it('is true when any player has a number', () => {
    expect(roundHasRecordedScore({ 0: { a: 0 } }, 0, ['a'])).toBe(true)
    expect(roundHasRecordedScore({ 0: { a: 1, b: 2 } }, 0, ['a', 'b'])).toBe(
      true,
    )
  })
})

describe('visibleRoundIndices', () => {
  it('returns all indices unless rummy unlimited finished', () => {
    expect(
      visibleRoundIndices({
        gameType: 'rummy',
        phase: 'playing',
        rummyHasRoundLimit: false,
        rowLabelsLength: 2,
        scores: { 0: { a: 1 } },
        playerIds: ['a'],
      }),
    ).toEqual([0, 1])
    expect(
      visibleRoundIndices({
        gameType: 'whist',
        phase: 'finished',
        rummyHasRoundLimit: true,
        rowLabelsLength: 2,
        scores: {},
        playerIds: ['a'],
      }),
    ).toEqual([0, 1])
  })

  it('drops unplayed rounds for rummy unlimited when finished', () => {
    expect(
      visibleRoundIndices({
        gameType: 'rummy',
        phase: 'finished',
        rummyHasRoundLimit: false,
        rowLabelsLength: 2,
        scores: { 0: { a: 1, b: 2 } },
        playerIds: ['a', 'b'],
      }),
    ).toEqual([0])
  })
})
