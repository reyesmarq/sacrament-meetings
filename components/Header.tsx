import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";

export default function Header() {
  return (
    <header className="print:hidden border-b border-black/10 dark:border-white/15">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4"
      >
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Image
            src="/chapel-icon.svg"
            alt=""
            width={28}
            height={28}
            className="text-black/70 dark:text-white/80"
          />
          Riverside Ward
        </Link>

        <NavLinks />
      </nav>
    </header>
  );
}
