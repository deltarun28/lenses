import { describe, expect, it } from "vitest";
import {
  OBSERVATION_MAX_LENGTH,
  byUpdatedAtDescending,
  parseObservations,
  removeObservation,
  serializeObservations,
  upsertObservation,
  type Observation,
} from "@/domain/observations/observation";

const valid: Observation = {
  lensId: "inversion",
  text: "Used this in the delivery review.",
  createdAt: "2026-08-03T09:00:00.000Z",
  updatedAt: "2026-08-03T09:00:00.000Z",
};

describe("parseObservations", () => {
  it("round-trips valid data", () => {
    expect(parseObservations(serializeObservations([valid]))).toEqual([valid]);
  });

  it("returns an empty list for missing or non-array data", () => {
    expect(parseObservations(undefined)).toEqual([]);
    expect(parseObservations(null)).toEqual([]);
    expect(parseObservations("not json")).toEqual([]);
    expect(parseObservations({ lensId: "x" })).toEqual([]);
  });

  it("drops corrupt entries but keeps valid ones", () => {
    const parsed = parseObservations([
      valid,
      { lensId: "broken" },
      { lensId: "empty", text: "", createdAt: "a", updatedAt: "b" },
      42,
    ]);
    expect(parsed).toEqual([valid]);
  });

  it("keeps only the first entry per lens", () => {
    const parsed = parseObservations([valid, { ...valid, text: "duplicate" }]);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]!.text).toBe(valid.text);
  });

  it("rejects text beyond the maximum length", () => {
    const tooLong = { ...valid, text: "x".repeat(OBSERVATION_MAX_LENGTH + 1) };
    expect(parseObservations([tooLong])).toEqual([]);
  });
});

describe("upsertObservation", () => {
  it("creates a new observation with matching timestamps", () => {
    const [created] = upsertObservation(
      [],
      { lensId: "ooda-loop", text: "  note  " },
      "T1",
    );
    expect(created).toEqual({
      lensId: "ooda-loop",
      text: "note",
      createdAt: "T1",
      updatedAt: "T1",
    });
  });

  it("updates in place, preserving createdAt and not duplicating", () => {
    const next = upsertObservation(
      [valid],
      { lensId: "inversion", text: "revised" },
      "T2",
    );
    expect(next).toHaveLength(1);
    expect(next[0]!.createdAt).toBe(valid.createdAt);
    expect(next[0]!.updatedAt).toBe("T2");
    expect(next[0]!.text).toBe("revised");
  });

  it("truncates text at the maximum length", () => {
    const [created] = upsertObservation(
      [],
      { lensId: "x", text: "y".repeat(OBSERVATION_MAX_LENGTH + 50) },
      "T1",
    );
    expect(created!.text).toHaveLength(OBSERVATION_MAX_LENGTH);
  });
});

describe("removeObservation", () => {
  it("removes only the matching lens", () => {
    const other = { ...valid, lensId: "ooda-loop" };
    expect(removeObservation([valid, other], "inversion")).toEqual([other]);
  });

  it("is a no-op for an unknown lens", () => {
    expect(removeObservation([valid], "unknown")).toEqual([valid]);
  });
});

describe("byUpdatedAtDescending", () => {
  it("sorts most recently updated first", () => {
    const older = { ...valid, lensId: "a", updatedAt: "2026-08-01T00:00:00.000Z" };
    const newer = { ...valid, lensId: "b", updatedAt: "2026-08-09T00:00:00.000Z" };
    expect([older, newer].sort(byUpdatedAtDescending).map((o) => o.lensId)).toEqual([
      "b",
      "a",
    ]);
  });
});
