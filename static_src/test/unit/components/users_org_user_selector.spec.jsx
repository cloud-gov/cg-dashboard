import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';
import { Form } from '../../../components/form';
import ParentUserSelector from '../../../components/users_parent_entity_user_selector.jsx';

describe('<ParentUserSelector />', function () {
  const entityType = 'space';
  const props = {
    inviteEntityType: entityType,
    currentUserAccess: true
  };
  let wrapper;

  describe('when user does not have ability to invite other users', () => {
    it('does not render <Form /> component', () => {
      const noAccessProps = Object.assign({}, props, { currentUserAccess: false });
      wrapper = shallow(<ParentUserSelector { ...noAccessProps } />);

      expect(wrapper.find(Form).length).toEqual(0);
    });
  });
});
