# sacrament-meetings

Sacrament Meeting Planner for the Riverside Ward — WDD 430 Week 2 assignment.
Lets the bishopric plan sacrament meeting agendas and lets members view and
print the program for any Sunday.

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- SQLite (`better-sqlite3`) for storage, Zod for form validation

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Structure

```
app/
  layout.tsx              Root layout — Header, Footer, page chrome, site metadata + metadataBase
  opengraph-image.tsx     Generated OG image (next/og) shared by every route that doesn't override it
  page.tsx                Landing page — links out + "coming up" preview
  login/page.tsx          Bishopric sign-in form, honors ?callbackUrl=
  api/auth/[...nextauth]/route.ts  Auth.js route handler (GET/POST)
  api/meetings/route.ts          GET all meetings, optional ?date= filter
  api/meetings/[id]/route.ts     GET one meeting — 400 invalid id, 404 missing
  meetings/layout.tsx     Shared "back to home" chrome for the meetings section
  meetings/loading.tsx    Route-level loading skeleton
  meetings/error.tsx      Error boundary for the /meetings section — "Try Again" button
  meetings/page.tsx       List all meetings, newest first, + "New Meeting" entry point (bishopric only)
  meetings/new/page.tsx   Create-meeting form — protected, redirects to /login if signed out
  meetings/[id]/page.tsx  Full agenda for one meeting, with Edit/Delete actions (bishopric only)
  meetings/[id]/not-found.tsx  Shown when an id doesn't match any meeting
  meetings/[id]/edit/page.tsx       Edit-meeting form — protected, 404s via notFound() if missing
  meetings/[id]/edit/not-found.tsx  Dedicated "can't edit" message for a missing id
  meetings/current/page.tsx    Redirects to the nearest upcoming Sunday
auth.ts                  Auth.js (NextAuth v5) config — Credentials provider, /login as the sign-in page
proxy.ts                 Optimistic redirect-to-login for /meetings/new and /meetings/[id]/edit
lib/
  types.ts            Meeting, Hymn, Speaker, MusicalNumber types
  db.ts               SQLite connection (seeds itself from seed-meetings.ts on first run)
  seed-meetings.ts     One-time seed data loaded into SQLite
  meetings-db.ts      getAllMeetings/getMeetingById/getCurrentMeeting + create/update/delete, all backed by real SQL
  validation.ts        Zod MeetingFormSchema + MeetingFormState shape shared by the form and actions
  actions.ts           'use server' createMeeting/updateMeeting/deleteMeeting Server Actions
  auth-guard.ts         requireBishopric() — secure session check used by protected pages + actions
  auth-actions.ts       'use server' authenticate/signOutAction wrapping Auth.js signIn/signOut
components/
  Header.tsx, Footer.tsx, NavLinks.tsx   Site chrome
  SignInForm.tsx, SignOutButton.tsx      Auth UI — useActionState form / plain Server Action form
  MeetingCard.tsx       Summary card used in the meetings list, + Edit/Delete (canManage prop)
  MeetingDetail.tsx     Full agenda layout used on the detail page, + Edit/Delete (canManage prop)
  MeetingForm.tsx       Shared create/edit form — useActionState, inline field errors
  DeleteMeetingForm.tsx Small form + confirm() wrapping the delete Server Action
  PrintButton.tsx       Client component wrapping window.print()
```

## API

```bash
curl http://localhost:3000/api/meetings
curl "http://localhost:3000/api/meetings?date=2026-09-20"
curl http://localhost:3000/api/meetings/2026-09-20   # 200
curl http://localhost:3000/api/meetings/bad-id       # 400 — malformed id
curl http://localhost:3000/api/meetings/2099-01-01   # 404 — well-formed, not found
```

## Printing

The meeting detail page has a "Print program" button. Header, footer, and
that button are hidden in print via Tailwind's `print:` variant so only the
agenda prints.

## Week 04: mutations, error handling, accessible forms

Built on top of Week 03's read-only planner:

- **Server Actions** (`lib/actions.ts`): `createMeeting`, `updateMeeting`, `deleteMeeting`, all `'use server'`, validating with a shared Zod schema (`lib/validation.ts`) before touching the database.
- **Real SQL** (`lib/db.ts`, `lib/meetings-db.ts`): the in-memory array from Week 03 is gone. Data now lives in SQLite via `better-sqlite3`, seeded once from `lib/seed-meetings.ts`. All queries/mutations are wrapped in `try/catch`, logging the real error server-side and throwing a user-facing message.
- **Error handling**: `app/meetings/error.tsx` catches uncaught exceptions in the meetings section with a "Try Again" button; `notFound()` + a dedicated `app/meetings/[id]/edit/not-found.tsx` handle editing a meeting that doesn't exist (separate from the existing view-page 404).
- **Accessible forms** (`components/MeetingForm.tsx`): every input has a matching `<label htmlFor>`, `aria-describedby` points at its error message, and error containers use `role="alert"`/`aria-live="polite"`. The form is a Client Component driven by `useActionState`.

