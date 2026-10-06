import { signOutAction } from "@/lib/auth-actions";

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" className="hover:underline underline-offset-4">
        Sign out
      </button>
    </form>
  );
}
