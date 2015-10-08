
import '../../global_setup.js';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

import Navbar from '../../../components/navbar.jsx';

describe('Navbar', function() {
  var navbar;

  beforeEach(function() {
    navbar = TestUtils.renderIntoDocument(<Navbar />);
  });

  describe('render()', function() {
    it('should render', function() {
      expect(navbar).toBeDefined();
    });
  });
});
