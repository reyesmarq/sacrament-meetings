import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Secure check for Server Actions/pages that mutate meeting data. Proxy.ts
 * only does an optimistic cookie check on page navigation, so mutations need
 * their own check close to the data — a tampered/direct request to a Server
 * Action never runs through proxy.ts at all.
 */
export async function requireBishopric(redirectTo = "/login") {
  const session = await auth();
  if (!session) {
    redirect(redirectTo);
  }
  return session;
}
