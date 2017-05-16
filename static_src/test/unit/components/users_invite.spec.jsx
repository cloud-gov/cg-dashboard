import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';

import { Form } from '../../../components/form';
import UsersInvite from '../../../components/users_invite.jsx';
import Action from '../../../components/action.jsx';

import FormStore from '../../stores/form_store';

const USERS_INVITE_FORM_GUID = 'users-invite-form';

describe('<UsersInvite />', function () {
  let sandbox;
  let userInvite;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    FormStore.create(USERS_INVITE_FORM_GUID);
    userInvite = shallow(<UsersInvite />);
  });

  afterEach(function () {
    sandbox.restore();
  });
  it('renders one <Form /> components', () => {
    expect(userInvite.find(Form)).to.have.length(1);
  });

  it('renders one <Action /> components', () => {
    expect(userInvite.find(Action)).to.have.length(1);
  });
});
