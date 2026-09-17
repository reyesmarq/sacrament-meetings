import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentMeeting } from "@/lib/meetings-db";

// getCurrentMeeting() depends on the real-world date, so this route must be
// evaluated per-request — otherwise Next.js prerenders it once at build time
// and every visitor gets redirected to whatever Sunday was "current" then.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "This Sunday | Riverside Ward",
};

export default function CurrentMeetingPage() {
  const meeting = getCurrentMeeting();

  if (!meeting) {
    redirect("/meetings");
  }

  redirect(`/meetings/${meeting.id}`);
}
