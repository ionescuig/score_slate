/**
 * Pure helpers for Rummy setup UI (limits copy) and `startGame` payload fields.
 */

export function trimRummyLimitInputValue(
  v: string | number | null | undefined,
): string {
  if (v === null || v === undefined) {
    return "";
  }
  return String(v).trim();
}

export function clampRummyRoundsForSummary(rounds: number): number {
  let r = Number.isFinite(rounds) ? rounds : 3;
  if (r < 3) {
    r = 3;
  }
  return Math.min(99, Math.max(3, Math.floor(r)));
}

export function rummyLimitsSummaryText(input: {
  limitedRounds: boolean;
  rummyRounds: number;
  limitRawTrimmed: string;
}): string {
  const rounds = clampRummyRoundsForSummary(input.rummyRounds);
  const limitNum =
    input.limitRawTrimmed === "" ? NaN : Number(input.limitRawTrimmed);
  const hasScoreLimit = Number.isFinite(limitNum) && limitNum > 0;

  if (!input.limitedRounds && !hasScoreLimit) {
    return "No round cap and no score limit — keep playing until you tap Finish on the score screen.";
  }
  if (!input.limitedRounds && hasScoreLimit) {
    return `No round cap — the game ends automatically when someone reaches ${limitNum} points (after you save that round). You can still tap Finish anytime.`;
  }
  if (input.limitedRounds && !hasScoreLimit) {
    return `${rounds} rounds — the game ends automatically when you save scores for the final round. You can tap Finish earlier if you want.`;
  }
  return `${rounds} rounds and a ${limitNum}-point cap — the game ends automatically when the last round is saved or when someone reaches ${limitNum} points after a round (whichever comes first).`;
}

export function parseRummyScoreLimit(limitRawTrimmed: string): number | null {
  if (limitRawTrimmed === "") {
    return null;
  }
  const n = Number(limitRawTrimmed);
  return Number.isFinite(n) ? n : null;
}

export function effectiveRummyRoundsForStart(
  limitRoundCount: boolean,
  rummyRoundsRaw: unknown,
): number | undefined {
  if (!limitRoundCount) {
    return undefined;
  }
  const n = Number(rummyRoundsRaw);
  return Math.max(
    3,
    Math.min(99, Number.isFinite(n) ? n : 15),
  );
}

export interface RummyStartPayload {
  rummyHasRoundLimit: boolean;
  rummyRounds: number | undefined;
  rummyLimit: number | null;
}

export function buildRummyStartPayload(input: {
  limitRoundCount: boolean;
  rummyRoundsRaw: unknown;
  limitRawTrimmed: string;
}): RummyStartPayload {
  return {
    rummyHasRoundLimit: input.limitRoundCount,
    rummyRounds: effectiveRummyRoundsForStart(
      input.limitRoundCount,
      input.rummyRoundsRaw,
    ),
    rummyLimit: parseRummyScoreLimit(input.limitRawTrimmed),
  };
}
