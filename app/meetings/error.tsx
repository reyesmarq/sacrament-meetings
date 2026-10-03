"use client";

import { useEffect } from "react";

export default function MeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" aria-live="polite" className="rounded-lg border border-red-600/20 bg-red-50 p-6 dark:border-red-400/20 dark:bg-red-950/30">
      <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">
        Something went wrong
      </h2>
      <p className="mt-2 text-sm text-red-700 dark:text-red-300">
        {error.message || "An unexpected error occurred while loading meetings."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-md border border-red-600/30 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-red-400/30 dark:text-red-300 dark:hover:bg-red-950/50"
      >
        Try Again
      </button>
    </div>
  );
}
