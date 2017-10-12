import { isValid, format } from 'date-fns/esm';

const formatDateTime = str => {
  if (!isValid(str)) {
    throw new Error(`could not format invalid datetime value: ${str}`);
  }
  return format(str, 'MMM DD YYYY hh:mma ZZ');
};

export default formatDateTime;
