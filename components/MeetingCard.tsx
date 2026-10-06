import Link from "next/link";
import type { Meeting } from "@/lib/types";
import { MEETING_TYPE_LABELS } from "@/lib/types";
import DeleteMeetingForm from "@/components/DeleteMeetingForm";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface MeetingCardProps {
  meeting: Meeting;
  canManage: boolean;
}

export default function MeetingCard({ meeting, canManage }: MeetingCardProps) {
  return (
    <div className="rounded-lg border border-black/10 p-5 transition hover:border-black/30 dark:border-white/15 dark:hover:border-white/40">
      <Link
        href={`/meetings/${meeting.id}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-semibold tracking-tight">{formatDate(meeting.date)}</h3>
          <span className="shrink-0 rounded-full bg-black/5 px-3 py-1 text-xs font-medium dark:bg-white/10">
            {MEETING_TYPE_LABELS[meeting.type]}
          </span>
        </div>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Presiding: {meeting.presiding}
        </p>
      </Link>
      {canManage && (
        <div className="mt-4 flex items-center gap-3 border-t border-black/5 pt-3 dark:border-white/10">
          <Link
            href={`/meetings/${meeting.id}/edit`}
            className="text-sm font-medium hover:underline"
          >
            Edit
          </Link>
          <DeleteMeetingForm id={meeting.id} />
        </div>
      )}
    </div>
  );
}
