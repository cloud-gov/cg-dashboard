import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';
import Users from '../../../components/users.jsx';
import OrgStore from '../../../stores/org_store';
import SpaceStore from '../../../stores/space_store';
import UserStore from '../../../stores/user_store';


describe('<Users />', function () {
  let users, sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('smoke test store', function () {
    it('with UserStore', function () {
      expect(UserStore).not.toEqual(undefined);
    });
    it('with OrgStore', function () {
      expect(OrgStore).not.toEqual(undefined);
    });
    it('with SpaceStore', function () {
      expect(SpaceStore).not.toEqual(undefined);
    });
  });

  describe('with a user', function () {
    beforeEach(function () {
      const userGuid = 'adskfj';
      const user = {
        guid: userGuid
      };
      UserStore._currentUserGuid = userGuid;
      UserStore.push(user);

      users = shallow(<Users />);
    });

    describe('when at org level', function () {
      beforeEach(function () {
        users.setState({ currentType: 'org_users' });
      });
      it('doesnt have permissions to edit users', function () {
        const actual = users.instance().resourceType;
        expect(actual).toEqual('org');
      });
    });
  });
});
