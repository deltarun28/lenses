import {
  byUpdatedAtDescending,
  parseObservations,
  removeObservation,
  serializeObservations,
  upsertObservation,
  type Observation,
} from "@/domain/observations/observation";
import { readJson, storageKey, writeJson } from "@/lib/storage";
import type { ObservationRepository } from "./observation-repository";

const OBSERVATIONS_KEY = storageKey("observations");

function load(): Observation[] {
  return parseObservations(readJson(OBSERVATIONS_KEY, [])).sort(byUpdatedAtDescending);
}

function persist(observations: Observation[]): void {
  writeJson(OBSERVATIONS_KEY, serializeObservations(observations));
}

/** localStorage-backed observations. Safe to call during SSR: reads return []. */
export const localObservationRepository: ObservationRepository = {
  list(): Observation[] {
    return load();
  },

  getByLensId(lensId: string): Observation | null {
    return load().find((observation) => observation.lensId === lensId) ?? null;
  },

  save(input: { lensId: string; text: string }): Observation {
    const now = new Date().toISOString();
    const next = upsertObservation(load(), input, now);
    persist(next);
    const saved = next.find((observation) => observation.lensId === input.lensId);
    if (!saved) {
      throw new Error(`Failed to save observation for "${input.lensId}".`);
    }
    return saved;
  },

  remove(lensId: string): void {
    persist(removeObservation(load(), lensId));
  },
};
