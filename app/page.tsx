import Link from "next/link";
import { getCurrentMeeting } from "@/lib/meetings-db";

export default function Home() {
  const current = getCurrentMeeting();

  return (
    <>
      <section>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Sacrament Meeting Planner
        </h1>
        <p className="mt-3 max-w-2xl text-black/70 dark:text-white/70">
          A tool for the Riverside Ward bishopric to plan sacrament meeting
          agendas, and for members to view and print the program for any
          Sunday.
        </p>
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/meetings/current"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/85"
        >
          View this Sunday&rsquo;s program
        </Link>
        <Link
          href="/meetings"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Browse all meetings
        </Link>
      </section>

      {current && (
        <section className="mt-12 rounded-lg border border-black/10 p-5 dark:border-white/15">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
            Coming up
          </h2>
          <p className="mt-2 text-lg font-medium">
            {new Date(`${current.date}T00:00:00`).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Presiding: {current.presiding}
          </p>
        </section>
      )}
    </>
  );
}
