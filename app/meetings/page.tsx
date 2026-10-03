import type { Metadata } from "next";
import Link from "next/link";
import { getAllMeetings } from "@/lib/meetings-db";
import MeetingCard from "@/components/MeetingCard";

export const metadata: Metadata = {
  title: "All Meetings | Riverside Ward",
};

export default function MeetingsPage() {
  const meetings = [...getAllMeetings()].reverse();

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Meetings</h1>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">
            Most recent meetings first. Select a Sunday to view its full agenda.
          </p>
        </div>
        <Link
          href="/meetings/new"
          className="shrink-0 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          + New Meeting
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </section>
  );
}
