import moment from 'moment-timezone';

const makeInvalidDateTimeValueError = str =>
  new Error(`could not format invalid date/time value: ${str}`);

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
