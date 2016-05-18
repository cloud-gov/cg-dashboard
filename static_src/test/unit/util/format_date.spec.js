
import '../../global_setup.js';

import formatDateTime from '../../../util/format_date';

describe('format_date util', function () {
  describe('when used with an invalid datetime', function () {
    it('should throw an exception', function () {
      function format () {
        return formatDateTime('invaliddate');
      }
      expect(format).toThrow();
    });
  });

  describe('when used with a valid datetime', function () {
    describe('but without a timezone', function () {
      it('should return a formatted datetime in UTC', function () {
        const formatted = formatDateTime('2015-07-14T04:02:30Z');
        const expected = '07/14/2015 04:02am UTC';
        expect(formatted).toEqual(expected);
      });
    });

    describe('and with a valid timezone', function () {
      it('should return a formatted datetime in that timezone', function () {
        const tz = 'America/Los_Angeles';
        const formatted = formatDateTime('2015-07-14T04:02:30Z', tz);
        const expected = '07/13/2015 09:02pm PDT';
        expect(formatted).toEqual(expected);
      });
    });
  });
});
