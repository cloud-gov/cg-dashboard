import '../../global_setup';

import React from 'react';
import CreateServiceInstance from '../../../components/create_service_instance.jsx';
import FormError from '../../../components/form/form_error.jsx';
import Immutable from 'immutable';
import SpaceStore from '../../../stores/space_store';
import ServiceInstanceStore from '../../../stores/service_instance_store';
import serviceActions from '../../../actions/service_actions';
import { shallow } from 'enzyme';

describe('<CreateServiceInstance />', () => {
  beforeEach(() => {
    ServiceInstanceStore._createError = { description: 'Bad stuff everyone' };
  });

  afterEach(() => {
    ServiceInstanceStore._createError = null;
  });

  it('displays an error message when ServiceInstanceStore has one', () => {
    SpaceStore._data = Immutable.fromJS([]);

    const wrapper = shallow(<CreateServiceInstance servicePlan={ {} } />);

    expect(wrapper.find(FormError).length).toBe(1);
  });

  describe('._onValidForm()', () => {
    it('calls serviceActions.createInstance with the proper arguments', () => {
      const plan = { guid: '123abc' };
      const spy = sinon.spy(serviceActions, 'createInstance');
      const wrapper = shallow(<CreateServiceInstance servicePlan={ plan } />);
      const form = {
        name: {
          value: 'test'
        }
      };

      wrapper.instance()._onValidForm({}, form);

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(form.name.value, null, plan.guid);
      expect(typeof spy.getCall(0).args[0]).toBe('string');
    });
  });
});
