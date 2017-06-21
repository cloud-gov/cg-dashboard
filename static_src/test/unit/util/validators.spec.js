import '../../global_setup.js';

import { validateInteger, validateEmail } from '../../../util/validators';

describe('validateEmail', function () {
  it('returns a function', function () {
    expect(typeof validateEmail()).toBe('function');
  });

  describe('given no options', function () {
    let validator;
    beforeEach(function () {
      validator = validateEmail();
    });

    it('fails for empty', function () {
      const result = validator();
      expect(result).toEqual({ message: 'Enter an email address in the  field' });
    });
  });

  describe('given string', function () {
    let validator;
    beforeEach(function () {
      validator = validateEmail();
    });

    it('fails for none emails string', function () {
      const result = validator('domain');
      expect(result).toEqual({ message: 'Enter an email address in the  field' });
    });

    it('fails for none emails string@', function () {
      const result = validator('domain@place');
      expect(result).toEqual({ message: 'Enter an email address in the  field' });
    });

    it('fails for none emails string@string', function () {
      const result = validator('domain@place');
      expect(result).toEqual({ message: 'Enter an email address in the  field' });
    });

    it('succeeds for email', function () {
      const result = validator('domain@place.com');
      expect(result).toEqual(null);
    });
  });
});

describe('vaidateNumber', function () {
  it('returns a function', function () {
    expect(typeof validateInteger()).toBe('function');
  });

  describe('given no options', function () {
    let validator;
    beforeEach(function () {
      validator = validateInteger();
    });

    it('fails for empty', function () {
      const result = validator();
      expect(result).toEqual({ message: 'Invalid number', type: 'NUMBER_INVALID' });
    });

    it('fails for 1234asdf', function () {
      const result = validator('1234asdf');
      expect(result).toEqual({ message: 'Invalid number', type: 'NUMBER_INVALID' });
    });

    it('fails for NaN', function () {
      const result = validator('Not a number');
      expect(result).toEqual({ message: 'Invalid number', type: 'NUMBER_INVALID' });
    });

    it('fails for float string', function () {
      const result = validator('13.37');
      expect(result).toEqual({ message: 'Invalid number', type: 'NUMBER_INVALID' });
    });

    it('passes for number string', function () {
      const result = validator('137');
      expect(result).toBe(null);
    });

    it('passes for negative number string', function () {
      const result = validator('-137');
      expect(result).toBe(null);
    });

    it('passes for zero', function () {
      const result = validator('0');
      expect(result).toBe(null);
    });
  });

  describe('given max', function () {
    let validator;

    beforeEach(function () {
      validator = validateInteger({ max: 1024 });
    });

    it('fails for above max', function () {
      const result = validator('1025');
      expect(result).toEqual({ message: 'Total exceeds 1024', type: 'NUMBER_MAX' });
    });

    it('accepts max', function () {
      const result = validator('1024');
      expect(result).toBe(null);
    });

    it('accepts below max', function () {
      const result = validator('1023');
      expect(result).toBe(null);
    });
  });

  describe('given min', function () {
    let validator;

    beforeEach(function () {
      validator = validateInteger({ min: 1 });
    });

    it('fails for below min', function () {
      const result = validator('0');
      expect(result).toEqual({ message: 'Total must be 1 or greater', type: 'NUMBER_MIN' });
    });

    it('accepts min', function () {
      const result = validator('1');
      expect(result).toBe(null);
    });

    it('accepts above min', function () {
      const result = validator('2');
      expect(result).toBe(null);
    });
  });

  describe('given min and max', function () {
    let validator;

    beforeEach(function () {
      validator = validateInteger({ min: 1, max: 1024 });
    });

    it('fails invalid', function () {
      const result = validator('None');
      expect(result).toEqual({ message: 'Invalid number', type: 'NUMBER_INVALID' });
    });

    it('fails below min', function () {
      const result = validator('0');
      expect(result).toEqual({ message: 'Total must be 1 or greater', type: 'NUMBER_MIN' });
    });

    it('fails above max', function () {
      const result = validator('1025');
      expect(result).toEqual({ message: 'Total exceeds 1024', type: 'NUMBER_MAX' });
    });

    it('accepts between max and min', function () {
      const result = validator('1000');
      expect(result).toBe(null);
    });

    it('accepts min', function () {
      const result = validator('1');
      expect(result).toBe(null);
    });

    it('accepts max', function () {
      const result = validator('1024');
      expect(result).toBe(null);
    });
  });
});
