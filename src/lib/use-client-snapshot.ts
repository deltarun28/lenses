"use client";

import { useSyncExternalStore } from "react";

const NEVER_CHANGES = () => () => {};

/**
 * Reads a value that only exists in the browser (the clock, storage) without
 * setting state in an effect.
 *
 * Returns null during server rendering and the first hydration pass, so callers
 * render a placeholder until the real value is available.
 */
export function useClientSnapshot<T>(getSnapshot: () => T): T | null {
  return useSyncExternalStore<T | null>(NEVER_CHANGES, getSnapshot, () => null);
}
