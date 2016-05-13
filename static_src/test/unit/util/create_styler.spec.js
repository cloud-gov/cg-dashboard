
import '../../global_setup.js';

import createStyler from '../../../util/create_styler.js';

describe('createStyler', function () {
  describe('created with no style files', function () {
    it('should return original class name', function () {
      const expected = 'expectedClass';
      const styler = createStyler();

      expect(styler(expected)).toEqual(expected);
    });
  });

  describe('created with two style files', function () {
    function createStylerWithTwoStyleFiles() {
      const cssOne = {
        logo: 'logo__logo___X79Mg'
      };
      const cssTwo = {
        header: 'header__header___X79Mg'
      };

      return createStyler(cssOne, cssTwo);
    }

    it('should return just classname if there are no matches', function () {
      const styler = createStylerWithTwoStyleFiles();
      const expected = 'footer';
      const actual = styler('footer');

      expect(actual).toEqual(expected);
    });

    it('should return the classname and a match, if there is one', function () {
      const styler = createStylerWithTwoStyleFiles();
      const expected = ['logo__logo___X79Mg', 'logo'];
      const actual = styler('logo').split(' ');

      expect(actual.indexOf(expected[0])).toBeGreaterThan(-1);
      expect(actual.indexOf(expected[1])).toBeGreaterThan(-1);
    });
  });
});
