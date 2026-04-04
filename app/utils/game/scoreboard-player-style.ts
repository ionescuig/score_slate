export interface ScoreboardPlayerColumnStyle {
  /** Dealer ribbon in column header (hidden when game is finished). */
  showDealerBadge: boolean;
  /** Leader ribbon in column header. */
  showLeaderBadge: boolean;
  /** Body cell background only — not used on header or footer. */
  bodyBackgroundClass: string;
}

export function scoreboardPlayerColumnStyle(
  playerId: string,
  context: {
    phase: "idle" | "playing" | "finished";
    dealerPlayerId: string | null;
    scoreboardLeaderPlayerIds: readonly string[];
  },
): ScoreboardPlayerColumnStyle {
  const showLeaderBadge = context.scoreboardLeaderPlayerIds.includes(playerId);
  const showDealerBadge =
    context.phase !== "finished" && context.dealerPlayerId === playerId;

  let bodyBackgroundClass = "bg-white";
  if (showLeaderBadge) {
    bodyBackgroundClass = "bg-emerald-50";
  } else if (showDealerBadge) {
    bodyBackgroundClass = "bg-slate-100";
  }

  return {
    showDealerBadge,
    showLeaderBadge,
    bodyBackgroundClass,
  };
}
