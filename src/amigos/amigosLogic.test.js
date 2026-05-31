import { describe, it, expect } from "vitest";
import { shuffle, buildDeck, currentCardId, ranking } from "./amigosLogic.js";

// Deterministic RNG (mulberry32) for reproducible shuffles.
function seeded(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe("shuffle", () => {
  it("preserves length and all elements", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, seeded(42));
    expect(out).toHaveLength(5);
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3];
    shuffle(input, seeded(1));
    expect(input).toEqual([1, 2, 3]);
  });
});

describe("buildDeck", () => {
  it("returns a permutation of 0..count-1", () => {
    const deck = buildDeck(5, seeded(7));
    expect([...deck].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4]);
  });
});

describe("currentCardId", () => {
  it("returns the card at deckIdx", () => {
    expect(currentCardId([10, 20, 30], 1)).toBe(20);
  });

  it("cycles when deckIdx passes the end", () => {
    expect(currentCardId([10, 20, 30], 3)).toBe(10);
    expect(currentCardId([10, 20, 30], 4)).toBe(20);
  });

  it("returns null for an empty deck", () => {
    expect(currentCardId([], 0)).toBe(null);
  });
});

describe("ranking", () => {
  it("sorts players by card count descending and attaches their cards", () => {
    const players = [
      { id: "a", name: "Ana" },
      { id: "b", name: "Bia" },
      { id: "c", name: "Cau" },
    ];
    const scores = { a: [1], b: [2, 3, 4], c: [] };
    const result = ranking(players, scores);
    expect(result.map((p) => p.id)).toEqual(["b", "a", "c"]);
    expect(result[0].cards).toEqual([2, 3, 4]);
    expect(result[2].cards).toEqual([]);
  });
});
