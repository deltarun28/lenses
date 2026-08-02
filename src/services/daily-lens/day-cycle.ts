import { addDaysToIsoDate, daysBetweenIsoDates, type IsoDate } from "@/lib/dates";

/**
 * Pure day arithmetic for the daily sequence.
 *
 * The app stores exactly one value — the user's local `startDate`. Day 1 is that
 * date. Everything else, including "jump to day 5", is derived from it, so the
 * current day and the start date can never disagree.
 */

/** The day number a user is on. Never below 1, even if the clock moves backwards. */
export function dayNumberFor(startDate: IsoDate, today: IsoDate): number {
  return Math.max(1, daysBetweenIsoDates(startDate, today) + 1);
}

/** The start date that would put the user on `day` today. Inverse of `dayNumberFor`. */
export function startDateForDay(day: number, today: IsoDate): IsoDate {
  const safeDay = Math.max(1, Math.floor(day));
  return addDaysToIsoDate(today, -(safeDay - 1));
}

/** Position in the sequence for a day, looping back to the start at the end. */
export function lensIndexForDay(day: number, total: number): number {
  if (total <= 0) return -1;
  const safeDay = Math.max(1, Math.floor(day));
  return (safeDay - 1) % total;
}

/** The item scheduled for a given day, or null when there is no content. */
export function itemForDay<T>(items: readonly T[], day: number): T | null {
  const index = lensIndexForDay(day, items.length);
  if (index < 0) return null;
  return items[index] ?? null;
}

/** How many full loops through the library a day number represents. */
export function cycleNumberForDay(day: number, total: number): number {
  if (total <= 0) return 0;
  return Math.floor((Math.max(1, Math.floor(day)) - 1) / total) + 1;
}
