import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

/**
 * Optimistic check only — reads the session cookie, no database/API call.
 * This is the first line of defense for the management routes; the pages
 * and Server Actions behind them (lib/auth-guard.ts) do the real check,
 * since Proxy doesn't run for direct Server Action requests.
 */
export async function proxy(request: NextRequest) {
  const session = await auth();

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/meetings/new", "/meetings/:id/edit"],
};
