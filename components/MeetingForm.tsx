"use client";

import { useActionState } from "react";
import type { Meeting } from "@/lib/types";
import { MEETING_TYPES } from "@/lib/validation";
import { MEETING_TYPE_LABELS } from "@/lib/types";
import type { MeetingFormState } from "@/lib/validation";
import { EMPTY_FORM_STATE } from "@/lib/validation";

type MeetingAction = (
  state: MeetingFormState,
  formData: FormData
) => Promise<MeetingFormState>;

export interface MeetingFormProps {
  action: MeetingAction;
  meeting?: Meeting;
  mode: "create" | "edit";
}

function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p id={id} role="alert" aria-live="polite" className="mt-1 text-sm text-red-600 dark:text-red-400">
      {errors.join(" ")}
    </p>
  );
}

function labelClass() {
  return "block text-sm font-medium text-black/80 dark:text-white/80";
}

function inputClass() {
  return "mt-1 w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/20 dark:focus-visible:outline-white";
}

export default function MeetingForm({ action, meeting, mode }: MeetingFormProps) {
  const [state, formAction, pending] = useActionState(action, EMPTY_FORM_STATE);
  const errors = state.errors;
  const submitted = state.values;

  // React clears uncontrolled form fields after every action submission, so
  // on a failed attempt we repopulate from what was actually typed
  // (`submitted`) rather than letting the whole form go blank. The `key`
  // below forces a remount so these new defaultValues actually take effect.
  const defaults = {
    date: submitted?.date ?? meeting?.date ?? "",
    type: submitted?.type ?? meeting?.type ?? "regular",
    presiding: submitted?.presiding ?? meeting?.presiding ?? "",
    conducting: submitted?.conducting ?? meeting?.conducting ?? "",
    openingHymnTitle: submitted?.openingHymnTitle ?? meeting?.openingHymn.title ?? "",
    openingHymnNumber: submitted?.openingHymnNumber ?? String(meeting?.openingHymn.number ?? 0),
    openingPrayer: submitted?.openingPrayer ?? meeting?.openingPrayer ?? "",
    sacramentHymnTitle: submitted?.sacramentHymnTitle ?? meeting?.sacramentHymn.title ?? "",
    sacramentHymnNumber:
      submitted?.sacramentHymnNumber ?? String(meeting?.sacramentHymn.number ?? 0),
    closingHymnTitle: submitted?.closingHymnTitle ?? meeting?.closingHymn.title ?? "",
    closingHymnNumber: submitted?.closingHymnNumber ?? String(meeting?.closingHymn.number ?? 0),
    closingPrayer: submitted?.closingPrayer ?? meeting?.closingPrayer ?? "",
    announcements: submitted?.announcements ?? meeting?.announcements.join("\n") ?? "",
    wardBusiness: submitted?.wardBusiness ?? meeting?.wardBusiness.join("\n") ?? "",
    speakers:
      submitted?.speakers ??
      meeting?.speakers.map((s) => `${s.name} | ${s.topic}`).join("\n") ??
      "",
    musicalNumbers:
      submitted?.musicalNumbers ??
      meeting?.musicalNumbers.map((m) => `${m.title} | ${m.performedBy}`).join("\n") ??
      "",
  };

  return (
    <form key={state.attempt} action={formAction} className="space-y-6" noValidate>
      {state.message && (
        <p role="alert" aria-live="polite" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClass()}>
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            readOnly={mode === "edit"}
            aria-readonly={mode === "edit"}
            defaultValue={defaults.date}
            aria-describedby={errors?.date ? "date-error" : undefined}
            className={`${inputClass()} ${mode === "edit" ? "opacity-60" : ""}`}
          />
          {mode === "edit" && (
            <p className="mt-1 text-xs text-black/50 dark:text-white/50">
              The date can&rsquo;t be changed after a meeting is created.
            </p>
          )}
          <FieldErrors id="date-error" errors={errors?.date} />
        </div>

        <div>
          <label htmlFor="type" className={labelClass()}>
            Meeting type
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={defaults.type}
            aria-describedby={errors?.type ? "type-error" : undefined}
            className={inputClass()}
          >
            {MEETING_TYPES.map((type) => (
              <option key={type} value={type}>
                {MEETING_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          <FieldErrors id="type-error" errors={errors?.type} />
        </div>

        <div>
          <label htmlFor="presiding" className={labelClass()}>
            Presiding
          </label>
          <input
            id="presiding"
            name="presiding"
            type="text"
            required
            defaultValue={defaults.presiding}
            aria-describedby={errors?.presiding ? "presiding-error" : undefined}
            className={inputClass()}
          />
          <FieldErrors id="presiding-error" errors={errors?.presiding} />
        </div>

        <div>
          <label htmlFor="conducting" className={labelClass()}>
            Conducting
          </label>
          <input
            id="conducting"
            name="conducting"
            type="text"
            required
            defaultValue={defaults.conducting}
            aria-describedby={errors?.conducting ? "conducting-error" : undefined}
            className={inputClass()}
          />
          <FieldErrors id="conducting-error" errors={errors?.conducting} />
        </div>
      </div>

      <fieldset className="space-y-4 border-t border-black/10 pt-4 dark:border-white/15">
        <legend className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Opening
        </legend>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="openingHymnTitle" className={labelClass()}>
              Opening hymn title
            </label>
            <input
              id="openingHymnTitle"
              name="openingHymnTitle"
              type="text"
              required
              defaultValue={defaults.openingHymnTitle}
              aria-describedby={errors?.openingHymnTitle ? "openingHymnTitle-error" : undefined}
              className={inputClass()}
            />
            <FieldErrors id="openingHymnTitle-error" errors={errors?.openingHymnTitle} />
          </div>
          <div>
            <label htmlFor="openingHymnNumber" className={labelClass()}>
              No.
            </label>
            <input
              id="openingHymnNumber"
              name="openingHymnNumber"
              type="number"
              min={0}
              required
              defaultValue={defaults.openingHymnNumber}
              aria-describedby={errors?.openingHymnNumber ? "openingHymnNumber-error" : undefined}
              className={`${inputClass()} w-24`}
            />
            <FieldErrors id="openingHymnNumber-error" errors={errors?.openingHymnNumber} />
          </div>
        </div>
        <div>
          <label htmlFor="openingPrayer" className={labelClass()}>
            Opening prayer
          </label>
          <input
            id="openingPrayer"
            name="openingPrayer"
            type="text"
            required
            defaultValue={defaults.openingPrayer}
            aria-describedby={errors?.openingPrayer ? "openingPrayer-error" : undefined}
            className={inputClass()}
          />
          <FieldErrors id="openingPrayer-error" errors={errors?.openingPrayer} />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-t border-black/10 pt-4 dark:border-white/15">
        <legend className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Sacrament hymn
        </legend>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="sacramentHymnTitle" className={labelClass()}>
              Title
            </label>
            <input
              id="sacramentHymnTitle"
              name="sacramentHymnTitle"
              type="text"
              required
              defaultValue={defaults.sacramentHymnTitle}
              aria-describedby={errors?.sacramentHymnTitle ? "sacramentHymnTitle-error" : undefined}
              className={inputClass()}
            />
            <FieldErrors id="sacramentHymnTitle-error" errors={errors?.sacramentHymnTitle} />
          </div>
          <div>
            <label htmlFor="sacramentHymnNumber" className={labelClass()}>
              No.
            </label>
            <input
              id="sacramentHymnNumber"
              name="sacramentHymnNumber"
              type="number"
              min={0}
              required
              defaultValue={defaults.sacramentHymnNumber}
              aria-describedby={errors?.sacramentHymnNumber ? "sacramentHymnNumber-error" : undefined}
              className={`${inputClass()} w-24`}
            />
            <FieldErrors id="sacramentHymnNumber-error" errors={errors?.sacramentHymnNumber} />
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="speakers" className={labelClass()}>
          Speakers
        </label>
        <p className="mt-1 text-xs text-black/50 dark:text-white/50">
          One per line, formatted as <code>Name | Topic</code>. Leave blank if none.
        </p>
        <textarea
          id="speakers"
          name="speakers"
          rows={3}
          defaultValue={defaults.speakers}
          aria-describedby={errors?.speakers ? "speakers-error" : undefined}
          className={inputClass()}
        />
        <FieldErrors id="speakers-error" errors={errors?.speakers} />
      </div>

      <div>
        <label htmlFor="musicalNumbers" className={labelClass()}>
          Musical numbers
        </label>
        <p className="mt-1 text-xs text-black/50 dark:text-white/50">
          One per line, formatted as <code>Title | Performed by</code>. Leave blank if none.
        </p>
        <textarea
          id="musicalNumbers"
          name="musicalNumbers"
          rows={3}
          defaultValue={defaults.musicalNumbers}
          aria-describedby={errors?.musicalNumbers ? "musicalNumbers-error" : undefined}
          className={inputClass()}
        />
        <FieldErrors id="musicalNumbers-error" errors={errors?.musicalNumbers} />
      </div>

      <div>
        <label htmlFor="announcements" className={labelClass()}>
          Announcements
        </label>
        <p className="mt-1 text-xs text-black/50 dark:text-white/50">
          One per line. Leave blank if none.
        </p>
        <textarea
          id="announcements"
          name="announcements"
          rows={3}
          defaultValue={defaults.announcements}
          aria-describedby={errors?.announcements ? "announcements-error" : undefined}
          className={inputClass()}
        />
        <FieldErrors id="announcements-error" errors={errors?.announcements} />
      </div>

      <div>
        <label htmlFor="wardBusiness" className={labelClass()}>
          Ward business
        </label>
        <p className="mt-1 text-xs text-black/50 dark:text-white/50">
          One per line (releases, sustainings, baby blessings). Leave blank if none.
        </p>
        <textarea
          id="wardBusiness"
          name="wardBusiness"
          rows={3}
          defaultValue={defaults.wardBusiness}
          aria-describedby={errors?.wardBusiness ? "wardBusiness-error" : undefined}
          className={inputClass()}
        />
        <FieldErrors id="wardBusiness-error" errors={errors?.wardBusiness} />
      </div>

      <fieldset className="space-y-4 border-t border-black/10 pt-4 dark:border-white/15">
        <legend className="text-sm font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
          Closing
        </legend>
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label htmlFor="closingHymnTitle" className={labelClass()}>
              Closing hymn title
            </label>
            <input
              id="closingHymnTitle"
              name="closingHymnTitle"
              type="text"
              required
              defaultValue={defaults.closingHymnTitle}
              aria-describedby={errors?.closingHymnTitle ? "closingHymnTitle-error" : undefined}
              className={inputClass()}
            />
            <FieldErrors id="closingHymnTitle-error" errors={errors?.closingHymnTitle} />
          </div>
          <div>
            <label htmlFor="closingHymnNumber" className={labelClass()}>
              No.
            </label>
            <input
              id="closingHymnNumber"
              name="closingHymnNumber"
              type="number"
              min={0}
              required
              defaultValue={defaults.closingHymnNumber}
              aria-describedby={errors?.closingHymnNumber ? "closingHymnNumber-error" : undefined}
              className={`${inputClass()} w-24`}
            />
            <FieldErrors id="closingHymnNumber-error" errors={errors?.closingHymnNumber} />
          </div>
        </div>
        <div>
          <label htmlFor="closingPrayer" className={labelClass()}>
            Closing prayer
          </label>
          <input
            id="closingPrayer"
            name="closingPrayer"
            type="text"
            required
            defaultValue={defaults.closingPrayer}
            aria-describedby={errors?.closingPrayer ? "closingPrayer-error" : undefined}
            className={inputClass()}
          />
          <FieldErrors id="closingPrayer-error" errors={errors?.closingPrayer} />
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {pending ? "Saving..." : mode === "create" ? "Create meeting" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
