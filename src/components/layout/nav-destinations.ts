/** The four primary destinations. Adding a fifth is out of scope for the MVP. */
export const NAV_DESTINATIONS = [
  { href: "/", label: "Today" },
  { href: "/library", label: "Library" },
  { href: "/observations", label: "Observations" },
  { href: "/about", label: "About" },
] as const;

export type NavDestination = (typeof NAV_DESTINATIONS)[number];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
