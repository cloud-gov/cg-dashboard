import '../../global_setup';
import React from 'react';
import ServiceInstanceTable from '../../../components/service_instance_table.jsx';
import Loading from '../../../components/loading.jsx';
import ServiceInstanceStore from '../../../stores/service_instance_store';
import serviceInstances from '../../server/fixtures/service_instances';
import Immutable from 'immutable';
import { shallow } from 'enzyme';

describe('<ServiceInstanceStore />', () => {
  const instances = serviceInstances.map(instance => instance.entity);
  let wrapper;

  beforeEach(() => {
    ServiceInstanceStore._data = Immutable.fromJS(instances);
    wrapper = shallow(<ServiceInstanceTable />);
    wrapper.setState({
      serviceInstances: ServiceInstanceStore.getAll(),
      empty: false,
      updating: true
    }, () => wrapper.update());
  });

  describe('deleting a service instance', () => {
    it('renders a loading badge when updating state is true', () => {
      expect(wrapper.find(Loading).length).toBe(1);
    });
  });
});
