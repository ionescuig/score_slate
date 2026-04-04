import { defineStore } from 'pinia'
import { dealerIndex } from '~/utils/game/dealer'
import { mexicanTrainRowLabels } from '~/utils/game/mexican-train'
import { normalizePersistedScores } from '~/utils/game/persist'
import { whistCardsPerPlayerRowLabels } from '~/utils/game/whist'
import type { GameType } from '~/utils/game/game-types'
import { isPlayerCountValid } from '~/utils/game/game-types'
import {
  leaderPlayerIdsForScoreboard,
  winnerPlayerIds,
  rummyLimitReached,
} from '~/utils/game/winners'

function rowLabelsFor(
  gameType: GameType,
  playerCount: number,
  rummyRounds: number,
): number[] {
  if (gameType === 'mexican-train') {
    return [...mexicanTrainRowLabels()]
  }
  if (gameType === 'whist') {
    return whistCardsPerPlayerRowLabels(playerCount)
  }
  return Array.from({ length: rummyRounds }, (_, i) => i + 1)
}

export const useGameStore = defineStore('game', {
  state: () => ({
    sessionId: null as string | null,
    gameType: null as GameType | null,
    playerIds: [] as string[],
    playerNames: {} as Record<string, string>,
    roundCount: 0,
    rowLabels: [] as number[],
    currentRoundIndex: 0,
    scores: {} as Record<number, Record<string, number>>,
    phase: 'idle' as 'idle' | 'playing' | 'finished',
    rummyLimit: null as number | null,
    /** Rummy only: false = play until Finish (rounds grow with Next round). */
    rummyHasRoundLimit: true,
  }),
  getters: {
    runningTotals(state): Record<string, number> {
      const totals: Record<string, number> = {}
      for (const pid of state.playerIds) {
        totals[pid] = 0
      }
      for (let r = 0; r <= state.currentRoundIndex; r += 1) {
        const row = state.scores[r]
        if (!row) {
          continue
        }
        for (const pid of state.playerIds) {
          totals[pid] += row[pid] ?? 0
        }
      }
      return totals
    },
    dealerPlayerId(state): string | null {
      if (state.phase === 'idle' || state.playerIds.length === 0) {
        return null
      }
      const idx = dealerIndex(state.playerIds.length, state.currentRoundIndex)
      return state.playerIds[idx] ?? null
    },
    /** Tied leaders by running total (used for final result and any logic needing true standings). */
    leaderPlayerIds(): string[] {
      if (!this.gameType) {
        return []
      }
      return winnerPlayerIds(this.gameType, this.runningTotals)
    },
    /** Leaders shown in the scoreboard header — empty during round 1 while playing. */
    scoreboardLeaderPlayerIds(): string[] {
      if (!this.gameType) {
        return []
      }
      return leaderPlayerIdsForScoreboard(
        this.gameType,
        this.runningTotals,
        this.phase,
        this.currentRoundIndex,
      )
    },
    limitReached(): boolean {
      if (this.gameType !== 'rummy' || this.rummyLimit == null) {
        return false
      }
      return rummyLimitReached(this.runningTotals, this.rummyLimit)
    },
    /** True when every player has a numeric score for the current round (0 counts). */
    canAdvanceRound(state): boolean {
      if (state.phase !== 'playing' || state.playerIds.length === 0) {
        return false
      }
      const r = state.currentRoundIndex
      const row = state.scores[r]
      if (!row) {
        return false
      }
      for (const pid of state.playerIds) {
        if (row[pid] === undefined) {
          return false
        }
      }
      return true
    },
  },
  actions: {
    /** Merge persisted snapshot into store; unknown keys ignored. */
    hydrate(data: Record<string, unknown>) {
      if (!data || typeof data !== 'object') {
        return
      }
      const d = data as Partial<{
        sessionId: string | null
        gameType: GameType | null
        playerIds: string[]
        playerNames: Record<string, string>
        roundCount: number
        rowLabels: number[]
        currentRoundIndex: number
        scores: Record<number, Record<string, number>>
        phase: 'idle' | 'playing' | 'finished'
        rummyLimit: number | null
        rummyHasRoundLimit?: boolean
      }>
      if (d.sessionId != null) {
        this.sessionId = d.sessionId
      }
      if (d.gameType != null) {
        this.gameType = d.gameType
      }
      if (d.playerIds) {
        this.playerIds = d.playerIds
      }
      if (d.playerNames) {
        this.playerNames = d.playerNames
      }
      if (d.roundCount != null) {
        this.roundCount = d.roundCount
      }
      if (d.rowLabels) {
        this.rowLabels = d.rowLabels
      }
      if (d.currentRoundIndex != null) {
        this.currentRoundIndex = d.currentRoundIndex
      }
      if (d.scores && d.playerIds?.length) {
        this.scores = normalizePersistedScores(d.scores, d.playerIds)
      } else if (d.scores) {
        this.scores = {}
      }
      if (d.phase) {
        this.phase = d.phase
      }
      if (d.rummyLimit !== undefined) {
        this.rummyLimit = d.rummyLimit
      }
      if (d.rummyHasRoundLimit !== undefined) {
        this.rummyHasRoundLimit = d.rummyHasRoundLimit
      } else if (d.gameType === 'rummy') {
        this.rummyHasRoundLimit = true
      }
    },
    resetSession() {
      this.sessionId = null
      this.gameType = null
      this.playerIds = []
      this.playerNames = {}
      this.roundCount = 0
      this.rowLabels = []
      this.currentRoundIndex = 0
      this.scores = {}
      this.phase = 'idle'
      this.rummyLimit = null
      this.rummyHasRoundLimit = true
    },
    startGame(options: {
      gameType: GameType
      playerIds: string[]
      playerNames: Record<string, string>
      rummyRounds?: number
      rummyLimit?: number | null
      /** Rummy: false = open-ended until Finish. */
      rummyHasRoundLimit?: boolean
    }) {
      const { gameType, playerIds, playerNames } = options
      if (!isPlayerCountValid(gameType, playerIds.length)) {
        throw new Error('Invalid player count for this game')
      }
      this.sessionId = crypto.randomUUID()
      this.gameType = gameType
      this.playerIds = [...playerIds]
      this.playerNames = { ...playerNames }
      this.currentRoundIndex = 0
      this.scores = {}
      this.phase = 'playing'

      if (gameType === 'rummy') {
        const lim = options.rummyLimit
        this.rummyLimit =
          lim != null && typeof lim === 'number' && !Number.isNaN(lim)
            ? lim
            : null
        const hasRoundLimit = options.rummyHasRoundLimit ?? true
        this.rummyHasRoundLimit = hasRoundLimit
        if (!hasRoundLimit) {
          this.rowLabels = [1]
          this.roundCount = 1
        } else {
          const rummyRoundCount = Math.max(
            3,
            options.rummyRounds ??
              (options.rummyLimit == null ? 15 : 10),
          )
          this.rowLabels = rowLabelsFor(
            gameType,
            playerIds.length,
            rummyRoundCount,
          )
          this.roundCount = this.rowLabels.length
        }
      } else {
        this.rummyLimit = null
        this.rummyHasRoundLimit = true
        const rummyRoundCount = options.rummyRounds ?? 10
        const rowLabels = rowLabelsFor(gameType, playerIds.length, rummyRoundCount)
        this.roundCount = rowLabels.length
        this.rowLabels = rowLabels
      }
    },
    setRoundScore(playerId: string, value: number) {
      if (this.phase !== 'playing') {
        return
      }
      this.setRoundScoreForRound(this.currentRoundIndex, playerId, value)
    },
    /** Set score for a specific round (current or past while playing; any round when finished). */
    setRoundScoreForRound(roundIndex: number, playerId: string, value: number) {
      if (this.phase !== 'playing' && this.phase !== 'finished') {
        return
      }
      if (!this.playerIds.includes(playerId)) {
        return
      }
      if (roundIndex < 0 || roundIndex >= this.rowLabels.length) {
        return
      }
      if (!this.scores[roundIndex]) {
        this.scores[roundIndex] = {}
      }
      this.scores[roundIndex][playerId] = value
    },
    /** Fill missing players for one round with 0 (e.g. when closing the score modal). */
    flushRoundScores(roundIndex: number) {
      if (this.phase !== 'playing' && this.phase !== 'finished') {
        return
      }
      if (roundIndex < 0 || roundIndex >= this.rowLabels.length) {
        return
      }
      if (!this.scores[roundIndex]) {
        this.scores[roundIndex] = {}
      }
      for (const pid of this.playerIds) {
        if (this.scores[roundIndex][pid] === undefined) {
          this.scores[roundIndex][pid] = 0
        }
      }
    },
    advanceRound() {
      if (this.phase !== 'playing') {
        return
      }
      if (!this.canAdvanceRound) {
        return
      }
      if (this.currentRoundIndex < this.roundCount - 1) {
        this.currentRoundIndex += 1
        return
      }
      if (
        this.gameType === 'rummy' &&
        !this.rummyHasRoundLimit &&
        this.currentRoundIndex === this.roundCount - 1
      ) {
        const next = this.rowLabels.length + 1
        this.rowLabels.push(next)
        this.roundCount = this.rowLabels.length
        this.currentRoundIndex = this.roundCount - 1
      }
    },
    finishGame() {
      if (this.phase === 'playing') {
        this.phase = 'finished'
      }
    },
  },
})
