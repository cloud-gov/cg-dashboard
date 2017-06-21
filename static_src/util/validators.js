export function validateInteger(options) {
  const { max, min } = options || {};
  return function _validateInteger(text) {
    let value = text || '';
    if (!/^-?\d+$/.test(String(value).trim())) {
      return { message: 'Invalid number', type: 'NUMBER_INVALID' };
    }

    value = parseInt(text, 10);
    if (typeof value !== 'number') {
      return { message: 'Invalid number', type: 'NUMBER_INVALID' };
    }

    if (Number.isNaN(value)) {
      return { message: 'Invalid number', type: 'NUMBER_INVALID' };
    }

    if (typeof min === 'number' && value < min) {
      return { message: `Total must be ${min} or greater`, type: 'NUMBER_MIN' };
    }

    if (typeof max === 'number' && value > max) {
      return { message: `Total exceeds ${max}`, type: 'NUMBER_MAX' };
    }

    return null;
  };
}

export function validateString() {
  return function _validateString(value, name) {
    if (!value || !value.length) {
      return {
        message: `The ${name || ''} field was not filled out`
      };
    }

    return null;
  };
}

export function validateEmail() {
  return function _validateEmail(value, name) {
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))) {
      return {
        message: 'The value entered is not a valid e-mail address'
      };
    }

    return null;
  };
}
