/**
 * Dealer rotates in setup order. Round r (0-based): dealer index = (n - 1 + r) mod n.
 */
export function dealerIndex(playerCount: number, roundIndex: number): number {
  if (playerCount < 1) {
    throw new Error('playerCount must be at least 1')
  }
  return (playerCount - 1 + roundIndex) % playerCount
}
