"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV_DESTINATIONS, isActivePath } from "./nav-destinations";

/** Mobile navigation. Fixed to the bottom edge, within thumb reach. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="border-rule bg-surface fixed inset-x-0 bottom-0 z-20 border-t md:hidden"
    >
      <ul className="mx-auto flex max-w-2xl">
        {NAV_DESTINATIONS.map((destination) => {
          const active = isActivePath(pathname, destination.href);
          return (
            <li key={destination.href} className="flex-1">
              <Link
                href={destination.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "plate flex flex-col items-center gap-1 py-3 transition-colors",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 w-6 rounded-full",
                    active ? "bg-accent" : "bg-rule",
                  )}
                />
                {destination.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
