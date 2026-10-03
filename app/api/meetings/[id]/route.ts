import { NextResponse } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";
import type { Meeting } from "@/lib/types";

const ID_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface ErrorBody {
  error: string;
}

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/meetings/[id]">
): Promise<NextResponse<Meeting | ErrorBody>> {
  const { id } = await ctx.params;

  if (!ID_PATTERN.test(id)) {
    return NextResponse.json(
      { error: `Invalid meeting id "${id}". Expected format: YYYY-MM-DD.` },
      { status: 400 }
    );
  }

  const meeting = getMeetingById(id);

  if (!meeting) {
    return NextResponse.json(
      { error: `No meeting found with id "${id}".` },
      { status: 404 }
    );
  }

  return NextResponse.json(meeting);
}
