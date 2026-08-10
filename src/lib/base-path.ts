/**
 * Base path the app is served under.
 *
 * Empty at the domain root (Vercel, `npm run dev`). Set to `/lenses` for the
 * GitHub Pages project site, where the app lives in a subdirectory.
 *
 * Next applies the base path to `<Link>`, `next/image` and route handling on its
 * own. This constant is only for the places it cannot reach: strings written
 * into the web app manifest and the service worker, which are plain data rather
 * than routed requests.
 *
 * The literal `process.env.NEXT_PUBLIC_BASE_PATH` is required for Next to inline
 * the value into client and service worker bundles at build time. Do not read it
 * through a variable.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefixes a root-relative app path with the base path. */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
