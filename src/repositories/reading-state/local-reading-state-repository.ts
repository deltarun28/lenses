import { isIsoDate, type IsoDate } from "@/lib/dates";
import { readRaw, removeKey, storageKey, writeRaw } from "@/lib/storage";
import type { ReadingStateRepository } from "./reading-state-repository";

const START_DATE_KEY = storageKey("start-date");

/**
 * localStorage-backed reading state.
 *
 * Stored as a bare ISO date string so it stays readable and hand-editable. Any
 * value that is not a valid date is treated as absent.
 */
export const localReadingStateRepository: ReadingStateRepository = {
  getStartDate(): IsoDate | null {
    const raw = readRaw(START_DATE_KEY);
    return isIsoDate(raw) ? raw : null;
  },

  setStartDate(date: IsoDate): void {
    if (!isIsoDate(date)) return;
    writeRaw(START_DATE_KEY, date);
  },

  ensureStartDate(today: IsoDate): IsoDate {
    const existing = this.getStartDate();
    if (existing) return existing;
    this.setStartDate(today);
    return today;
  },

  clear(): void {
    removeKey(START_DATE_KEY);
  },
};
