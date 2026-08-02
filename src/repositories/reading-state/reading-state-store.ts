"use client";

import type { IsoDate } from "@/lib/dates";
import { localReadingStateRepository } from "./local-reading-state-repository";

/** React-facing wrapper around the stored start date. See observation-store.ts. */

let snapshot: IsoDate | null = null;
let loaded = false;
const listeners = new Set<() => void>();

function invalidate(): void {
  loaded = false;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", invalidate);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", invalidate);
  };
}

function getSnapshot(): IsoDate | null {
  if (!loaded) {
    snapshot = localReadingStateRepository.getStartDate();
    loaded = true;
  }
  return snapshot;
}

export const readingStateStore = {
  subscribe,
  getSnapshot,
  getServerSnapshot: (): IsoDate | null => null,

  setStartDate(date: IsoDate): void {
    localReadingStateRepository.setStartDate(date);
    invalidate();
  },
};
