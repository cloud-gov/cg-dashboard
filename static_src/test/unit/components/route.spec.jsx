
import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';
import Route from '../../../components/route.jsx';
import RouteStore from '../../../stores/route_store';


describe('<Route />', function () {
  let route, sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('with a bound route', function () {
    let routeModel;

    beforeEach(function () {
      routeModel = {
        domain_name: 'example.com',
        host: 'test'
      };

      sandbox.stub(RouteStore, 'isRouteBoundToApp').returns(true);
      route = shallow(<Route appGuid="abc" route={ routeModel } />);
    });

    describe('link', function () {
      it('exists', function () {
        expect(route.find('a').length).toBe(1);
      });

      it('is an absolute url', function () {
        expect(route.find('a').prop('href')).toBe('//test.example.com');
      });
    });

    describe('unbind confirmation', function () {
      let confirmation;

      beforeEach(function () {
        confirmation = shallow(route.instance().confirmationMsg);
      });

      it('has a link', function () {
        expect(confirmation.find('a').length).toBe(1);
      });

      it('has a link to route', function () {
        expect(confirmation.find('a').prop('href')).toBe('//test.example.com');
      });
    });
  });
});
