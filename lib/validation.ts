import { z } from "zod";
import type { MeetingType } from "@/lib/types";

export const MEETING_TYPES: readonly MeetingType[] = [
  "regular",
  "testimony",
  "stake",
  "general",
] as const;

function linesToList(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function linesToPairs(value: unknown): { first: string; second: string }[] {
  return linesToList(value).map((line) => {
    const [first = "", second = ""] = line.split("|").map((part) => part.trim());
    return { first, second };
  });
}

const speakersField = z.preprocess(
  linesToPairs,
  z.array(
    z.object({
      first: z.string().trim().min(1, "Each speaker needs a name."),
      second: z.string().trim().min(1, "Each speaker needs a topic."),
    })
  )
);

const musicalNumbersField = z.preprocess(
  linesToPairs,
  z.array(
    z.object({
      first: z.string().trim().min(1, "Each musical number needs a title."),
      second: z.string().trim().min(1, "Each musical number needs a performer."),
    })
  )
);

export const MeetingFormSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date."),
  type: z.enum(MEETING_TYPES as [MeetingType, ...MeetingType[]], {
    error: "Choose a meeting type.",
  }),
  presiding: z.string().trim().min(1, "Presiding officer is required."),
  conducting: z.string().trim().min(1, "Conducting officer is required."),
  openingHymnTitle: z.string().trim().min(1, "Opening hymn title is required."),
  openingHymnNumber: z.coerce
    .number({ error: "Enter a hymn number (0 if none)." })
    .int("Hymn number must be a whole number.")
    .min(0, "Hymn number can't be negative."),
  openingPrayer: z.string().trim().min(1, "Opening prayer name is required."),
  sacramentHymnTitle: z.string().trim().min(1, "Sacrament hymn title is required."),
  sacramentHymnNumber: z.coerce
    .number({ error: "Enter a hymn number (0 if none)." })
    .int("Hymn number must be a whole number.")
    .min(0, "Hymn number can't be negative."),
  closingHymnTitle: z.string().trim().min(1, "Closing hymn title is required."),
  closingHymnNumber: z.coerce
    .number({ error: "Enter a hymn number (0 if none)." })
    .int("Hymn number must be a whole number.")
    .min(0, "Hymn number can't be negative."),
  closingPrayer: z.string().trim().min(1, "Closing prayer name is required."),
  announcements: z.preprocess(linesToList, z.array(z.string())),
  wardBusiness: z.preprocess(linesToList, z.array(z.string())),
  speakers: speakersField,
  musicalNumbers: musicalNumbersField,
});

export type MeetingFormValues = z.infer<typeof MeetingFormSchema>;

export interface MeetingFormState {
  errors: Partial<Record<keyof MeetingFormValues, string[]>>;
  message: string | null;
  /** Bumped on every failed submission to force the form to remount (see MeetingForm) with `values`. */
  attempt: number;
  /** Raw (pre-validation) field strings from the failed submission, used to repopulate the form. */
  values?: Record<string, string>;
}

export const EMPTY_FORM_STATE: MeetingFormState = { errors: {}, message: null, attempt: 0 };

/** Converts validated form values into the flat shape lib/meetings-db.ts expects. */
export function toMeetingInput(values: MeetingFormValues) {
  return {
    date: values.date,
    type: values.type,
    presiding: values.presiding,
    conducting: values.conducting,
    announcements: values.announcements,
    wardBusiness: values.wardBusiness,
    openingHymn: { title: values.openingHymnTitle, number: values.openingHymnNumber },
    openingPrayer: values.openingPrayer,
    sacramentHymn: { title: values.sacramentHymnTitle, number: values.sacramentHymnNumber },
    speakers: values.speakers.map((s) => ({ name: s.first, topic: s.second })),
    musicalNumbers: values.musicalNumbers.map((m) => ({
      title: m.first,
      performedBy: m.second,
    })),
    closingHymn: { title: values.closingHymnTitle, number: values.closingHymnNumber },
    closingPrayer: values.closingPrayer,
  };
}
