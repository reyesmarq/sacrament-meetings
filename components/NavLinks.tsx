"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/meetings", label: "All Meetings" },
  { href: "/meetings/current", label: "This Sunday" },
] as const;

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-6 text-sm">
      {LINKS.map(({ href, label }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "font-semibold underline underline-offset-4"
                  : "hover:underline underline-offset-4"
              }
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
