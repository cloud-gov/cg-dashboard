import '../../global_setup';

import React from 'react';
import CreateServiceInstance from '../../../components/create_service_instance.jsx';
import FormError from '../../../components/form/form_error.jsx';
import Immutable from 'immutable';
import SpaceStore from '../../../stores/space_store';
import ServiceInstanceStore from '../../../stores/service_instance_store';
import { shallow } from 'enzyme';

describe('<CreateServiceInstance />', () => {
  beforeEach(() => {
    ServiceInstanceStore._createError = { description: 'Bad stuff everyone' };
  });

  it('displays an error message when ServiceInstanceStore has one', () => {
    SpaceStore._data = Immutable.fromJS([]);

    const wrapper = shallow(<CreateServiceInstance servicePlan={ {} } />);

    expect(wrapper.find(FormError).length).toBe(1);
  });
});
