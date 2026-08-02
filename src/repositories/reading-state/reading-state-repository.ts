import type { IsoDate } from "@/lib/dates";

/**
 * Persists the single value the daily sequence depends on: the user's local
 * start date (day 1). Jumping to another day rewrites this date.
 */
export interface ReadingStateRepository {
  getStartDate(): IsoDate | null;
  setStartDate(date: IsoDate): void;
  /** Returns the stored start date, setting it to `today` on first run. */
  ensureStartDate(today: IsoDate): IsoDate;
  clear(): void;
}
