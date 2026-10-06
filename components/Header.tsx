import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import SignOutButton from "@/components/SignOutButton";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();

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

        <div className="flex items-center gap-6 text-sm">
          <NavLinks />
          {session ? (
            <SignOutButton />
          ) : (
            <Link href="/login" className="hover:underline underline-offset-4">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
