
import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';
import Action from '../../../components/action.jsx';

describe('<Action />', function () {
  let action, sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('given type is link', function () {
    beforeEach(function () {
      action = shallow(<Action type="link" />);
    });

    it('renders as a link', function () {
      expect(action.find('a').length).toBe(1);
    });

    it('does not render a button', function () {
      expect(action.find('button').length).toBe(0);
    });

    describe('given an href', function () {
      beforeEach(function () {
        action = shallow(<Action type="link" href="https://example.com" />);
      });

      it('renders with the href', function () {
        expect(action.find('a').prop('href')).toBe('https://example.com');
      });
    });
  });

  describe('clickHandler', function () {
    let clickHandlerSpy;
    beforeEach(function () {
      clickHandlerSpy = sandbox.spy();
      action = shallow(<Action clickHandler={ clickHandlerSpy } />);
    });

    describe('on click', function () {
      beforeEach(function () {
        action.simulate('click');
      });

      it('triggers clickHandler', function () {
        expect(clickHandlerSpy).toHaveBeenCalledOnce();
      });
    });
  });
});
