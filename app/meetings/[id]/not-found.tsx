import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Meeting not found</h1>
      <p className="mt-2 text-black/70 dark:text-white/70">
        We couldn&rsquo;t find a meeting with that id.
      </p>
      <Link
        href="/meetings"
        className="mt-4 inline-block text-sm hover:underline"
      >
        &larr; Back to all meetings
      </Link>
    </div>
  );
}
