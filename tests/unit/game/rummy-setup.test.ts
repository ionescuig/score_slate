import { describe, it, expect } from "vitest";
import {
  buildRummyStartPayload,
  clampRummyRoundsForSummary,
  effectiveRummyRoundsForStart,
  parseRummyScoreLimit,
  rummyLimitsSummaryText,
  trimRummyLimitInputValue,
} from "../../../app/utils/game/rummy-setup";

describe("trimRummyLimitInputValue", () => {
  it("trims string and stringifies numbers", () => {
    expect(trimRummyLimitInputValue("  10  ")).toBe("10");
    expect(trimRummyLimitInputValue(500)).toBe("500");
    expect(trimRummyLimitInputValue(null)).toBe("");
  });
});

describe("clampRummyRoundsForSummary", () => {
  it("clamps to 3–99", () => {
    expect(clampRummyRoundsForSummary(2)).toBe(3);
    expect(clampRummyRoundsForSummary(100)).toBe(99);
    expect(clampRummyRoundsForSummary(7)).toBe(7);
  });
});

describe("rummyLimitsSummaryText", () => {
  it("covers four combinations", () => {
    expect(
      rummyLimitsSummaryText({
        limitedRounds: false,
        rummyRounds: 15,
        limitRawTrimmed: "",
      }),
    ).toContain("No round cap and no score limit");

    expect(
      rummyLimitsSummaryText({
        limitedRounds: false,
        rummyRounds: 15,
        limitRawTrimmed: "200",
      }),
    ).toContain("200");

    expect(
      rummyLimitsSummaryText({
        limitedRounds: true,
        rummyRounds: 12,
        limitRawTrimmed: "",
      }),
    ).toContain("12 rounds");

    expect(
      rummyLimitsSummaryText({
        limitedRounds: true,
        rummyRounds: 5,
        limitRawTrimmed: "100",
      }),
    ).toContain("100-point cap");
  });
});

describe("parseRummyScoreLimit", () => {
  it("returns null for empty or non-numeric", () => {
    expect(parseRummyScoreLimit("")).toBe(null);
    expect(parseRummyScoreLimit("x")).toBe(null);
  });
  it("returns number when valid", () => {
    expect(parseRummyScoreLimit("42")).toBe(42);
  });
});

describe("effectiveRummyRoundsForStart", () => {
  it("is undefined when round limit off", () => {
    expect(effectiveRummyRoundsForStart(false, 5)).toBe(undefined);
  });
  it("clamps when on", () => {
    expect(effectiveRummyRoundsForStart(true, 2)).toBe(3);
    expect(effectiveRummyRoundsForStart(true, 999)).toBe(99);
    expect(effectiveRummyRoundsForStart(true, "8")).toBe(8);
  });
});

describe("buildRummyStartPayload", () => {
  it("matches prior start() wiring", () => {
    expect(
      buildRummyStartPayload({
        limitRoundCount: false,
        rummyRoundsRaw: 3,
        limitRawTrimmed: "",
      }),
    ).toEqual({
      rummyHasRoundLimit: false,
      rummyRounds: undefined,
      rummyLimit: null,
    });
    expect(
      buildRummyStartPayload({
        limitRoundCount: true,
        rummyRoundsRaw: 10,
        limitRawTrimmed: "500",
      }),
    ).toEqual({
      rummyHasRoundLimit: true,
      rummyRounds: 10,
      rummyLimit: 500,
    });
  });
});
