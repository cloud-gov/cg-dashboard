import '../../global_setup.js';

import React from 'react';
import Immutable from 'immutable';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import Users from '../../../components/users.jsx';
import PanelDocumentation from '../../../components/panel_documentation.jsx';
import UsersSelector from '../../../components/users_selector.jsx';
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
      beforeEach(() => {
        users.setState({ currentType: 'org_users' });
      });

      it('has an `entityType` of organization', () => {
        const actual = users.instance().entityType;

        expect(actual).toEqual('organization');
      });

      describe('when a user is an org manager', () => {
        beforeEach(() => {
          const stub = sinon.stub(UserStore, 'hasRole');
          stub.withArgs(userGuid, sinon.match.any, 'org_manager').returns(true);
          stub.withArgs(userGuid, sinon.match.any, 'space_manager').returns(false);
          users = shallow(<Users />);
          users.setState({ currentType: 'org_users' });
        });

        afterEach(() => {
          sinon.restore(UserStore);
        });

        it('renders a <UsersInvite /> component', () => {
          expect(users.find(UsersInvite).length).toBe(1);
        });

        it('should not render a <UsersSelector />', () => {
          expect(users.find(UsersSelector).length).toBe(0);
        });

        it('should render a <UsersInvite />', () => {
          expect(users.find(UsersInvite).length).toBe(1);
        });

        it('should not render a <PanelDocumentation />', () => {
          expect(users.find(PanelDocumentation).length).toBe(0);
        });
      });

      describe('when a user is not an org manager', () => {
        const spaceUser = Object.assign({}, user, {
          roles: buildRoles(spaceGuid, ['space_manager'])
        });

        beforeEach(() => {
          UserStore._data = Immutable.fromJS([spaceUser]);
          users = shallow(<Users />);
          users.setState({ currentType: 'org_users' });
          const stub = sinon.stub(UserStore, 'hasRole');
          stub.withArgs(userGuid, sinon.match.any, sinon.match.any).returns(false);
        });

        afterEach(() => {
          sinon.restore(UserStore);
        });

        it('renders message telling user to ask an org manager to add users', () => {
          expect(users.find(PanelDocumentation).length).toBe(1);
          expect(users.find(PanelDocumentation).prop('children'))
            .toEqual('Only an org manager can new invite users to this ' +
            'organization via the dashboard. Speak to your org manager if ' +
            'you need to add a user to this organization');
        });

        it('should not render a <UsersSelector />', () => {
          expect(users.find(UsersSelector).length).toBe(0);
        });

        it('should not render a <UsersInvite /> component', () => {
          expect(users.find(UsersInvite).length).toBe(0);
        });
      });
    });

    describe('when at space level', () => {
      beforeEach(() => {
        users.setState({ currentType: 'space_users' });
      });

      it('has an `entityType` of space', () => {
        const actual = users.instance().entityType;
        expect(actual).toEqual('space');
      });

      describe('when a user is an org manager and not space manager', () => {
        beforeEach(() => {
          const stub = sinon.stub(UserStore, 'hasRole');
          stub.withArgs(userGuid, sinon.match.any, 'org_manager').returns(true);
          stub.withArgs(userGuid, sinon.match.any, 'space_manager').returns(false);
          users = shallow(<Users />);
        });

        afterEach(() => {
          sinon.restore(UserStore);
        });

        it('renders a <UsersInvite /> component', () => {
          expect(users.find(UsersInvite).length).toBe(1);
        });

        it('should render a <UsersSelector />', () => {
          expect(users.find(UsersSelector).length).toBe(1);
        });

        it('should not show a <PanelDocumentation />', () => {
          expect(users.find(PanelDocumentation).length).toBe(0);
        });
      });

      describe('when a user is not an org manager and not a space manager', () => {
        const spaceUser = Object.assign({}, user, {
          roles: buildRoles(spaceGuid, [])
        });

        beforeEach(() => {
          UserStore._data = Immutable.fromJS([spaceUser]);
          users = shallow(<Users />);
          const stub = sinon.stub(UserStore, 'hasRole');
          stub.withArgs(userGuid, sinon.match.any, 'org_manager').returns(false);
          stub.withArgs(userGuid, sinon.match.any, 'space_manager').returns(false);
        });

        afterEach(() => {
          sinon.restore(UserStore);
        });

        it('should not render a <UsersInvite /> component', () => {
          expect(users.find(UsersInvite).length).toBe(0);
        });

        it('should not show a <UsersSelector />', () => {
          expect(users.find(UsersSelector).length).toBe(0);
        });

        it('should render a <PanelDocumentation />', () => {
          expect(users.find(PanelDocumentation).length).toBe(1);
          expect(users.find(PanelDocumentation).prop('children'))
            .toEqual('If you wish to invite users into this space, please ask ' +
            'an org manager or a space manager');
        });
      });

      describe('when a user is not an org manager but is a space manager', () => {
        const spaceUser = Object.assign({}, user, {
          roles: buildRoles(spaceGuid, ['space_manager'])
        });

        beforeEach(() => {
          UserStore._data = Immutable.fromJS([spaceUser]);
          users = shallow(<Users />);
          const stub = sinon.stub(UserStore, 'hasRole');
          stub.withArgs(userGuid, sinon.match.any, 'org_manager').returns(true);
          stub.withArgs(userGuid, sinon.match.any, 'space_manager').returns(false);
        });

        afterEach(() => {
          sinon.restore(UserStore);
        });

        it('should not render a <UsersInvite /> component', () => {
          expect(users.find(UsersInvite).length).toBe(0);
        });

        it('should render a <UsersSelector />', () => {
          expect(users.find(UsersSelector).length).toBe(1);
        });

        it('should show a <PanelDocumentation />', () => {
          expect(users.find(PanelDocumentation).length).toBe(1);
          expect(users.find(PanelDocumentation).prop('children'))
            .toEqual('As an space manager, you can invite existing organization ' +
            'users into your space. If you wish to invite a person who is not in ' +
            'the organization into your space, please ask an org manager');
        });
      });
    });
  });
});
