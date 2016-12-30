import '../../global_setup.js';

import formatBytes from '../../../util/format_bytes';

describe('format_bytes util', function () {
  it('formats undefined', function () {
    expect(formatBytes(undefined)).toBe('0 B');
  });

  it('formats zero', function () {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats bytes', function () {
    expect(formatBytes(10)).toBe('10 B');
  });

  it('formats KB', function () {
    expect(formatBytes(7010)).toBe('7 KB');
  });

  it('formats MB', function () {
    expect(formatBytes(52428810)).toBe('50 MB');
  });

  describe('with decimals', function () {
    it('formats zero', function () {
      expect(formatBytes(0, 1)).toBe('0.0 B');
    });

    it('formats bytes', function () {
      expect(formatBytes(10, 1)).toBe('10.0 B');
    });

    it('formats KB', function () {
      expect(formatBytes(1024, 1)).toBe('1.0 KB');
    });

    it('formats MB', function () {
      expect(formatBytes(1112222, 1)).toBe('1.1 MB');
    });
  });
});
