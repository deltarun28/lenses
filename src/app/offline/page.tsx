import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offline",
  description: "This page is not available offline.",
};

/** Shown when a page is requested that the service worker cannot answer. */
export default function OfflinePage() {
  return (
    <div className="space-y-4">
      <p className="plate text-accent">Offline</p>
      <h1 className="text-2xl font-semibold tracking-tight">
        This page is not available offline
      </h1>
      <p className="lens-prose text-muted">
        Lenses and its pages are saved on this device after one visit with a
        connection. This address is not part of Lenses, so it needs a connection.
      </p>
      <ul className="space-y-2">
        <li>
          <Link href="/" className="text-accent underline underline-offset-4">
            Today&rsquo;s lens
          </Link>
        </li>
        <li>
          <Link href="/observations" className="text-accent underline underline-offset-4">
            Your observations
          </Link>
        </li>
      </ul>
    </div>
  );
}
