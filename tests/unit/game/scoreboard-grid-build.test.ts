import { describe, expect, it } from "vitest";
import {
  buildScoreboardGridModel,
  scoreboardRowCellModes,
} from "~/utils/game/scoreboard-grid-build";

const emptyGridInput = {
  gameType: "rummy" as const,
  phase: "playing" as const,
  playerIds: ["a"],
  playerNames: { a: "A" },
  rowLabels: [1, 2, 3],
  scores: {},
  runningTotals: { a: 0 },
  currentRoundIndex: 1,
  tableRoundIndices: [0, 1],
  scoreboardLeaderPlayerIds: [] as string[],
  dealerPlayerId: null as string | null,
};

describe("scoreboardRowCellModes", () => {
  it("marks future, past, and current-input while playing", () => {
    expect(
      scoreboardRowCellModes({
        phase: "playing",
        currentRoundIndex: 1,
        rowCount: 3,
      }),
    ).toEqual(["past", "current-input", "future"]);
  });

  it("uses current-done for the active row when finished", () => {
    expect(
      scoreboardRowCellModes({
        phase: "finished",
        currentRoundIndex: 1,
        rowCount: 3,
      }),
    ).toEqual(["past", "current-done", "future"]);
  });

  it("returns empty array when rowCount is zero", () => {
    expect(
      scoreboardRowCellModes({
        phase: "playing",
        currentRoundIndex: 0,
        rowCount: 0,
      }),
    ).toEqual([]);
  });
});

describe("buildScoreboardGridModel", () => {
  it("assembles model with rowCellModes aligned to rowLabels length", () => {
    const m = buildScoreboardGridModel(emptyGridInput);
    expect(m.rowCellModes).toHaveLength(3);
    expect(m.tableRoundIndices).toEqual([0, 1]);
    expect(m.phase).toBe("playing");
  });
});
