import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';
import { Form, FormSelect } from '../../../components/form';
import PanelDocumentation from '../../../components/panel_documentation.jsx';
import UsersParentEntityUserSelector from '../../../components/users_parent_entity_user_selector.jsx';
import Action from '../../../components/action.jsx';
import userActions from '../../../actions/user_actions';

describe('<UsersParentEntityUserSelector />', function () {
  const entityType = 'space';
  const props = {
    inviteEntityType: entityType,
    currentUserAccess: true
  };
  let wrapper;

  describe('when user does not have ability to invite other users', () => {
    it('does not render <Form /> component', () => {
      const noAccessProps = Object.assign({}, props, { currentUserAccess: false });
      wrapper = shallow(<UsersParentEntityUserSelector { ...noAccessProps } />);

      expect(wrapper.find(Form).length).toEqual(0);
    });
  });
});
