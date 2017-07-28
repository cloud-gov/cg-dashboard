import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';
import { Form } from '../../../components/form';
import OrgUsersSelector from '../../../components/users_org_user_selector.jsx';

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

  describe('when user sees a error message', () => {
    it('renders error in form', () => {
      const error = {};
      error.contextualMessage = "this is a message";
      error.message = "this is the medium"
      const errorProps = Object.assign({}, props, { error });
      wrapper = shallow(<OrgUsersSelector { ...errorProps } />);
      expect(wrapper.find(Form).find('.error_message').length).toEqual(1);
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
