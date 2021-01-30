const parseDuration = require('parse-duration');

module.exports.subtractFromToday = function subtractFromToday(durationString) {
  return new Date((new Date().getTime()) - parseDuration(durationString));
}
