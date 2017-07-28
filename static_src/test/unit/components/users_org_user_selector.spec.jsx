import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';
import { Form, FormSelect } from '../../../components/form';
import OrgUsersSelector from '../../../components/users_org_user_selector.jsx';
import PanelDocumentation from '../../../components/panel_documentation.jsx';

describe('<OrgUsersSelector />', function () {
  const parentEntityType = 'organization';
  const entityType = 'space';
  const props = {
    currentUserAccess: true,
    orgUsersSelectorDisabled: false,
    parentEntityUsers: [],
    error: {},
    parentEntity: parentEntityType,
    currentEntityGuid: 'a-space-guid',
    currentEntity: entityType
  };
  let wrapper;


  describe('when the working description is displayed as text panel', () => {
    beforeEach(() => {
      wrapper = shallow(<OrgUsersSelector { ...props } />);
    });

    it('displays proper message', () => {
      const doc = 'Invite an existing user in this organization to this space.';
      expect(wrapper.find(PanelDocumentation).find('p').text()).toBe(doc);
    });
  });

  describe('when user selector', () => {
    it('renders users', () => {
      const username = "username";
      const guid = "a-guid";
      const user = { guid, username };
      const parentEntityUsers = [user, user, user]
      const usersProps = Object.assign({}, props, { parentEntityUsers });
      wrapper = shallow(<OrgUsersSelector { ...usersProps } />);
      const formSelect = wrapper.find(Form).find(FormSelect);
      expect(formSelect.length).toEqual(1);
      expect(formSelect.props().options.length).toEqual(3);
    });
    it('renders without users', () => {
      const usersProps = Object.assign({}, props, { parentEntityUsers: [] });
      wrapper = shallow(<OrgUsersSelector { ...usersProps } />);
      const formSelect = wrapper.find(Form).find(FormSelect);
      expect(formSelect.length).toEqual(1);
      expect(formSelect.props().options.length).toEqual(0);
    });
  });

  describe('when user does not have ability to invite other users', () => {
    it('does not render <Form /> component', () => {
      const noAccessProps = Object.assign({}, props, { currentUserAccess: false });
      wrapper = shallow(<OrgUsersSelector { ...noAccessProps } />);

      expect(wrapper.find(Form).length).toEqual(0);
    });
  });
});
