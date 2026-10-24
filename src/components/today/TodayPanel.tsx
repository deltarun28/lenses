"use client";

import Link from "next/link";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { DaySetter } from "@/components/today/DaySetter";
import { CategoryTags } from "@/components/ui/CategoryTags";
import { Plate } from "@/components/ui/Plate";
import type { LensSummary } from "@/domain/lenses/lens";
import { formatIsoDate, todayIsoDate } from "@/lib/dates";
import { useClientSnapshot } from "@/lib/use-client-snapshot";
import { readingStateStore } from "@/repositories/reading-state/reading-state-store";
import {
  cycleNumberForDay,
  dayNumberFor,
  itemForDay,
  startDateForDay,
} from "@/services/daily-lens/day-cycle";

/**
 * Resolves the current day in the browser.
 *
 * The lens index is generated at build time; which lens is "today" depends on
 * the device clock and the user's stored start date, so it can only be decided
 * here. Day 1 is the day the app was first opened on this device.
 */
export function TodayPanel({ lenses }: { lenses: LensSummary[] }) {
  const today = useClientSnapshot(todayIsoDate);
  const storedStartDate = useSyncExternalStore(
    readingStateStore.subscribe,
    readingStateStore.getSnapshot,
    readingStateStore.getServerSnapshot,
  );

  // First run on this device: today becomes day 1.
  useEffect(() => {
    if (today && !storedStartDate) {
      readingStateStore.setStartDate(today);
    }
  }, [today, storedStartDate]);

  const handleSetDay = useCallback(
    (day: number) => {
      if (!today) return;
      readingStateStore.setStartDate(startDateForDay(day, today));
    },
    [today],
  );

  if (!today) {
    return <TodayPanelSkeleton count={lenses.length} />;
  }

  const startDate = storedStartDate ?? today;
  const day = dayNumberFor(startDate, today);
  const lens = itemForDay(lenses, day);
  const cycle = cycleNumberForDay(day, lenses.length);

  if (!lens) {
    return (
      <p className="text-muted">
        No published lenses yet. Add a Markdown file to{" "}
        <code className="font-mono text-sm">src/content/lenses/</code> to get started.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <section aria-labelledby="today-heading" className="space-y-5">
        <div className="flex items-baseline justify-between gap-4">
          <h1 id="today-heading" className="plate text-accent">
            Today
          </h1>
          <Plate>{formatIsoDate(today)}</Plate>
        </div>

        <div className="border-rule bg-surface border">
          <div className="border-rule flex items-baseline justify-between border-b px-5 py-3">
            <Plate tone="ink">Day {day.toString().padStart(3, "0")}</Plate>
            {cycle > 1 ? <Plate>Pass {cycle}</Plate> : null}
          </div>

          <div className="space-y-4 px-5 py-6">
            <CategoryTags categories={lens.categories} />
            <h2 className="text-3xl leading-tight font-semibold tracking-tight text-balance">
              {lens.title}
            </h2>
            <p className="lens-prose text-muted">{lens.summary}</p>
            <Plate>{lens.readingMinutes} min read</Plate>
          </div>

          <div className="border-rule flex flex-wrap items-center gap-4 border-t px-5 py-4">
            <Link
              href={`/lenses/${lens.id}`}
              className="bg-accent text-accent-ink inline-flex min-h-11 items-center rounded-sm px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            >
              Read today&rsquo;s lens
            </Link>
            <Link
              href="/library"
              className="text-muted hover:text-ink inline-flex min-h-11 items-center text-sm underline underline-offset-4"
            >
              Browse the library
            </Link>
          </div>
        </div>

        <Plate>{lenses.length} lenses in the library &middot; a new one each day</Plate>
      </section>

      <DaySetter currentDay={day} totalDays={lenses.length} onSetDay={handleSetDay} />
    </div>
  );
}

function TodayPanelSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-5">
      <p className="plate text-accent">Today</p>
      <div className="border-rule bg-surface border" aria-hidden="true">
        <div className="border-rule border-b px-5 py-3">
          <span className="plate text-muted">Day &mdash;&mdash;&mdash;</span>
        </div>
        <div className="space-y-4 px-5 py-6">
          <div className="bg-rule h-3 w-32" />
          <div className="bg-rule h-8 w-3/4" />
          <div className="bg-rule h-4 w-full" />
        </div>
      </div>
      <p className="plate text-muted">{count} lenses in the library</p>
    </div>
  );
}
