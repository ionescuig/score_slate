import type { GameType } from "~/utils/game/game-types";
import type {
  ScoreboardGridModel,
  ScoreboardRowCellMode,
} from "~/utils/game/scoreboard-grid-model";

export function scoreboardRowCellModes(params: {
  phase: "idle" | "playing" | "finished";
  currentRoundIndex: number;
  rowCount: number;
}): ScoreboardRowCellMode[] {
  const { phase, currentRoundIndex, rowCount } = params;
  return Array.from({ length: rowCount }, (_, ri) => {
    if (ri > currentRoundIndex) {
      return "future";
    }
    if (ri < currentRoundIndex) {
      return "past";
    }
    if (phase === "playing") {
      return "current-input";
    }
    return "current-done";
  });
}

export interface BuildScoreboardGridModelInput {
  gameType: GameType | null;
  phase: "playing" | "finished";
  playerIds: string[];
  playerNames: Record<string, string>;
  rowLabels: number[];
  scores: Record<number, Record<string, number>>;
  runningTotals: Record<string, number>;
  currentRoundIndex: number;
  tableRoundIndices: number[];
  scoreboardLeaderPlayerIds: string[];
  dealerPlayerId: string | null;
}

export function buildScoreboardGridModel(
  input: BuildScoreboardGridModelInput,
): ScoreboardGridModel {
  return {
    gameType: input.gameType,
    phase: input.phase,
    playerIds: input.playerIds,
    playerNames: input.playerNames,
    rowLabels: input.rowLabels,
    scores: input.scores,
    runningTotals: input.runningTotals,
    currentRoundIndex: input.currentRoundIndex,
    tableRoundIndices: input.tableRoundIndices,
    rowCellModes: scoreboardRowCellModes({
      phase: input.phase,
      currentRoundIndex: input.currentRoundIndex,
      rowCount: input.rowLabels.length,
    }),
    scoreboardLeaderPlayerIds: input.scoreboardLeaderPlayerIds,
    dealerPlayerId: input.dealerPlayerId,
  };
}
