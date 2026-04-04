import { describe, it, expect } from "vitest";
import {
  whistCardsPerPlayerRowLabels,
  whistRoundCount,
  whistRowStartsSection,
} from "../../../app/utils/game/whist";

describe("whistCardsPerPlayerRowLabels", () => {
  it("matches PRD ladder for n=4", () => {
    const labels = whistCardsPerPlayerRowLabels(4);
    expect(labels).toHaveLength(24);
    expect(labels.slice(0, 4)).toEqual([1, 1, 1, 1]);
    expect(labels.slice(4, 10)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(labels.slice(10, 14)).toEqual([8, 8, 8, 8]);
    expect(labels.slice(14, 20)).toEqual([7, 6, 5, 4, 3, 2]);
    expect(labels.slice(20, 24)).toEqual([1, 1, 1, 1]);
  });

  it("throws outside 4–6", () => {
    expect(() => whistCardsPerPlayerRowLabels(3)).toThrow();
    expect(() => whistCardsPerPlayerRowLabels(7)).toThrow();
  });
});

describe("whistRoundCount", () => {
  it("equals label length", () => {
    expect(whistRoundCount(4)).toBe(whistCardsPerPlayerRowLabels(4).length);
  });
});

describe("whistRowStartsSection", () => {
  it("marks first row of each ladder segment for n=4", () => {
    expect(whistRowStartsSection(0, 4)).toBe(false);
    expect(whistRowStartsSection(4, 4)).toBe(true);
    expect(whistRowStartsSection(10, 4)).toBe(true);
    expect(whistRowStartsSection(14, 4)).toBe(true);
    expect(whistRowStartsSection(20, 4)).toBe(true);
  });

  it("matches segment boundaries for n=6", () => {
    const n = 6;
    expect(whistRowStartsSection(n, n)).toBe(true);
    expect(whistRowStartsSection(n + 6, n)).toBe(true);
    expect(whistRowStartsSection(2 * n + 6, n)).toBe(true);
    expect(whistRowStartsSection(2 * n + 12, n)).toBe(true);
  });
});
