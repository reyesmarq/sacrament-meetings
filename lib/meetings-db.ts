import { getDb } from "@/lib/db";
import type { Meeting } from "@/lib/types";

interface MeetingRow {
  id: string;
  date: string;
  type: Meeting["type"];
  presiding: string;
  conducting: string;
  announcements: string;
  wardBusiness: string;
  openingHymnTitle: string;
  openingHymnNumber: number;
  openingPrayer: string;
  sacramentHymnTitle: string;
  sacramentHymnNumber: number;
  speakers: string;
  musicalNumbers: string;
  closingHymnTitle: string;
  closingHymnNumber: number;
  closingPrayer: string;
}

function rowToMeeting(row: MeetingRow): Meeting {
  return {
    id: row.id,
    date: row.date,
    type: row.type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: JSON.parse(row.announcements),
    wardBusiness: JSON.parse(row.wardBusiness),
    openingHymn: { title: row.openingHymnTitle, number: row.openingHymnNumber },
    openingPrayer: row.openingPrayer,
    sacramentHymn: { title: row.sacramentHymnTitle, number: row.sacramentHymnNumber },
    speakers: JSON.parse(row.speakers),
    musicalNumbers: JSON.parse(row.musicalNumbers),
    closingHymn: { title: row.closingHymnTitle, number: row.closingHymnNumber },
    closingPrayer: row.closingPrayer,
  };
}

/** Input shape accepted by createMeetingRecord/updateMeetingRecord, already validated by the caller. */
export type MeetingInput = Omit<Meeting, "id"> & { id?: string };

export function getAllMeetings(date?: string): Meeting[] {
  try {
    const db = getDb();
    const rows = date
      ? (db.prepare("SELECT * FROM meetings WHERE date = ?").all(date) as MeetingRow[])
      : (db.prepare("SELECT * FROM meetings").all() as MeetingRow[]);
    return rows.map(rowToMeeting).sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("getAllMeetings failed:", error);
    throw new Error("Unable to load meetings right now. Please try again.");
  }
}

export function getMeetingById(id: string): Meeting | undefined {
  try {
    const db = getDb();
    const row = db.prepare("SELECT * FROM meetings WHERE id = ?").get(id) as
      | MeetingRow
      | undefined;
    return row ? rowToMeeting(row) : undefined;
  } catch (error) {
    console.error(`getMeetingById(${id}) failed:`, error);
    throw new Error("Unable to load that meeting right now. Please try again.");
  }
}

/**
 * The meeting the ward is actively planning for: the soonest Sunday that
 * hasn't passed yet, falling back to the most recently held meeting when
 * every stored meeting is in the past. Uses the server's local calendar date
 * (not `toISOString()`, which converts to UTC first and can roll the date
 * back or forward a day on a non-UTC server).
 */
export function getCurrentMeeting(referenceDate: Date = new Date()): Meeting | undefined {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, "0");
  const day = String(referenceDate.getDate()).padStart(2, "0");
  const todayIso = `${year}-${month}-${day}`;

  const all = getAllMeetings();
  const upcoming = all.filter((meeting) => meeting.date >= todayIso);
  if (upcoming.length > 0) {
    return upcoming[0];
  }
  return all[all.length - 1];
}

export function createMeetingRecord(id: string, input: MeetingInput): void {
  try {
    const db = getDb();
    db.prepare(
      `INSERT INTO meetings (
        id, date, type, presiding, conducting, announcements, wardBusiness,
        openingHymnTitle, openingHymnNumber, openingPrayer,
        sacramentHymnTitle, sacramentHymnNumber,
        speakers, musicalNumbers,
        closingHymnTitle, closingHymnNumber, closingPrayer
      ) VALUES (
        @id, @date, @type, @presiding, @conducting, @announcements, @wardBusiness,
        @openingHymnTitle, @openingHymnNumber, @openingPrayer,
        @sacramentHymnTitle, @sacramentHymnNumber,
        @speakers, @musicalNumbers,
        @closingHymnTitle, @closingHymnNumber, @closingPrayer
      )`
    ).run({
      id,
      date: input.date,
      type: input.type,
      presiding: input.presiding,
      conducting: input.conducting,
      announcements: JSON.stringify(input.announcements),
      wardBusiness: JSON.stringify(input.wardBusiness),
      openingHymnTitle: input.openingHymn.title,
      openingHymnNumber: input.openingHymn.number,
      openingPrayer: input.openingPrayer,
      sacramentHymnTitle: input.sacramentHymn.title,
      sacramentHymnNumber: input.sacramentHymn.number,
      speakers: JSON.stringify(input.speakers),
      musicalNumbers: JSON.stringify(input.musicalNumbers),
      closingHymnTitle: input.closingHymn.title,
      closingHymnNumber: input.closingHymn.number,
      closingPrayer: input.closingPrayer,
    });
  } catch (error) {
    console.error(`createMeetingRecord(${id}) failed:`, error);
    if (error instanceof Error && error.message.includes("UNIQUE constraint")) {
      throw new Error(`A meeting already exists for ${id}. Edit it instead, or pick a different date.`);
    }
    throw new Error("Unable to save this meeting right now. Please try again.");
  }
}

export function updateMeetingRecord(id: string, input: MeetingInput): void {
  try {
    const db = getDb();
    const result = db
      .prepare(
        `UPDATE meetings SET
          date = @date, type = @type, presiding = @presiding, conducting = @conducting,
          announcements = @announcements, wardBusiness = @wardBusiness,
          openingHymnTitle = @openingHymnTitle, openingHymnNumber = @openingHymnNumber,
          openingPrayer = @openingPrayer,
          sacramentHymnTitle = @sacramentHymnTitle, sacramentHymnNumber = @sacramentHymnNumber,
          speakers = @speakers, musicalNumbers = @musicalNumbers,
          closingHymnTitle = @closingHymnTitle, closingHymnNumber = @closingHymnNumber,
          closingPrayer = @closingPrayer
        WHERE id = @id`
      )
      .run({
        id,
        date: input.date,
        type: input.type,
        presiding: input.presiding,
        conducting: input.conducting,
        announcements: JSON.stringify(input.announcements),
        wardBusiness: JSON.stringify(input.wardBusiness),
        openingHymnTitle: input.openingHymn.title,
        openingHymnNumber: input.openingHymn.number,
        openingPrayer: input.openingPrayer,
        sacramentHymnTitle: input.sacramentHymn.title,
        sacramentHymnNumber: input.sacramentHymn.number,
        speakers: JSON.stringify(input.speakers),
        musicalNumbers: JSON.stringify(input.musicalNumbers),
        closingHymnTitle: input.closingHymn.title,
        closingHymnNumber: input.closingHymn.number,
        closingPrayer: input.closingPrayer,
      });

    if (result.changes === 0) {
      throw new Error(`No meeting found with id "${id}".`);
    }
  } catch (error) {
    console.error(`updateMeetingRecord(${id}) failed:`, error);
    throw new Error("Unable to update this meeting right now. Please try again.");
  }
}

export function deleteMeetingRecord(id: string): void {
  try {
    const db = getDb();
    db.prepare("DELETE FROM meetings WHERE id = ?").run(id);
  } catch (error) {
    console.error(`deleteMeetingRecord(${id}) failed:`, error);
    throw new Error("Unable to delete this meeting right now. Please try again.");
  }
}
