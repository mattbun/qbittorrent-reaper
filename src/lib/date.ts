import parseDuration from "parse-duration";

const MILLISECONDS_IN_ONE_SECOND = 1000;

export function subtractFromToday(duration: string) {
  return new Date(new Date().getTime() - parseDuration(duration));
}

export function convertQBDateToDate(qbDate: number) {
  // qbittorrent epoch times are in seconds, Date expects milliseconds
  return new Date(qbDate * MILLISECONDS_IN_ONE_SECOND);
}
