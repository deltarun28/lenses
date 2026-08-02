import { z } from "zod";

/**
 * An observation is the user's own note against a lens.
 *
 * There is at most one per lens, so `lensId` is the identity — saving again
 * updates the existing note rather than creating a second one.
 */

export const OBSERVATION_MAX_LENGTH = 500;

export interface Observation {
  lensId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export const observationSchema = z.object({
  lensId: z.string().min(1),
  text: z.string().min(1).max(OBSERVATION_MAX_LENGTH),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

/**
 * Parses stored observations, discarding any individual entry that is corrupt
 * rather than throwing away the whole collection.
 */
export function parseObservations(value: unknown): Observation[] {
  if (!Array.isArray(value)) return [];
  const parsed: Observation[] = [];
  const seen = new Set<string>();
  for (const entry of value) {
    const result = observationSchema.safeParse(entry);
    if (!result.success) continue;
    if (seen.has(result.data.lensId)) continue;
    seen.add(result.data.lensId);
    parsed.push(result.data);
  }
  return parsed;
}

export function serializeObservations(observations: Observation[]): Observation[] {
  return observations.map((observation) => ({ ...observation }));
}

/** Most recently updated first. */
export function byUpdatedAtDescending(a: Observation, b: Observation): number {
  return b.updatedAt.localeCompare(a.updatedAt);
}

export function upsertObservation(
  observations: Observation[],
  input: { lensId: string; text: string },
  now: string,
): Observation[] {
  const text = input.text.trim().slice(0, OBSERVATION_MAX_LENGTH);
  const existing = observations.find((entry) => entry.lensId === input.lensId);
  const next: Observation = existing
    ? { ...existing, text, updatedAt: now }
    : { lensId: input.lensId, text, createdAt: now, updatedAt: now };
  return [next, ...observations.filter((entry) => entry.lensId !== input.lensId)];
}

export function removeObservation(
  observations: Observation[],
  lensId: string,
): Observation[] {
  return observations.filter((entry) => entry.lensId !== lensId);
}
