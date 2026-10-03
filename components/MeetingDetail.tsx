import Link from "next/link";
import type { Meeting } from "@/lib/types";
import { MEETING_TYPE_LABELS } from "@/lib/types";
import PrintButton from "@/components/PrintButton";
import DeleteMeetingForm from "@/components/DeleteMeetingForm";

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export interface MeetingDetailProps {
  meeting: Meeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const hasSpeakers = meeting.speakers.length > 0;
  const hasMusicalNumbers = meeting.musicalNumbers.length > 0;
  const hasWardBusiness = meeting.wardBusiness.length > 0;

  return (
    <article>
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-6 dark:border-white/15">
        <div>
          <p className="text-sm font-medium text-black/60 dark:text-white/60">
            {MEETING_TYPE_LABELS[meeting.type]}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            {formatDate(meeting.date)}
          </h1>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-black/70 dark:text-white/70">
            <dt className="font-medium">Presiding</dt>
            <dd>{meeting.presiding}</dd>
            <dt className="font-medium">Conducting</dt>
            <dd>{meeting.conducting}</dd>
          </dl>
        </div>
        <div className="print:hidden flex items-center gap-3">
          <Link
            href={`/meetings/${meeting.id}/edit`}
            className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/20 dark:hover:bg-white/10 dark:focus-visible:outline-white"
          >
            Edit
          </Link>
          <DeleteMeetingForm id={meeting.id} />
          <PrintButton />
        </div>
      </header>

      {meeting.announcements.length > 0 && (
        <Section title="Announcements">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {meeting.announcements.map((announcement) => (
              <li key={announcement}>{announcement}</li>
            ))}
          </ul>
        </Section>
      )}

      {hasWardBusiness && (
        <Section title="Ward Business">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {meeting.wardBusiness.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Opening">
        <p className="text-sm">
          Hymn: {meeting.openingHymn.title}
          {meeting.openingHymn.number > 0 ? ` (No. ${meeting.openingHymn.number})` : ""}
        </p>
        <p className="text-sm">Prayer: {meeting.openingPrayer}</p>
      </Section>

      <Section title="Sacrament Hymn">
        <p className="text-sm">
          {meeting.sacramentHymn.title}
          {meeting.sacramentHymn.number > 0 ? ` (No. ${meeting.sacramentHymn.number})` : ""}
        </p>
      </Section>

      {hasSpeakers && (
        <Section title="Speakers">
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            {meeting.speakers.map((speaker) => (
              <li key={speaker.name}>
                {speaker.name}
                {speaker.topic ? ` — ${speaker.topic}` : ""}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {hasMusicalNumbers && (
        <Section title="Musical Numbers">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {meeting.musicalNumbers.map((number) => (
              <li key={number.title}>
                {number.title} — {number.performedBy}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Closing">
        <p className="text-sm">
          Hymn: {meeting.closingHymn.title}
          {meeting.closingHymn.number > 0 ? ` (No. ${meeting.closingHymn.number})` : ""}
        </p>
        <p className="text-sm">Prayer: {meeting.closingPrayer}</p>
      </Section>
    </article>
  );
}
