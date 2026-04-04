function repeat(value: number, count: number): number[] {
  return Array.from({ length: count }, () => value);
}

/**
 * First column labels: cards per player for each deal (PRD ladder).
 */
export function whistCardsPerPlayerRowLabels(playerCount: number): number[] {
  if (playerCount < 4 || playerCount > 6) {
    throw new Error("Whist requires between 4 and 6 players");
  }
  const n = playerCount;
  return [
    ...repeat(1, n),
    2,
    3,
    4,
    5,
    6,
    7,
    ...repeat(8, n),
    7,
    6,
    5,
    4,
    3,
    2,
    ...repeat(1, n),
  ];
}

export function whistRoundCount(playerCount: number): number {
  return whistCardsPerPlayerRowLabels(playerCount).length;
}

/**
 * True for the first row of each ladder segment: 1s → 2–7 → 8s → 7–2 → 1s.
 * Used for a stronger horizontal rule between sections on the scoreboard.
 */
export function whistRowStartsSection(
  rowIndex: number,
  playerCount: number,
): boolean {
  if (playerCount < 4 || playerCount > 6) {
    return false;
  }
  const n = playerCount;
  return (
    rowIndex === n ||
    rowIndex === n + 6 ||
    rowIndex === 2 * n + 6 ||
    rowIndex === 2 * n + 12
  );
}
