import { describe, it, expect } from "vitest";
import { scoreboardPlayerColumnStyle } from "../../../app/utils/game/scoreboard-player-style";

describe("scoreboardPlayerColumnStyle", () => {
  it("leader gets green body", () => {
    const s = scoreboardPlayerColumnStyle("a", {
      phase: "playing",
      dealerPlayerId: "b",
      scoreboardLeaderPlayerIds: ["a"],
    });
    expect(s.showLeaderBadge).toBe(true);
    expect(s.bodyBackgroundClass).toBe("bg-emerald-50");
    expect(s.showDealerBadge).toBe(false);
  });

  it("dealer gets gray when not leader", () => {
    const s = scoreboardPlayerColumnStyle("b", {
      phase: "playing",
      dealerPlayerId: "b",
      scoreboardLeaderPlayerIds: ["a"],
    });
    expect(s.showDealerBadge).toBe(true);
    expect(s.bodyBackgroundClass).toBe("bg-slate-100");
    expect(s.showLeaderBadge).toBe(false);
  });

  it("leader wins over dealer tint", () => {
    const s = scoreboardPlayerColumnStyle("x", {
      phase: "playing",
      dealerPlayerId: "x",
      scoreboardLeaderPlayerIds: ["x"],
    });
    expect(s.showDealerBadge).toBe(true);
    expect(s.showLeaderBadge).toBe(true);
    expect(s.bodyBackgroundClass).toBe("bg-emerald-50");
  });

  it("hides dealer badge when finished", () => {
    const s = scoreboardPlayerColumnStyle("b", {
      phase: "finished",
      dealerPlayerId: "b",
      scoreboardLeaderPlayerIds: [],
    });
    expect(s.showDealerBadge).toBe(false);
    expect(s.bodyBackgroundClass).toBe("bg-white");
  });
});
