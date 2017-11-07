import moment from 'moment-timezone';

const makeInvalidDateTimeValueError = str =>
  new Error(`could not format invalid date/time value: ${str}`);

/**
 * formatDateTime returns a formatted date/time string.
 *
 * @params {String} date/time as a string
 * @params {String} timezone abbreviation - defaults to "Etc/UTC"
 *
 * @returns {String} A "MMM DD YYYY hh:mma z" formatted string
 *                   e.g. "Jul 13 2015 09:02pm PDT"
*/
const formatDateTime = (str, timezone = 'Etc/UTC') => {
  if (!str) {
    throw makeInvalidDateTimeValueError(str);
  }
  const d = moment(str);
  if (!d.isValid()) {
    throw makeInvalidDateTimeValueError(str);
  }
  return d.tz(timezone).format('MMM DD YYYY hh:mma z');
};

export default formatDateTime;
