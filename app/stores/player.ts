import { defineStore } from 'pinia'
import { randomId } from '~/utils/random-id'

export interface PlayerEntry {
  id: string
  name: string
}

export const usePlayerStore = defineStore('player', {
  state: () => ({
    players: [] as PlayerEntry[],
  }),
  actions: {
    hydrate(data: { players?: PlayerEntry[] }) {
      if (data?.players?.length) {
        this.players = data.players
      }
    },
    addPlayer(name: string) {
      const trimmed = name.trim()
      if (!trimmed) {
        return
      }
      const exists = this.players.some(
        (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
      )
      if (exists) {
        return
      }
      this.players.push({ id: randomId(), name: trimmed })
    },
    removePlayer(id: string) {
      const i = this.players.findIndex((p) => p.id === id)
      if (i >= 0) {
        this.players.splice(i, 1)
      }
    },
  },
})
