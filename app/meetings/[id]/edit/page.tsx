import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMeetingById } from "@/lib/meetings-db";
import { updateMeeting } from "@/lib/actions";
import MeetingForm from "@/components/MeetingForm";
import { requireBishopric } from "@/lib/auth-guard";

export async function generateMetadata(
  props: PageProps<"/meetings/[id]/edit">
): Promise<Metadata> {
  const { id } = await props.params;
  const meeting = getMeetingById(id);
  return {
    title: meeting ? `Edit ${meeting.date} | Riverside Ward` : "Meeting not found",
  };
}

export default async function EditMeetingPage(props: PageProps<"/meetings/[id]/edit">) {
  const { id } = await props.params;
  await requireBishopric(`/login?callbackUrl=/meetings/${id}/edit`);
  const meeting = getMeetingById(id);

  if (!meeting) {
    notFound();
  }

  const updateMeetingWithId = updateMeeting.bind(null, id);

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Edit Meeting</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Update the agenda for this Sunday.
      </p>

      <div className="mt-6">
        <MeetingForm action={updateMeetingWithId} meeting={meeting} mode="edit" />
      </div>
    </section>
  );
}
