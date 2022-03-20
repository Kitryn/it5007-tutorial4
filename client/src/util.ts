// utility formatting functions

import { Manifest, MAX_SEATS_PER_TRAIN, SEAT_NUMBERS } from "./models";

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// https://stackoverflow.com/questions/15397372/javascript-new-date-ordinal-st-nd-rd-th/15397495
const nth = function (d: number) {
  if (d > 3 && d < 21) return "th";
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatSummaryDatetime = function (date: Date): string {
  // const date = new Date(ts);
  const [, mn, d] = date.toDateString().split(" "); // 'Mon Feb 07 2022'
  const [h, m] = date.toTimeString().split(":"); // '01:53:22 GMT+0800 (Singapore Standard Time)'
  return `${+d}${nth(+d)} ${mn} ${h}:${m}`; // 6th Feb 21:00
};

export const getNumRemainingSeats = function (manifest: Manifest): number {
  return MAX_SEATS_PER_TRAIN - manifest.seats.length;
};

export const getRandomSeatNumber = function (manifest: Manifest): number {
  const occupiedSeats = new Set(manifest.seats.map((s) => s.sn));
  const unoccupiedSeats = Array.from(SEAT_NUMBERS).filter((s) => !occupiedSeats.has(s));

  if (unoccupiedSeats.length <= 0) {
    throw new Error("No seats left!");
  }

  return unoccupiedSeats[Math.floor(Math.random() * unoccupiedSeats.length)];
};
