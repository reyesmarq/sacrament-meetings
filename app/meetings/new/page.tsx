import type { Metadata } from "next";
import MeetingForm from "@/components/MeetingForm";
import { createMeeting } from "@/lib/actions";
import { requireBishopric } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "New Meeting | Riverside Ward",
};

export default async function NewMeetingPage() {
  await requireBishopric("/login?callbackUrl=/meetings/new");

  return (
    <section>
      <h1 className="text-2xl font-semibold tracking-tight">Plan a New Meeting</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Fill out the agenda below. Fields marked required must be completed before saving.
      </p>

      <div className="mt-6">
        <MeetingForm action={createMeeting} mode="create" />
      </div>
    </section>
  );
}
