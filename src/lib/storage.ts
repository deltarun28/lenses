/**
 * Thin, defensive wrapper around localStorage.
 *
 * Nothing outside the repositories should import this. It exists so that server
 * rendering, private-mode storage exceptions and corrupt values are handled in
 * exactly one place.
 */

export const STORAGE_NAMESPACE = "lenses.v1";

export function storageKey(name: string): string {
  return `${STORAGE_NAMESPACE}.${name}`;
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readRaw(key: string): string | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

/** Returns `fallback` when storage is unavailable, empty, or holds invalid JSON. */
export function readJson<T>(key: string, fallback: T): T | unknown {
  const raw = readRaw(key);
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return fallback;
  }
}

/** Returns false when the write could not be completed (quota, private mode). */
export function writeJson(key: string, value: unknown): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function writeRaw(key: string, value: string): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // Ignore: removal failing is never worth interrupting the user for.
  }
}
