import '../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';
import Users from '../../../components/users.jsx';
import UserStore from '../../../stores/user_store';

describe('<UsersInvite />', function () {
  let users, sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });
});
