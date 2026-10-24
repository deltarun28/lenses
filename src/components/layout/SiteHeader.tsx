import Link from "next/link";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="border-rule border-b pt-[env(safe-area-inset-top)]">
      <div className="safe-x mx-auto flex max-w-2xl items-center justify-between gap-6 py-1.5 md:py-3">
        <Link href="/" className="flex min-h-11 items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">Lenses</span>
          <span className="plate text-muted hidden sm:inline">Field manual</span>
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <NavLinks />
        </nav>
      </div>
    </header>
  );
}
