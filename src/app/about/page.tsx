import type { Metadata } from "next";
import { lensRepository } from "@/repositories/content/filesystem-lens-repository";

export const metadata: Metadata = {
  title: "About",
  description: "What this app is, and what it deliberately does not do.",
};

export default async function AboutPage() {
  const lenses = await lensRepository.listPublishedSummaries();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="text-muted text-sm">A field manual, not a course.</p>
      </header>

      <section className="lens-prose space-y-4">
        <p>
          One thinking lens each day. Each is a tool for looking at a problem: what it
          says, why it holds, and what it looks like in practice.
        </p>
        <p>
          Each lens includes one or more worked examples from military strategy,
          leadership and organisational decision-making, or building products and
          businesses. The same idea seen in different settings is easier to recognise in a
          fourth.
        </p>
        <p>
          Day 1 is the day you install the app. You can move to any day, and the library
          is open from the start — nothing is locked.
        </p>
      </section>

      <section aria-labelledby="not-heading" className="space-y-3">
        <h2 id="not-heading" className="plate text-muted">
          What this does not do
        </h2>
        <ul className="lens-prose space-y-2">
          <li>No accounts, and no sign-up.</li>
          <li>No streaks, points, badges or notifications.</li>
          <li>No tracking of what you read.</li>
        </ul>
      </section>

      <section aria-labelledby="storage-heading" className="space-y-3">
        <h2 id="storage-heading" className="plate text-muted">
          Where your notes live
        </h2>
        <p className="lens-prose">
          Observations are saved in this browser on this device. They are not sent
          anywhere, which also means they are not backed up: clearing site data removes
          them, and they do not follow you to another device. Sync is not part of this
          version.
        </p>
      </section>

      <section aria-labelledby="library-heading" className="space-y-3">
        <h2 id="library-heading" className="plate text-muted">
          Current library
        </h2>
        <p className="lens-prose">
          {lenses.length} published lenses. After the last one, the sequence begins again.
        </p>
      </section>
    </div>
  );
}
