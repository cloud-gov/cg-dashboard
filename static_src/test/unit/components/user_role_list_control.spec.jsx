
import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';
import UserRoleListControl from '../../../components/user_role_list_control.jsx';

describe('<UserRoleListControl />', function () {
  let userRoleListControl;

  describe('with an org user', function () {
    const orgGuid = 'org-123';

    beforeEach(function () {
      const userGuid = 'a-user-guid';
      const user = {
        guid: userGuid,
        roles: []
      };

      userRoleListControl = shallow(
        <UserRoleListControl
          user={ user }
          userType="org_users"
          currentUserAccess
          entityGuid={ orgGuid }
        />
      );
    });

    describe('that has no roles', function () {
      it('returns an empty list of roles', function () {
        const actual = userRoleListControl.instance().roles();
        expect(actual).toEqual([]);
      });

      it('returns false for all org roles', function () {
        const actual = userRoleListControl.instance().checkRole('org_manager');
        expect(actual).toEqual(false);
      });
    });

    describe('that has org_manager role, checkRole', function () {
      beforeEach(function () {
        const user = {
          guid: 'user-123',
          entityGuid: orgGuid,
          roles: {
            [orgGuid]: ['org_manager']
          }
        };
        userRoleListControl.setProps({ user });
      });

      it('returns true for org manager', function () {
        const actual = userRoleListControl.instance().checkRole('org_manager');
        expect(actual).toEqual(true);
      });

      it('returns false for org auditor, space manager', function () {
        const actual = userRoleListControl.instance().checkRole('org_auditor');
        expect(actual).toEqual(false);
        expect(userRoleListControl.instance().checkRole('space_manager'))
          .toEqual(false);
      });
    });
  });

  describe('with a space user', function () {
    const spaceGuid = 'space-123';

    beforeEach(function () {
      const userGuid = 'a-user-guid';
      const user = {
        guid: userGuid,
        roles: []
      };

      userRoleListControl = shallow(
        <UserRoleListControl
          user={ user }
          userType="space_users"
          currentUserAccess
          entityGuid={ spaceGuid }
        />
      );
    });

    describe('that has no roles', function () {
      it('returns an empty list of roles', function () {
        const actual = userRoleListControl.instance().roles();
        expect(actual).toEqual([]);
      });

      it('returns false for all space roles', function () {
        const actual = userRoleListControl.instance().checkRole('space_manager');
        expect(actual).toEqual(false);
      });
    });

    describe('that has space_manager role, checkRole', function () {
      beforeEach(function () {
        const user = {
          guid: 'user-123',
          entityGuid: spaceGuid,
          roles: {
            [spaceGuid]: ['space_manager']
          }
        };
        userRoleListControl.setProps({ user });
      });

      it('returns true for space manager', function () {
        const actual = userRoleListControl.instance().checkRole('space_manager');
        expect(actual).toEqual(true);
      });

      it('returns false for space auditor, org manager', function () {
        const actual = userRoleListControl.instance().checkRole('space_auditor');
        expect(actual).toEqual(false);
        expect(userRoleListControl.instance().checkRole('org_manager'))
          .toEqual(false);
      });
    });
  });
});
