import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { SEED_MEETINGS } from "@/lib/seed-meetings";

/**
 * Vercel's serverless filesystem is read-only except /tmp, and /tmp is wiped
 * between invocations, so writes made in production won't survive past the
 * current instance. That's an accepted trade-off for this assignment (real
 * SQL + Server Actions) rather than provisioning hosted Postgres.
 */
const DB_PATH = process.env.VERCEL
  ? path.join("/tmp", "meetings.db")
  : path.join(process.cwd(), ".data", "meetings.db");

declare global {
  var __meetingsDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      presiding TEXT NOT NULL,
      conducting TEXT NOT NULL,
      announcements TEXT NOT NULL,
      wardBusiness TEXT NOT NULL,
      openingHymnTitle TEXT NOT NULL,
      openingHymnNumber INTEGER NOT NULL,
      openingPrayer TEXT NOT NULL,
      sacramentHymnTitle TEXT NOT NULL,
      sacramentHymnNumber INTEGER NOT NULL,
      speakers TEXT NOT NULL,
      musicalNumbers TEXT NOT NULL,
      closingHymnTitle TEXT NOT NULL,
      closingHymnNumber INTEGER NOT NULL,
      closingPrayer TEXT NOT NULL
    )
  `);

  const { count } = db
    .prepare("SELECT COUNT(*) AS count FROM meetings")
    .get() as { count: number };

  if (count === 0) {
    const insert = db.prepare(`
      INSERT INTO meetings (
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
      )
    `);

    const seedAll = db.transaction(() => {
      for (const meeting of SEED_MEETINGS) {
        insert.run({
          id: meeting.id,
          date: meeting.date,
          type: meeting.type,
          presiding: meeting.presiding,
          conducting: meeting.conducting,
          announcements: JSON.stringify(meeting.announcements),
          wardBusiness: JSON.stringify(meeting.wardBusiness),
          openingHymnTitle: meeting.openingHymn.title,
          openingHymnNumber: meeting.openingHymn.number,
          openingPrayer: meeting.openingPrayer,
          sacramentHymnTitle: meeting.sacramentHymn.title,
          sacramentHymnNumber: meeting.sacramentHymn.number,
          speakers: JSON.stringify(meeting.speakers),
          musicalNumbers: JSON.stringify(meeting.musicalNumbers),
          closingHymnTitle: meeting.closingHymn.title,
          closingHymnNumber: meeting.closingHymn.number,
          closingPrayer: meeting.closingPrayer,
        });
      }
    });
    seedAll();
  }

  return db;
}

/**
 * Reused across hot-reloads in dev and across warm serverless invocations so
 * every request in the same process shares one connection instead of
 * re-opening (and re-seeding) the file.
 */
export function getDb(): Database.Database {
  if (!globalThis.__meetingsDb) {
    globalThis.__meetingsDb = createConnection();
  }
  return globalThis.__meetingsDb;
}
