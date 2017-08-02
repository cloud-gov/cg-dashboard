import '../../global_setup';

import React from 'react';
import ServiceInstance from '../../../components/service_instance.jsx';
import Action from '../../../components/action.jsx';
import FormError from '../../../components/form/form_error.jsx';
import { shallow } from 'enzyme';

const wrapperFactory = (Component, props) => shallow(<Component { ...props } />);

describe('<ServiceInstance />', () => {
  describe('when service instance is not bound', () => {
    const props = {
      serviceInstance: {},
      bound: false
    };

    it('renders a bind button', () => {
      const wrapper = wrapperFactory(ServiceInstance, props);
      const button = wrapper.find(Action);

      expect(button.length).toBe(1);
      expect(button.prop('label')).toBe('Bind');
    });
  });

  describe('when service instance is bound', () => {
    const props = {
      serviceInstance: {},
      bound: true
    };

    it('renders an unbind button', () => {
      const wrapper = wrapperFactory(ServiceInstance, props);
      const button = wrapper.find(Action);

      expect(button.length).toBe(1);
      expect(button.prop('label')).toBe('Unbind');
    });
  });

  it('displays an error when service instance has error property', () => {
    const errorMessage = 'Oh no, an error!';
    const props = {
      serviceInstance: {
        error: { description: errorMessage }
      },
      bound: false
    };

    const wrapper = wrapperFactory(ServiceInstance, props);
    const error = wrapper.find(FormError);

    expect(error.length).toBe(1);
    expect(error.prop('message')).toBe(errorMessage);
  });
});
