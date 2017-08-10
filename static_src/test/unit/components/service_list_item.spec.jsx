import '../../global_setup';
import React from 'react';
import { shallow } from 'enzyme';
import ServiceListItem from '../../../components/service_list_item.jsx';
import ServicePlanList from '../../../components/service_plan_list.jsx';

const props = {
  guid: 'abc',
  label: 'service',
  description: 'it does things',
  updatedAt: new Date(),
  servicePlans: []
};

describe('<ServiceListItem />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ServiceListItem { ...props } />);
  });

  it('renders a <ServicePlanList /> component', () => {
    const planList = wrapper.find(ServicePlanList);

    expect(planList.length).toBe(1);
    expect(planList.props()).toEqual({
      serviceGuid: props.guid,
      plans: props.servicePlans
    });
  });
});

