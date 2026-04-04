import type { GameType } from "~/utils/game/game-types";

export type ScoreboardRowCellMode =
  | "future"
  | "past"
  | "current-input"
  | "current-done";

export interface ScoreboardGridModel {
  gameType: GameType | null;
  phase: "playing" | "finished";
  playerIds: string[];
  playerNames: Record<string, string>;
  rowLabels: number[];
  scores: Record<number, Record<string, number>>;
  runningTotals: Record<string, number>;
  currentRoundIndex: number;
  tableRoundIndices: number[];
  rowCellModes: ScoreboardRowCellMode[];
  scoreboardLeaderPlayerIds: string[];
  dealerPlayerId: string | null;
}
