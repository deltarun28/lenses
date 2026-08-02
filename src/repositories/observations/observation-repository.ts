import type { Observation } from "@/domain/observations/observation";

/**
 * Storage boundary for observations. Nothing outside an implementation of this
 * interface should touch localStorage directly.
 */
export interface ObservationRepository {
  list(): Observation[];
  getByLensId(lensId: string): Observation | null;
  /** Creates or updates the single observation for a lens. */
  save(input: { lensId: string; text: string }): Observation;
  remove(lensId: string): void;
}