### SQLite trade-off on Vercel

Vercel's serverless filesystem is read-only except `/tmp`, and `/tmp` isn't shared across instances or persisted across deployments. `lib/db.ts` points at `/tmp/meetings.db` in production, so writes work within a given warm instance but aren't durable long-term. A hosted database (Vercel Postgres, etc.) would be the real fix; for this assignment, the goal was exercising genuine SQL + Server Actions end-to-end rather than standing up new infrastructure, and that trade-off was made explicitly rather than silently.

### Bug found while testing: React resets uncontrolled form fields after every action

While clicking through the create flow, submitting an invalid form (e.g. a whitespace-only "Presiding" field, which passes the HTML `required` check but fails server-side `trim().min(1)`) wiped every field in the form back to blank — not just the invalid one. This isn't a Next.js caching quirk; React's `<form action={...}>` resets uncontrolled fields after any action call completes, success or failure.

Fixed by having the failing action return the raw submitted `FormData` alongside the field errors (`MeetingFormState.values`), and keying the `<form>` on an `attempt` counter that increments on every failed submission. The new key forces React to remount the form with fresh `defaultValue`s pulled from what the user actually typed, so a validation error no longer costs them their work. Caught by actually clicking through the feature in a browser (via the `playwright-cli` driver), not by `npm run build`/`lint` alone — both passed the whole time this bug was present.

### Peer review fix: timezone bug in `getCurrentMeeting`

Week 03's peer review flagged that `getCurrentMeeting()` compared dates using `referenceDate.toISOString().slice(0, 10)`, which converts to UTC first and can roll the calendar date backward or forward on a server running in a non-UTC timezone. Fixed in `lib/meetings-db.ts` to build the date string from the server's local `getFullYear()`/`getMonth()`/`getDate()` instead.

## Reflection

### Architectural decision: pages call the data layer directly instead of fetching the API route

`app/meetings/page.tsx` and `app/meetings/[id]/page.tsx` import `getAllMeetings`
/ `getMeetingById` from `lib/meetings-db.ts` directly rather than fetching
`/api/meetings` from the server component. The alternative — having every
page `fetch()` its own API route — is a common pattern when the API is the
real boundary (e.g. a separate backend, or the routes need to be consumed by
a mobile client too). I considered it because the assignment explicitly asks
for API routes, and self-fetching would exercise them from the UI.

I went with direct data-layer calls instead: in the App Router, Server
Components already run on the server, so routing a request through `fetch`
back to your own API on the same server adds a network hop (even if
short-circuited to localhost) for no benefit — no serialization boundary is
being crossed that requires it. The API routes still exist and are fully
functional (used by `curl`/external clients, and validated with their own
400/404 handling), they're just not the path the UI takes to read data.
This keeps the UI fast and the data-layer contract in one place
(`lib/meetings-db.ts`), while the API remains a real, independently testable
surface.

### Challenges encountered

The trickiest bug was in `/meetings/current`: `getCurrentMeeting()` reads
`new Date()`, but Next.js's build-time prerendering didn't detect that as
a reason to keep the route dynamic, so it was statically generated once at
build time (confirmed via `x-nextjs-prerender: 1` / `Cache-Control:
s-maxage=31536000` on the response). Every visitor would have been redirected
to whatever Sunday was "current" at build time, forever. Fixed by adding
`export const dynamic = "force-dynamic"` to that page so it's evaluated on
every request.

Separately, requesting a bad id like `/meetings/nonsense` calls `notFound()`
inside a route segment that has a `loading.tsx` above it. Because that
enables streaming (the shell renders and flushes with a 200 before the
inner content resolves), the top-level HTTP status stays 200 even though the
correct "Meeting not found" UI renders. The `/api/meetings/[id]` route isn't
affected — it isn't streamed, so it correctly returns 404 for a well-formed
but missing id and 400 for a malformed one. This is a known trade-off of
streaming SSR in the App Router, not something fixable from the page itself
without giving up the loading state.

### AI usage summary

Week 03: Used Claude Code to scaffold the project structure, generate the
in-memory data module and sample meeting data, write the API routes and page
components, and to run/verify the app end-to-end (`npm run lint`,
`npm run build`, and manual `curl` checks of every route including edge
cases like malformed ids and the current-Sunday redirect). That manual
verification pass is what surfaced the two issues described above.

