export function validateNumber(options) {
  const { max, min } = options || {};
  return function _validateNumber(text) {
    const value = parseInt(text, 10);
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
