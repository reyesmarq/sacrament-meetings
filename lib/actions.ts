"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createMeetingRecord,
  deleteMeetingRecord,
  getMeetingById,
  updateMeetingRecord,
} from "@/lib/meetings-db";
import {
  MeetingFormSchema,
  toMeetingInput,
  type MeetingFormState,
} from "@/lib/validation";
import { requireBishopric } from "@/lib/auth-guard";

const FORM_FIELD_NAMES = [
  "date",
  "type",
  "presiding",
  "conducting",
  "openingHymnTitle",
  "openingHymnNumber",
  "openingPrayer",
  "sacramentHymnTitle",
  "sacramentHymnNumber",
  "closingHymnTitle",
  "closingHymnNumber",
  "closingPrayer",
  "announcements",
  "wardBusiness",
  "speakers",
  "musicalNumbers",
] as const;

/**
 * React resets uncontrolled form fields after every action submission
 * (success or failure), so on a validation error we hand back exactly what
 * the user typed and force a remount (see the `key={state.attempt}` on the
 * <form> in MeetingForm) to repopulate the fields instead of wiping them.
 */
function rawFormValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const name of FORM_FIELD_NAMES) {
    const value = formData.get(name);
    values[name] = typeof value === "string" ? value : "";
  }
  return values;
}

function parseMeetingForm(
  prevState: MeetingFormState,
  formData: FormData
): MeetingFormState | ReturnType<typeof toMeetingInput> {
  const validatedFields = MeetingFormSchema.safeParse({
    date: formData.get("date"),
    type: formData.get("type"),
    presiding: formData.get("presiding"),
    conducting: formData.get("conducting"),
    openingHymnTitle: formData.get("openingHymnTitle"),
    openingHymnNumber: formData.get("openingHymnNumber"),
    openingPrayer: formData.get("openingPrayer"),
    sacramentHymnTitle: formData.get("sacramentHymnTitle"),
    sacramentHymnNumber: formData.get("sacramentHymnNumber"),
    closingHymnTitle: formData.get("closingHymnTitle"),
    closingHymnNumber: formData.get("closingHymnNumber"),
    closingPrayer: formData.get("closingPrayer"),
    announcements: formData.get("announcements"),
    wardBusiness: formData.get("wardBusiness"),
    speakers: formData.get("speakers"),
    musicalNumbers: formData.get("musicalNumbers"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
      attempt: prevState.attempt + 1,
      values: rawFormValues(formData),
    };
  }

  return toMeetingInput(validatedFields.data);
}

function isFormState(
  value: MeetingFormState | ReturnType<typeof toMeetingInput>
): value is MeetingFormState {
  return "errors" in value;
}

export async function createMeeting(
  prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  await requireBishopric();

  const parsed = parseMeetingForm(prevState, formData);
  if (isFormState(parsed)) {
    return parsed;
  }

  try {
    createMeetingRecord(parsed.date, parsed);
  } catch (error) {
    return {
      errors: {},
      message: error instanceof Error ? error.message : "Unable to save this meeting.",
      attempt: prevState.attempt + 1,
      values: rawFormValues(formData),
    };
  }

  revalidatePath("/meetings");
  redirect("/meetings");
}

export async function updateMeeting(
  id: string,
  prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  await requireBishopric();

  const parsed = parseMeetingForm(prevState, formData);
  if (isFormState(parsed)) {
    return parsed;
  }

  // A meeting's id *is* its date (see lib/types.ts), so the date can't move
  // without becoming a different record. The edit form renders this field
  // read-only, but a tampered request could still submit a different value —
  // pin it to the trusted route id rather than trusting the form body.
  parsed.date = id;

  try {
    updateMeetingRecord(id, parsed);
  } catch (error) {
    return {
      errors: {},
      message: error instanceof Error ? error.message : "Unable to update this meeting.",
      attempt: prevState.attempt + 1,
      values: rawFormValues(formData),
    };
  }

  revalidatePath("/meetings");
  revalidatePath(`/meetings/${id}`);
  redirect(`/meetings/${id}`);
}

export async function deleteMeeting(id: string): Promise<void> {
  await requireBishopric();

  if (!getMeetingById(id)) {
    throw new Error(`No meeting found with id "${id}".`);
  }

  deleteMeetingRecord(id);
  revalidatePath("/meetings");
  redirect("/meetings");
}
