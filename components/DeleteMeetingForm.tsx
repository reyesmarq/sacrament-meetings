"use client";

import { deleteMeeting } from "@/lib/actions";

export interface DeleteMeetingFormProps {
  id: string;
  className?: string;
}

export default function DeleteMeetingForm({ id, className }: DeleteMeetingFormProps) {
  const deleteWithId = deleteMeeting.bind(null, id);

  return (
    <form
      action={deleteWithId}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the meeting for ${id}? This can't be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className={
          className ??
          "rounded-md border border-red-600/30 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-red-400/30 dark:text-red-400 dark:hover:bg-red-950/30"
        }
      >
        Delete
      </button>
    </form>
  );
}
