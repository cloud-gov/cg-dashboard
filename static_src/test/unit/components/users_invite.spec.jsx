import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';

import { Form } from '../../../components/form';
import UsersInvite from '../../../components/users_invite.jsx';
import Action from '../../../components/action.jsx';

import userActions from '../../../actions/user_actions';

import FormStore from '../../../stores/form_store';

const USERS_INVITE_FORM_GUID = 'users-invite-form';

describe('<UsersInvite />', function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('renders one <Form /> components', () => {
    const userInvite = shallow(<UsersInvite />);
    expect(userInvite.find(Form).length).toEqual(1);
  });

  it('renders one <Action /> components', () => {
    const userInvite = shallow(<UsersInvite />);
    expect(userInvite.find(Action).length).toEqual(1);
  });
});
