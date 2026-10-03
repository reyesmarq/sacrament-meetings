import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMeetingById } from "@/lib/meetings-db";
import MeetingDetail from "@/components/MeetingDetail";

export async function generateMetadata(
  props: PageProps<"/meetings/[id]">
): Promise<Metadata> {
  const { id } = await props.params;
  const meeting = getMeetingById(id);
  return {
    title: meeting ? `${meeting.date} | Riverside Ward` : "Meeting not found",
  };
}

export default async function MeetingPage(props: PageProps<"/meetings/[id]">) {
  const { id } = await props.params;
  const meeting = getMeetingById(id);

  if (!meeting) {
    notFound();
  }

  return <MeetingDetail meeting={meeting} />;
}
