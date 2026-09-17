# sacrament-meetings

Sacrament Meeting Planner for the Riverside Ward — WDD 430 Week 2 assignment.
Lets the bishopric plan sacrament meeting agendas and lets members view and
print the program for any Sunday.

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Structure

```
app/
  layout.tsx              Root layout — Header, Footer, page chrome
  page.tsx                Landing page — links out + "coming up" preview
  api/meetings/route.ts          GET all meetings, optional ?date= filter
  api/meetings/[id]/route.ts     GET one meeting — 400 invalid id, 404 missing
  meetings/layout.tsx     Shared "back to home" chrome for the meetings section
  meetings/loading.tsx    Route-level loading skeleton
  meetings/page.tsx       List all meetings, newest first
  meetings/[id]/page.tsx  Full agenda for one meeting
  meetings/[id]/not-found.tsx  Shown when an id doesn't match any meeting
  meetings/current/page.tsx    Redirects to the nearest upcoming Sunday
lib/
  types.ts          Meeting, Hymn, Speaker, MusicalNumber types
  meetings-db.ts    In-memory data + getAllMeetings/getMeetingById/getCurrentMeeting
components/
  Header.tsx, Footer.tsx, NavLinks.tsx   Site chrome
  MeetingCard.tsx     Summary card used in the meetings list
  MeetingDetail.tsx   Full agenda layout used on the detail page
  PrintButton.tsx     Client component wrapping window.print()
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

Used Claude Code to scaffold the project structure, generate the in-memory
data module and sample meeting data, write the API routes and page
components, and to run/verify the app end-to-end (`npm run lint`,
`npm run build`, and manual `curl` checks of every route including edge
cases like malformed ids and the current-Sunday redirect). That manual
verification pass is what surfaced the two issues described above.
