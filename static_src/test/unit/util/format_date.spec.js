import '../../global_setup';
import formatDateTime from '../../../util/format_date';

describe('formatDateTime', () => {
  for (const val of [null, undefined, '', 'invaliddate']) {
    it(`should throw an exception when given an invalid value: ${val}`, () => {
      expect(() => formatDateTime(val)).toThrow();
    });
  }

  for (const { input, output } of [
    {
      input: '2015-07-14T04:02:30Z',
      output: 'Jul 14 2015 04:02am +0000'
    },
    {
      input: '1988-10-01T18:58:30Z',
      output: 'Oct 01 1988 06:58pm +0000'
    }
  ]) {
    it(`should return a formatted datetime when given a valid value: ${input}`, () => {
      expect(formatDateTime(input)).toEqual(output);
    });
  }
});
