import moment from 'moment-timezone';

const invalidMsg = 'Invalid datetimes cannot be formatted.';

/**
 * Returns a formated datetime string
 * @params {String} datetime as a string
 * @params {String} timezone abbreviation - defaults to UTC
 *
 * @returns {String} A "MM/DD/YYYY H:mma z" formatted string
 *                    i.e. 03/21/2016 10:39am PDT
*/
export default function formatDateTime(dateString, timezone = 'Etc/UTC') {
  const d = moment(dateString);

  if (!d.isValid()) throw new Error(invalidMsg);
  return d.tz(timezone).format('MM/DD/YYYY hh:mma z');
}
