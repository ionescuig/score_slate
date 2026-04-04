import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '../../../app/stores/game'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useGameStore', () => {
  it('starts with dealer = last player index', () => {
    const g = useGameStore()
    g.startGame({
      gameType: 'rummy',
      playerIds: ['p1', 'p2', 'p3'],
      playerNames: { p1: 'A', p2: 'B', p3: 'C' },
      rummyRounds: 3,
      rummyLimit: null,
    })
    expect(g.dealerPlayerId).toBe('p3')
    expect(g.currentRoundIndex).toBe(0)
  })

  it('updates running totals when current round score changes', () => {
    const g = useGameStore()
    g.startGame({
      gameType: 'rummy',
      playerIds: ['p1', 'p2'],
      playerNames: { p1: 'A', p2: 'B' },
      rummyRounds: 5,
      rummyLimit: null,
    })
    g.setRoundScore('p1', 10)
    g.setRoundScore('p2', 5)
    expect(g.runningTotals.p1).toBe(10)
    expect(g.runningTotals.p2).toBe(5)
    g.setRoundScore('p1', 12)
    expect(g.runningTotals.p1).toBe(12)
  })

  it('ignores setRoundScore for unknown player id', () => {
    const g = useGameStore()
    g.startGame({
      gameType: 'rummy',
      playerIds: ['p1', 'p2'],
      playerNames: { p1: 'A', p2: 'B' },
      rummyRounds: 5,
      rummyLimit: null,
    })
    g.setRoundScore('not-a-player', 99)
    expect(g.scores[0]?.['not-a-player']).toBeUndefined()
  })

  it('advances round and moves dealer', () => {
    const g = useGameStore()
    g.startGame({
      gameType: 'rummy',
      playerIds: ['p1', 'p2'],
      playerNames: { p1: 'A', p2: 'B' },
      rummyRounds: 5,
      rummyLimit: null,
    })
    expect(g.dealerPlayerId).toBe('p2')
    g.setRoundScore('p1', 1)
    g.setRoundScore('p2', 2)
    expect(g.canAdvanceRound).toBe(true)
    g.advanceRound()
    expect(g.currentRoundIndex).toBe(1)
    expect(g.dealerPlayerId).toBe('p1')
  })

  it('does not advance until every player has a score for the current round', () => {
    const g = useGameStore()
    g.startGame({
      gameType: 'rummy',
      playerIds: ['p1', 'p2'],
      playerNames: { p1: 'A', p2: 'B' },
      rummyRounds: 5,
      rummyLimit: null,
    })
    g.setRoundScore('p1', 10)
    expect(g.canAdvanceRound).toBe(false)
    g.advanceRound()
    expect(g.currentRoundIndex).toBe(0)
    g.setRoundScore('p2', 5)
    expect(g.canAdvanceRound).toBe(true)
    g.advanceRound()
    expect(g.currentRoundIndex).toBe(1)
  })

  it('does not show scoreboard leaders until after round 1', () => {
    const g = useGameStore()
    g.startGame({
      gameType: 'rummy',
      playerIds: ['p1', 'p2'],
      playerNames: { p1: 'A', p2: 'B' },
      rummyRounds: 3,
      rummyLimit: null,
    })
    g.setRoundScore('p1', 100)
    g.setRoundScore('p2', 0)
    expect(g.leaderPlayerIds).toEqual(['p1'])
    expect(g.scoreboardLeaderPlayerIds).toEqual([])
    g.advanceRound()
    expect(g.scoreboardLeaderPlayerIds).toEqual(['p1'])
  })

  it('rummy without round limit adds rows until Finish', () => {
    const g = useGameStore()
    g.startGame({
      gameType: 'rummy',
      playerIds: ['p1', 'p2'],
      playerNames: { p1: 'A', p2: 'B' },
      rummyHasRoundLimit: false,
    })
    expect(g.rowLabels).toEqual([1])
    expect(g.roundCount).toBe(1)
    expect(g.currentRoundIndex).toBe(0)
    g.setRoundScore('p1', 1)
    g.setRoundScore('p2', 2)
    g.advanceRound()
    expect(g.rowLabels).toEqual([1, 2])
    expect(g.currentRoundIndex).toBe(1)
    g.finishGame()
    expect(g.phase).toBe('finished')
  })
})
