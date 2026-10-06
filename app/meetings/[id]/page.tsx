import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMeetingById } from "@/lib/meetings-db";
import MeetingDetail from "@/components/MeetingDetail";
import { auth } from "@/auth";

export async function generateMetadata(
  props: PageProps<"/meetings/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const meeting = getMeetingById(id);
  return {
    title: meeting ? `${meeting.date} | Riverside Ward` : "Meeting not found",
    description: meeting
      ? `Full sacrament meeting program for ${meeting.date}: hymns, speakers, and musical numbers.`
      : "This meeting could not be found.",
  };
}

export default async function MeetingPage(props: PageProps<"/meetings/[id]">) {
  const { id } = await props.params;
  const meeting = getMeetingById(id);

  if (!meeting) {
    notFound();
  }

  const session = await auth();

  return <MeetingDetail meeting={meeting} canManage={Boolean(session)} />;
}
