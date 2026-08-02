import Link from "next/link";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="border-rule border-b">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-6 px-5 py-5">
        <Link href="/" className="flex items-baseline gap-2">
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
