"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/auth-actions";

export interface SignInFormProps {
  callbackUrl: string;
}

export default function SignInForm({ callbackUrl }: SignInFormProps) {
  const [error, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={callbackUrl} />

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-black/80 dark:text-white/80"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/20 dark:focus-visible:outline-white"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-black/80 dark:text-white/80"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/20 dark:focus-visible:outline-white"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
