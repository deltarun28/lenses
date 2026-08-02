"use client";

import type { Observation } from "@/domain/observations/observation";
import { localObservationRepository } from "./local-observation-repository";

/**
 * React-facing wrapper around the observation repository.
 *
 * Exists so components can use `useSyncExternalStore` instead of copying stored
 * data into state inside an effect. The cached snapshot keeps object identity
 * stable between renders, which is what `useSyncExternalStore` requires.
 */

const EMPTY: Observation[] = [];

let snapshot: Observation[] | null = null;
const listeners = new Set<() => void>();

function invalidate(): void {
  snapshot = null;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab writing to storage should be reflected here too.
  window.addEventListener("storage", invalidate);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", invalidate);
  };
}

function getSnapshot(): Observation[] {
  snapshot ??= localObservationRepository.list();
  return snapshot;
}

export const observationStore = {
  subscribe,
  getSnapshot,
  getServerSnapshot: (): Observation[] => EMPTY,

  save(input: { lensId: string; text: string }): Observation {
    const saved = localObservationRepository.save(input);
    invalidate();
    return saved;
  },

  remove(lensId: string): void {
    localObservationRepository.remove(lensId);
    invalidate();
  },
};
