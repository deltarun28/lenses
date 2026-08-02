import type { MetadataRoute } from "next";

/**
 * Web app manifest. Served by Next at /manifest.webmanifest and precached by the
 * service worker, so installation metadata is available offline.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lenses — one thinking tool a day",
    short_name: "Lenses",
    description:
      "One practical thinking lens each day, with examples from military strategy, leadership and product building.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#eceee8",
    theme_color: "#175e4c",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
