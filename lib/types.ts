export type MeetingType = "testimony" | "regular" | "stake" | "general";

export interface Hymn {
  title: string;
  number: number;
}

export interface Speaker {
  name: string;
  topic: string;
}

export interface MusicalNumber {
  title: string;
  performedBy: string;
}

export interface Meeting {
  /** ISO date (YYYY-MM-DD) for the Sunday this meeting is held; also used as the route id. */
  id: string;
  date: string;
  type: MeetingType;
  presiding: string;
  conducting: string;
  announcements: string[];
  wardBusiness: string[];
  openingHymn: Hymn;
  openingPrayer: string;
  sacramentHymn: Hymn;
  speakers: Speaker[];
  musicalNumbers: MusicalNumber[];
  closingHymn: Hymn;
  closingPrayer: string;
}

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  testimony: "Fast & Testimony Meeting",
  regular: "Sacrament Meeting",
  stake: "Stake Conference",
  general: "General Conference",
};
