export default defineNuxtPlugin(() => {
  if (!import.meta.client) {
    return
  }
  const player = usePlayerStore()
  const game = useGameStore()
  const keyP = 'score-slate-players-v1'
  const keyG = 'score-slate-game-v1'
  try {
    const raw = localStorage.getItem(keyP)
    if (raw) {
      player.hydrate(JSON.parse(raw) as { players?: { id: string; name: string }[] })
    }
  } catch {
    /* ignore */
  }
  try {
    const raw = localStorage.getItem(keyG)
    if (raw) {
      const parsed = JSON.parse(raw) as { phase?: string }
      if (parsed?.phase && parsed.phase !== 'idle') {
        game.hydrate(parsed as Record<string, unknown>)
      }
    }
  } catch {
    /* ignore */
  }
  player.$subscribe((_mutation, state) => {
    localStorage.setItem(keyP, JSON.stringify(state))
  })
  game.$subscribe((_mutation, state) => {
    localStorage.setItem(keyG, JSON.stringify(state))
  })
})