Week 04: Used Claude Code to read the Next.js 16 docs shipped in
`node_modules/next/dist/docs` (this version has App Router changes from what
the model was trained on — `error.js`'s `retry`/`reset` props, `catchError`,
etc.) before writing anything, then to migrate `lib/meetings-db.ts` to SQLite,
add the Zod schema, Server Actions, accessible form components, and error/404
handling. It also drove the running app end-to-end in a real headless browser
(via the `playwright-cli` tool) to click through create/edit/delete, which is
what surfaced the uncontrolled-form-reset bug described above — `npm run
build`/`lint` stayed green the entire time that bug existed, so the
browser-level check was the only thing that caught it.

## Week 05: authentication and metadata

- **Authentication** ([`auth.ts`](auth.ts)): Auth.js (`next-auth@5`) with a
  single Credentials provider — one shared bishopric login, checked against
  `BISHOPRIC_USERNAME`/`BISHOPRIC_PASSWORD` env vars, no user table or
  password hashing infrastructure for this assignment's scope (see the
  env-var trade-off below). Session is a signed JWT (`AUTH_SECRET`), no
  database adapter.
- **Protected routes**: `/meetings/new` and `/meetings/[id]/edit` are gated
  two ways, per the [Next.js auth guide](node_modules/next/dist/docs/01-app/02-guides/authentication.md)'s
  recommendation not to rely on the proxy alone —
  - `proxy.ts` does an *optimistic* cookie check and redirects to
    `/login?callbackUrl=...` before the page even renders.
  - Each page also calls `requireBishopric()` ([`lib/auth-guard.ts`](lib/auth-guard.ts))
    server-side, and `createMeeting`/`updateMeeting`/`deleteMeeting`
    ([`lib/actions.ts`](lib/actions.ts)) call it too — Server Actions can be
    invoked directly and never go through `proxy.ts`, so they need their own
    check.
  - The Edit/Delete links and the "+ New Meeting" button are also hidden from
    signed-out visitors (`canManage` prop on `MeetingCard`/`MeetingDetail`),
    so the UI doesn't dangle controls a visitor can't use — those are a UX
    nicety on top of the two checks above, not a substitute for them.
- **Metadata**: root `layout.tsx` already had a site-level title/description
  (added Week 02); this week added `metadataBase` (resolved from Vercel's
  `VERCEL_PROJECT_PRODUCTION_URL` so it isn't hardcoded) and an `openGraph`
  block, plus a generated `app/opengraph-image.tsx` (`next/og`) so every page
  gets a real OG image instead of none. Route-specific descriptions were
  added to `/meetings` and `/meetings/[id]` (titles already existed on the
  create/edit pages from Week 03/04).

### Challenge: Next.js 16 renamed `middleware.ts` to `proxy.ts`

This project pins Next.js 16, which is newer than most Auth.js
documentation and tutorials (they still show `middleware.ts`). Checking the
docs bundled in `node_modules/next/dist/docs` before writing anything (per
`AGENTS.md`) showed `middleware.js` is deprecated in 16 — same behavior,
renamed file and export (`proxy.ts`, `export function proxy`). Using the old
filename would have silently done nothing (no error, no redirect) rather
than failing loudly, which would have been a much more confusing bug to
chase down later.

### Trade-off: a single shared credential instead of a user table

The bishopric functionally shares one login for this app (there's no
per-member identity model anywhere else in the schema), so `authorize()`
compares against two env vars rather than adding a `users` table, hashing,
and a signup flow. That mirrors the SQLite trade-off from Week 04: build
what the assignment is actually testing (a working protected route and a
real sign-in/sign-out flow) without standing up infrastructure the app
doesn't otherwise need. `AUTH_SECRET`/`BISHOPRIC_USERNAME`/`BISHOPRIC_PASSWORD`
are documented in `.env.example` and must be set in Vercel's Project
Settings for the deployed app (they're gitignored like all `.env*` files).

### AI usage summary

Used Claude Code for the Week 05 implementation: reading the bundled
Next.js 16 docs first (confirmed the `proxy.ts` rename and the
optimistic-vs-secure auth check guidance), wiring up Auth.js (provider,
route handler, `proxy.ts`, the login page/form, sign-out button), adding the
`requireBishopric()` checks to the protected pages and Server Actions, and
threading the `canManage` prop through the meeting list/detail components.
It also added the OG image and route metadata, then ran `npm run lint` and
`npm run build` and drove the app end-to-end in a real headless browser
(`playwright-cli`): wrong-credentials error message, successful sign-in,
protected-route redirect while signed out with `callbackUrl` preserved,
sign-out, and verified the rendered `<title>`/`<meta name="description">`
tags and the OG image's content type/dimensions via `curl`.
