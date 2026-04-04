export type GameType = 'rummy' | 'mexican-train' | 'whist'

export const GAME_PLAYER_BOUNDS: Record<GameType, { min: number; max: number }> = {
  rummy: { min: 2, max: 6 },
  'mexican-train': { min: 2, max: 8 },
  whist: { min: 4, max: 6 },
}

/** Single source for UI copy and PDF titles. */
export const GAME_TYPE_DISPLAY_TITLE: Record<GameType, string> = {
  rummy: 'Rummy',
  'mexican-train': 'Mexican Train',
  whist: 'Whist',
}

const ROUTE_SEGMENT_TO_GAME_TYPE: Record<string, GameType> = {
  rummy: 'rummy',
  'mexican-train': 'mexican-train',
  whist: 'whist',
}

export function displayTitleForGameType(gameType: GameType | null): string {
  if (!gameType) {
    return 'Game'
  }
  return GAME_TYPE_DISPLAY_TITLE[gameType]
}

/** `setup/[game].vue` dynamic segment, e.g. `mexican-train`. */
export function parseGameTypeFromRouteParam(raw: string): GameType | null {
  return ROUTE_SEGMENT_TO_GAME_TYPE[raw] ?? null
}

export function isPlayerCountValid(gameType: GameType, count: number): boolean {
  const b = GAME_PLAYER_BOUNDS[gameType]
  return count >= b.min && count <= b.max
}
