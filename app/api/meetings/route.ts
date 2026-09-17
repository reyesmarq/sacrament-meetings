import { NextResponse } from "next/server";
import { getAllMeetings } from "@/lib/meetings-db";
import type { Meeting } from "@/lib/types";

export async function GET(request: Request): Promise<NextResponse<Meeting[]>> {
  const date = new URL(request.url).searchParams.get("date") ?? undefined;
  return NextResponse.json(getAllMeetings(date));
}
