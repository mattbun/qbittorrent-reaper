const parseDuration = require('parse-duration');

const MILLISECONDS_IN_ONE_SECOND = 1000;

module.exports.subtractFromToday = function subtractFromToday(durationString) {
  return new Date((new Date().getTime()) - parseDuration(durationString));
}

module.exports.convertQBDateToDate = function getDateFromQBDate(qbDate) {
  // qbittorrent epoch times are in seconds, Date expects milliseconds
  return new Date(qbDate * MILLISECONDS_IN_ONE_SECOND);
}
