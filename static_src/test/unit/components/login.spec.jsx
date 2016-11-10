
import '../../global_setup.js';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';

import Login from '../../../components/login.jsx';

describe('Login', function() {
  var login;

  beforeEach(function() {
    login = TestUtils.renderIntoDocument(<Login/>);
  });

  describe('render()', function() {
    it('renders', function() {
      expect(login).toBeDefined();
    });

    it('should have a button that goes to auth handshake', function() {
      let button = TestUtils.findRenderedDOMComponentWithClass(
          login, 'test-login');

      expect(button.getDOMNode()).toBeDefined();
      expect(button.getDOMNode().getAttribute('href')).toEqual('/handshake');
    });

    it('includes a link to contribute', function() {
      let link = TestUtils.findRenderedDOMComponentWithClass(
          login, 'test-contribute_link');

      expect(link.getDOMNode().getAttribute('href')).toEqual(
          'https://github.com/18F/cg-dashboard');
    });
  });
});
