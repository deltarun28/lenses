import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/layout/BottomNav";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { withBasePath } from "@/lib/base-path";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lenses — one thinking tool a day",
    template: "%s — Lenses",
  },
  description:
    "One practical thinking lens each day, with worked examples from military strategy, leadership and product building.",
  applicationName: "Lenses",
  appleWebApp: {
    capable: true,
    title: "Lenses",
    statusBarStyle: "default",
  },
  // Next prefixes the base path onto the manifest link but not onto icon URLs,
  // so these are prefixed by hand or they 404 on the GitHub Pages project site.
  icons: {
    icon: [
      { url: withBasePath("/icons/icon.svg"), type: "image/svg+xml" },
      { url: withBasePath("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
    ],
    apple: withBasePath("/icons/apple-touch-icon.png"),
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceee8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1211" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <a
          href="#main"
          className="bg-accent text-accent-ink sr-only rounded-sm px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="mx-auto max-w-2xl px-5 py-8 pb-28 md:pb-16">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
