import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * The base path is what makes the GitHub Pages project site work, and every way
 * it can be wrong is silent: a wrong `start_url` installs an app that opens a
 * 404, and a wrong `scope` installs one that escapes to the domain root on the
 * first navigation. Neither shows up in a build log.
 *
 * `BASE_PATH` is read at module load, so each case re-imports with a stubbed
 * environment rather than sharing one instance.
 */
async function loadWithBasePath(basePath: string | undefined) {
  vi.resetModules();
  if (basePath === undefined) {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", undefined);
  } else {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", basePath);
  }
  return {
    ...(await import("@/lib/base-path")),
    manifest: (await import("@/app/manifest")).default,
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("withBasePath", () => {
  it("leaves paths untouched at the domain root", async () => {
    const { withBasePath } = await loadWithBasePath(undefined);

    expect(withBasePath("/")).toBe("/");
    expect(withBasePath("/icons/icon.svg")).toBe("/icons/icon.svg");
  });

  it("prefixes paths when served from a subdirectory", async () => {
    const { withBasePath } = await loadWithBasePath("/lenses");

    expect(withBasePath("/")).toBe("/lenses/");
    expect(withBasePath("/icons/icon.svg")).toBe("/lenses/icons/icon.svg");
  });

  it("does not double the separator", async () => {
    const { withBasePath } = await loadWithBasePath("/lenses");

    expect(withBasePath("/offline")).not.toContain("//");
  });
});

describe("manifest", () => {
  it("scopes an installed app to the domain root by default", async () => {
    const { manifest } = await loadWithBasePath(undefined);
    const { start_url, scope, icons } = manifest();

    expect(start_url).toBe("/");
    expect(scope).toBe("/");
    expect(icons?.map((icon) => icon.src)).toEqual([
      "/icons/icon.svg",
      "/icons/icon-192.png",
      "/icons/icon-512.png",
      "/icons/icon-maskable-512.png",
    ]);
  });

  it("scopes an installed app to the subdirectory it is served from", async () => {
    const { manifest } = await loadWithBasePath("/lenses");
    const { start_url, scope, icons } = manifest();

    expect(start_url).toBe("/lenses/");
    expect(scope).toBe("/lenses/");
    // Every icon must resolve under the base path, or the install prompt has no
    // icon and the home screen entry falls back to a screenshot of the page.
    for (const icon of icons ?? []) {
      expect(icon.src.startsWith("/lenses/")).toBe(true);
    }
  });
});
