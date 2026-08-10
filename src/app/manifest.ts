import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/base-path";

/**
 * Web app manifest. Served by Next at /manifest.webmanifest and precached by the
 * service worker, so installation metadata is available offline.
 *
 * Manifest paths are plain strings rather than routed requests, so the base path
 * has to be applied by hand for the GitHub Pages project site. `start_url` and
 * `scope` are what decide whether an installed app opens the right page, so they
 * are covered by a unit test.
 */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lenses — one thinking tool a day",
    short_name: "Lenses",
    description:
      "One practical thinking lens each day, with examples from military strategy, leadership and product building.",
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#eceee8",
    theme_color: "#175e4c",
    categories: ["education", "productivity"],
    icons: [
      { src: withBasePath("/icons/icon.svg"), sizes: "any", type: "image/svg+xml" },
      { src: withBasePath("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: withBasePath("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
      {
        src: withBasePath("/icons/icon-maskable-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
