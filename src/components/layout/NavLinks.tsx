"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NAV_DESTINATIONS, isActivePath } from "./nav-destinations";

/** Desktop navigation. Current page is marked for assistive tech, not just colour. */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-6">
      {NAV_DESTINATIONS.map((destination) => {
        const active = isActivePath(pathname, destination.href);
        return (
          <li key={destination.href}>
            <Link
              href={destination.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "plate py-1 transition-colors",
                active ? "text-accent" : "text-muted hover:text-ink",
              )}
            >
              {destination.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
