import type { Meeting } from "@/lib/types";

/**
 * One-time seed data loaded into SQLite the first time the database file is
 * created. Dates are seeded around the app's "today" so the list naturally
 * spans past and upcoming Sundays for testing filtering, sorting, and the
 * /meetings/current redirect.
 */
export const SEED_MEETINGS: Meeting[] = [
  {
    id: "2026-08-30",
    date: "2026-08-30",
    type: "regular",
    presiding: "Bishop David Hansen",
    conducting: "David Hansen",
    announcements: [
      "Ward campout has been moved to September 19th at Willow Creek.",
      "Temple night carpool signup sheet is in the foyer.",
    ],
    wardBusiness: ["Release: Sister Karen Lott as Primary chorister, with thanks."],
    openingHymn: { title: "Come, Come, Ye Saints", number: 30 },
    openingPrayer: "Emily Nakamura",
    sacramentHymn: { title: "Reverently and Meekly Now", number: 185 },
    speakers: [
      { name: "Brother Tomas Diaz", topic: "Enduring to the end" },
      { name: "Sister Priya Rao", topic: "The gift of the Holy Ghost" },
    ],
    musicalNumbers: [
      { title: "I Need Thee Every Hour", performedBy: "Ward Choir" },
    ],
    closingHymn: { title: "Now Let Us Rejoice", number: 3 },
    closingPrayer: "Marcus Webb",
  },
  {
    id: "2026-09-06",
    date: "2026-09-06",
    type: "testimony",
    presiding: "Bishop David Hansen",
    conducting: "James Okafor",
    announcements: [
      "Fast offerings may be submitted online or in the tithing envelopes at the back of the chapel.",
      "Youth conference registration closes this Friday.",
    ],
    wardBusiness: [
      "Sustain: Brother Aaron Whitfield as second counselor in the Elders Quorum presidency.",
      "Baby blessing: infant son of Michael and Rachel Sorensen.",
    ],
    openingHymn: { title: "Called to Serve", number: 249 },
    openingPrayer: "Rachel Sorensen",
    sacramentHymn: { title: "In Humility, Our Savior", number: 172 },
    speakers: [],
    musicalNumbers: [],
    closingHymn: { title: "Do What Is Right", number: 237 },
    closingPrayer: "Aaron Whitfield",
  },
  {
    id: "2026-09-13",
    date: "2026-09-13",
    type: "regular",
    presiding: "Bishop David Hansen",
    conducting: "David Hansen",
    announcements: [
      "Ward campout is this Saturday at Willow Creek — sign up in the foyer.",
      "Primary program practice moves to the chapel next week.",
    ],
    wardBusiness: [],
    openingHymn: { title: "High on the Mountain Top", number: 5 },
    openingPrayer: "Grace Lindqvist",
    sacramentHymn: { title: "O Lord, My Rock and My Redeemer", number: 129 },
    speakers: [
      { name: "Sister Grace Lindqvist", topic: "Sabbath day worship" },
      { name: "Bishop David Hansen", topic: "Ministering to one another" },
    ],
    musicalNumbers: [
      { title: "Be Still, My Soul", performedBy: "The Whitfield Family" },
    ],
    closingHymn: { title: "Love One Another", number: 308 },
    closingPrayer: "Tomas Diaz",
  },
  {
    id: "2026-09-20",
    date: "2026-09-20",
    type: "regular",
    presiding: "Bishop David Hansen",
    conducting: "James Okafor",
    announcements: [
      "Ward conference is in three weeks — combined session at 11:00 a.m.",
      "The clothing exchange in the cultural hall runs through Wednesday.",
    ],
    wardBusiness: [
      "Release: Brother Marcus Webb as Ward Mission Leader, with thanks.",
      "Sustain: Brother Michael Sorensen as Ward Mission Leader.",
    ],
    openingHymn: { title: "The Morning Breaks", number: 1 },
    openingPrayer: "Michael Sorensen",
    sacramentHymn: { title: "God Loved Us, So He Sent His Son", number: 187 },
    speakers: [
      { name: "Elder James Okafor", topic: "The Atonement of Jesus Christ" },
      { name: "Sister Emily Nakamura", topic: "Family history and temple work" },
    ],
    musicalNumbers: [
      { title: "I Stand All Amazed", performedBy: "Priya Rao (vocal solo)" },
    ],
    closingHymn: { title: "Let Us All Press On", number: 243 },
    closingPrayer: "Priya Rao",
  },
  {
    id: "2026-09-27",
    date: "2026-09-27",
    type: "regular",
    presiding: "Bishop David Hansen",
    conducting: "David Hansen",
    announcements: [
      "General Conference is next weekend — viewing parties will be held at the church for those without access at home.",
    ],
    wardBusiness: ["Baby blessing: infant daughter of Aaron and Jenna Whitfield."],
    openingHymn: { title: "Praise to the Man", number: 27 },
    openingPrayer: "Jenna Whitfield",
    sacramentHymn: { title: "Jesus, Once of Humble Birth", number: 196 },
    speakers: [
      { name: "Brother Marcus Webb", topic: "Preparing for General Conference" },
    ],
    musicalNumbers: [
      { title: "Consider the Lilies", performedBy: "Ward Choir" },
    ],
    closingHymn: { title: "We Thank Thee, O God, for a Prophet", number: 19 },
    closingPrayer: "James Okafor",
  },
  {
    id: "2026-10-04",
    date: "2026-10-04",
    type: "general",
    presiding: "The First Presidency",
    conducting: "President of the Church",
    announcements: [
      "All sessions are broadcast — check local listings or the Gospel Library app for viewing times.",
      "There is no local ward meeting held on General Conference weekend.",
    ],
    wardBusiness: [],
    openingHymn: { title: "Conference session hymn (varies by session)", number: 0 },
    openingPrayer: "Assigned General Authority",
    sacramentHymn: { title: "Not observed during General Conference sessions", number: 0 },
    speakers: [
      {
        name: "Various General Authorities and General Officers",
        topic: "General Conference addresses",
      },
    ],
    musicalNumbers: [
      { title: "Selected hymns", performedBy: "The Tabernacle Choir at Temple Square" },
    ],
    closingHymn: { title: "Conference session hymn (varies by session)", number: 0 },
    closingPrayer: "Assigned General Authority",
  },
  {
    id: "2026-10-11",
    date: "2026-10-11",
    type: "stake",
    presiding: "President Daniel Okonkwo",
    conducting: "President Daniel Okonkwo",
    announcements: [
      "Combined stake conference session begins at 10:00 a.m. in the stake center.",
      "Broadcast to the ward building overflow room for those who prefer a closer parking option.",
    ],
    wardBusiness: [
      "Sustain: new stake Young Women presidency.",
    ],
    openingHymn: { title: "Come, Thou Fount of Every Blessing", number: 194 },
    openingPrayer: "Stake Relief Society President",
    sacramentHymn: { title: "As the Dew from Heaven Distilling", number: 139 },
    speakers: [
      { name: "President Daniel Okonkwo", topic: "Unity in the stake" },
      { name: "Sister Lian Zhao, Stake Relief Society President", topic: "Charity never faileth" },
    ],
    musicalNumbers: [
      { title: "How Firm a Foundation", performedBy: "Combined Stake Choir" },
    ],
    closingHymn: { title: "Onward, Christian Soldiers", number: 246 },
    closingPrayer: "Stake Young Men President",
  },
  {
    id: "2026-10-18",
    date: "2026-10-18",
    type: "regular",
    presiding: "Bishop David Hansen",
    conducting: "David Hansen",
    announcements: [
      "Trunk-or-treat signups are open in the foyer.",
      "Missionary correspondence letters are due to the Relief Society table by Sunday.",
    ],
    wardBusiness: [],
    openingHymn: { title: "Redeemer of Israel", number: 6 },
    openingPrayer: "Karen Lott",
    sacramentHymn: { title: "While of These Emblems We Partake", number: 173 },
    speakers: [
      { name: "Brother Aaron Whitfield", topic: "Faith in Jesus Christ" },
    ],
    musicalNumbers: [
      { title: "Lead, Kindly Light", performedBy: "Grace Lindqvist (vocal solo)" },
    ],
    closingHymn: { title: "Israel, Israel, God Is Calling", number: 7 },
    closingPrayer: "David Hansen",
  },
];
