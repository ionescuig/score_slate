import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePlayerStore } from '../../../app/stores/player'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('usePlayerStore', () => {
  it('dedupes names case-insensitively', () => {
    const s = usePlayerStore()
    s.addPlayer('Alice')
    s.addPlayer('alice')
    s.addPlayer(' Bob ')
    expect(s.players).toHaveLength(2)
  })

  it('hydrates players', () => {
    const s = usePlayerStore()
    s.hydrate({
      players: [{ id: 'x', name: 'Pat' }],
    })
    expect(s.players).toHaveLength(1)
    expect(s.players[0]!.name).toBe('Pat')
  })

  it('removePlayer drops entry by id', () => {
    const s = usePlayerStore()
    s.addPlayer('A')
    s.addPlayer('B')
    const idA = s.players.find((p) => p.name === 'A')!.id
    s.removePlayer(idA)
    expect(s.players.map((p) => p.name)).toEqual(['B'])
  })
})
