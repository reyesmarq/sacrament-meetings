import type { Metadata } from "next";
import { getAllMeetings } from "@/lib/meetings-db";
import MeetingCard from "@/components/MeetingCard";

export const metadata: Metadata = {
  title: "All Meetings | Riverside Ward",
};

export default function MeetingsPage() {
  const meetings = [...getAllMeetings()].reverse();

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">All Meetings</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Most recent meetings first. Select a Sunday to view its full agenda.
      </p>

      <div className="mt-6 space-y-3">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </section>
  );
}
