/**
 * Local calendar date helpers.
 *
 * Every date in this app is a local ISO date string ("YYYY-MM-DD"), never a
 * timestamp. Day boundaries are therefore whatever midnight means on the user's
 * own device, and no arithmetic ever crosses a DST shift.
 */

export type IsoDate = string;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface DateParts {
  year: number;
  month: number;
  day: number;
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

export function parseIsoDate(value: string): DateParts | null {
  if (!ISO_DATE_PATTERN.test(value)) return null;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  // Reject dates such as 2026-02-31 that pass the range check but do not exist.
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) return null;
  return { year, month, day };
}

export function isIsoDate(value: unknown): value is IsoDate {
  return typeof value === "string" && parseIsoDate(value) !== null;
}

/** Formats a Date using its *local* calendar fields. */
export function toIsoDate(date: Date): IsoDate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayIsoDate(now: Date = new Date()): IsoDate {
  return toIsoDate(now);
}

/** Whole days from `from` to `to`. Negative when `to` is earlier. */
export function daysBetweenIsoDates(from: IsoDate, to: IsoDate): number {
  const start = parseIsoDate(from);
  const end = parseIsoDate(to);
  if (!start || !end) {
    throw new Error(`Invalid ISO date in range: "${from}" -> "${to}"`);
  }
  const startUtc = Date.UTC(start.year, start.month - 1, start.day);
  const endUtc = Date.UTC(end.year, end.month - 1, end.day);
  return Math.round((endUtc - startUtc) / 86_400_000);
}

export function addDaysToIsoDate(date: IsoDate, days: number): IsoDate {
  const parts = parseIsoDate(date);
  if (!parts) throw new Error(`Invalid ISO date: "${date}"`);
  const shifted = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`;
}

/** Human-readable form for display, e.g. "3 August 2026". */
export function formatIsoDate(date: IsoDate, locale = "en-NZ"): string {
  const parts = parseIsoDate(date);
  if (!parts) return date;
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).toLocaleDateString(
    locale,
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" },
  );
}
