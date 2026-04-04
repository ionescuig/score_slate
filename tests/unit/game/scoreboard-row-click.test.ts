import { describe, expect, it } from "vitest";
import { scoreboardRowIsClickable } from "~/utils/game/scoreboard-row-click";

describe("scoreboardRowIsClickable", () => {
  it("allows current and past rounds while playing", () => {
    expect(
      scoreboardRowIsClickable("playing", 0, 2),
    ).toBe(true);
    expect(
      scoreboardRowIsClickable("playing", 2, 2),
    ).toBe(true);
    expect(
      scoreboardRowIsClickable("playing", 3, 2),
    ).toBe(false);
  });

  it("allows every round when finished", () => {
    expect(scoreboardRowIsClickable("finished", 0, 0)).toBe(true);
    expect(scoreboardRowIsClickable("finished", 99, 0)).toBe(true);
  });

  it("never allows rows when idle", () => {
    expect(scoreboardRowIsClickable("idle", 0, 0)).toBe(false);
  });
});
