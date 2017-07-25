import '../../global_setup.js';

import React from 'react';
import Immutable from 'immutable';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import Users from '../../../components/users.jsx';
import PanelDocumentation from '../../../components/panel_documentation.jsx';
import UsersInvite from '../../../components/users_invite.jsx';
import UserStore from '../../../stores/user_store';
import SpaceStore from '../../../stores/space_store';

const buildRoles = (spaceGuid, roles = []) => {
  const obj = {};
  obj[spaceGuid] = roles;

  return obj;
};

describe('<Users />', () => {
  const userGuid = 'a-user-guid';
  const spaceGuid = 'space-guid';
  const user = {
    guid: userGuid,
    roles: buildRoles(spaceGuid, ['org_manager'])
  };

  let users;

  SpaceStore._currentSpaceGuid = spaceGuid;
  UserStore._currentUserGuid = userGuid;

  describe('with a user', () => {
    beforeEach(() => {
      UserStore._data = Immutable.fromJS([user]);
      users = shallow(<Users />);
    });

    describe('when at org level', () => {
      it('has an `entityType` of organization', () => {
        users.setState({ currentType: 'org_users' });
        const actual = users.instance().entityType;

        expect(actual).toEqual('organization');
      });
    });

    describe('when at space level', () => {
      it('has an `entityType` of space', () => {
        users.setState({ currentType: 'space_users' });
        const actual = users.instance().entityType;

        expect(actual).toEqual('space');
      });
    });

    describe('when a user is an org manager', () => {
      afterEach(() => {
        sinon.restore(UserStore);
      });

      it('renders a <UsersInvite /> component', () => {
        sinon.stub(UserStore, 'hasRole').returns(true);
        users = shallow(<Users />);

        expect(users.find(UsersInvite).length).toBe(1);
      });
    });

    describe('when a user is not an org manager', () => {
      const spaceUser = Object.assign({}, user, {
        roles: buildRoles(spaceGuid, ['space_manager'])
      });

      beforeEach(() => {
        UserStore._data = Immutable.fromJS([spaceUser]);
        users = shallow(<Users />);
      });

      it('renders message telling user to ask an org manager to add users', () => {
        expect(users.find(UsersInvite).length).toBe(0);
        expect(users.find(PanelDocumentation).length).toBe(1);
      });

      it('renders a link for the user to follow to get more information', () => {
        const panelDoc = users.find(PanelDocumentation);
        const link = panelDoc.find('a');
        // eslint-disable-next-line max-len
        const href = 'https://docs.cloudfoundry.org/adminguide/cli-user-management.html#space-roles';

        expect(link.length).toBe(1);
        expect(link.prop('href')).toBe(href);
      });
    });
  });
});
