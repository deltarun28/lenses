import { describe, expect, it } from "vitest";
import {
  cycleNumberForDay,
  dayNumberFor,
  itemForDay,
  lensIndexForDay,
  startDateForDay,
} from "@/services/daily-lens/day-cycle";

describe("dayNumberFor", () => {
  it("makes the start date day 1", () => {
    expect(dayNumberFor("2026-08-03", "2026-08-03")).toBe(1);
  });

  it("advances by one per calendar day", () => {
    expect(dayNumberFor("2026-08-03", "2026-08-04")).toBe(2);
    expect(dayNumberFor("2026-08-03", "2026-08-07")).toBe(5);
  });

  it("crosses month boundaries", () => {
    expect(dayNumberFor("2026-01-30", "2026-02-02")).toBe(4);
  });

  it("never returns less than 1 if the device clock moves backwards", () => {
    expect(dayNumberFor("2026-08-03", "2026-07-01")).toBe(1);
  });
});

describe("startDateForDay", () => {
  it("is the inverse of dayNumberFor", () => {
    const today = "2026-08-03";
    for (const day of [1, 2, 5, 40, 366]) {
      expect(dayNumberFor(startDateForDay(day, today), today)).toBe(day);
    }
  });

  it("leaves the start date as today for day 1", () => {
    expect(startDateForDay(1, "2026-08-03")).toBe("2026-08-03");
  });

  it("clamps days below 1", () => {
    expect(startDateForDay(0, "2026-08-03")).toBe("2026-08-03");
    expect(startDateForDay(-4, "2026-08-03")).toBe("2026-08-03");
  });
});

describe("lensIndexForDay", () => {
  it("maps day 1 to the first lens", () => {
    expect(lensIndexForDay(1, 16)).toBe(0);
  });

  it("loops back to the start after the last lens", () => {
    expect(lensIndexForDay(16, 16)).toBe(15);
    expect(lensIndexForDay(17, 16)).toBe(0);
    expect(lensIndexForDay(33, 16)).toBe(0);
  });

  it("returns -1 when there is no content", () => {
    expect(lensIndexForDay(1, 0)).toBe(-1);
  });
});

describe("itemForDay", () => {
  const items = ["a", "b", "c"];

  it("is deterministic for a given day", () => {
    expect(itemForDay(items, 2)).toBe("b");
    expect(itemForDay(items, 2)).toBe("b");
  });

  it("cycles", () => {
    expect(itemForDay(items, 4)).toBe("a");
    expect(itemForDay(items, 6)).toBe("c");
  });

  it("returns null with an empty library", () => {
    expect(itemForDay([], 3)).toBeNull();
  });
});

describe("cycleNumberForDay", () => {
  it("counts complete passes through the library", () => {
    expect(cycleNumberForDay(1, 16)).toBe(1);
    expect(cycleNumberForDay(16, 16)).toBe(1);
    expect(cycleNumberForDay(17, 16)).toBe(2);
    expect(cycleNumberForDay(0, 0)).toBe(0);
  });
});
