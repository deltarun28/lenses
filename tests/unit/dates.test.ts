import { describe, expect, it } from "vitest";
import {
  addDaysToIsoDate,
  daysBetweenIsoDates,
  formatIsoDate,
  isIsoDate,
  toIsoDate,
} from "@/lib/dates";

describe("isIsoDate", () => {
  it("accepts well-formed calendar dates", () => {
    expect(isIsoDate("2026-08-03")).toBe(true);
    expect(isIsoDate("2024-02-29")).toBe(true);
  });

  it("rejects malformed or impossible dates", () => {
    expect(isIsoDate("2026-8-3")).toBe(false);
    expect(isIsoDate("2026-13-01")).toBe(false);
    expect(isIsoDate("2026-02-31")).toBe(false);
    expect(isIsoDate("2025-02-29")).toBe(false);
    expect(isIsoDate(null)).toBe(false);
  });
});

describe("toIsoDate", () => {
  it("uses local calendar fields, not UTC", () => {
    // 23:30 local on 3 August is still 3 August, whatever the offset.
    const date = new Date(2026, 7, 3, 23, 30, 0);
    expect(toIsoDate(date)).toBe("2026-08-03");
  });
});

describe("daysBetweenIsoDates", () => {
  it("counts whole days", () => {
    expect(daysBetweenIsoDates("2026-08-03", "2026-08-03")).toBe(0);
    expect(daysBetweenIsoDates("2026-08-03", "2026-08-04")).toBe(1);
    expect(daysBetweenIsoDates("2026-08-04", "2026-08-03")).toBe(-1);
  });

  it("crosses month and year boundaries", () => {
    expect(daysBetweenIsoDates("2026-01-31", "2026-02-01")).toBe(1);
    expect(daysBetweenIsoDates("2026-12-31", "2027-01-01")).toBe(1);
    expect(daysBetweenIsoDates("2026-01-01", "2027-01-01")).toBe(365);
  });

  it("handles leap years", () => {
    expect(daysBetweenIsoDates("2024-02-28", "2024-03-01")).toBe(2);
    expect(daysBetweenIsoDates("2025-02-28", "2025-03-01")).toBe(1);
  });

  it("is unaffected by daylight saving transitions", () => {
    // NZ daylight saving ends in early April; a 25-hour day must still count as one.
    expect(daysBetweenIsoDates("2026-04-04", "2026-04-06")).toBe(2);
    // Northern hemisphere spring forward.
    expect(daysBetweenIsoDates("2026-03-28", "2026-03-30")).toBe(2);
  });

  it("throws on invalid input rather than returning a wrong number", () => {
    expect(() => daysBetweenIsoDates("not-a-date", "2026-08-03")).toThrow();
  });
});

describe("addDaysToIsoDate", () => {
  it("moves forwards and backwards across boundaries", () => {
    expect(addDaysToIsoDate("2026-08-03", 1)).toBe("2026-08-04");
    expect(addDaysToIsoDate("2026-01-01", -1)).toBe("2025-12-31");
    expect(addDaysToIsoDate("2024-02-28", 1)).toBe("2024-02-29");
  });

  it("round-trips with daysBetweenIsoDates", () => {
    const start = "2026-05-17";
    for (const offset of [0, 1, 30, 365, -14]) {
      expect(daysBetweenIsoDates(start, addDaysToIsoDate(start, offset))).toBe(offset);
    }
  });
});

describe("formatIsoDate", () => {
  it("renders a readable date without shifting the day", () => {
    expect(formatIsoDate("2026-08-03", "en-NZ")).toContain("3");
    expect(formatIsoDate("2026-08-03", "en-NZ")).toContain("2026");
  });

  it("returns the input unchanged when it is not a date", () => {
    expect(formatIsoDate("nonsense")).toBe("nonsense");
  });
});
