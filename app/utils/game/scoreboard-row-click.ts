/**
 * Whether a scoreboard row can open the round editor (grid row click / keyboard).
 */

export function scoreboardRowIsClickable(
  phase: "idle" | "playing" | "finished",
  roundIndex: number,
  currentRoundIndex: number,
): boolean {
  if (phase === "playing") {
    return roundIndex <= currentRoundIndex;
  }
  if (phase === "finished") {
    return true;
  }
  return false;
}
