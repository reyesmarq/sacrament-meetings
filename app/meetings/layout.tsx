import Link from "next/link";

export default function MeetingsLayout({ children }: LayoutProps<"/meetings">) {
  return (
    <div>
      <Link
        href="/"
        className="print:hidden text-sm text-black/60 hover:underline dark:text-white/60"
      >
        &larr; Back to home
      </Link>
      <div className="mt-4">{children}</div>
    </div>
  );
}
