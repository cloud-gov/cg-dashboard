import '../../global_setup';
import React from 'react';
import { shallow } from 'enzyme';
import ServicePlan from '../../../components/service_plan.jsx';
import Action from '../../../components/action.jsx';

describe('<ServicePlan />', () => {
  const props = {
    cost: 'Free',
    onAddInstance: sinon.spy(),
    plan: {
      guid: 'zgwefzexst4',
      name: 'redis',
      description: 'in-memory key value store'
    }
  };
  const findPlanNodeByLabel = (wrapper, label) =>
    wrapper.find('td').filterWhere(node => node.prop('label') === label);

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ServicePlan { ...props } />);
  });

  it('renders an action button for service instance creation', () => {
    const button = wrapper.find(Action);

    expect(button.length).toBe(1);
    expect(button.props().children).toBe('Create service instance');
  });

  it('renders the name of the plan', () => {
    const name = findPlanNodeByLabel(wrapper, 'Name');

    expect(name.text()).toBe(props.plan.name);
  });

  it('renders the plan description', () => {
    const description = findPlanNodeByLabel(wrapper, 'Description');

    expect(description.text()).toBe(props.plan.description);
  });

  it('renders the cost of the plan', () => {
    const cost = findPlanNodeByLabel(wrapper, 'Cost');

    expect(cost.text()).toBe(props.cost);
  });

  it('calls its `onAddInstance` prop passing the plan guid from handler', () => {
    wrapper.instance().handleClick();

    expect(props.onAddInstance.calledOnce).toBe(true);
    expect(props.onAddInstance.calledWith(props.plan.guid)).toBe(true);
  });
});

describe('<ServicePlan with multi param plan />', () => {
  it('renders an action button for cdn-route', () => {
    const props = {
      cost: 'Free',
      onAddInstance: sinon.spy(),
      plan: {
        guid: 'zgwefzexst4',
        name: 'cdn-route',
        description: 'in-memory key value store'
      }
    };
    const wrapper = shallow(<ServicePlan { ...props } />);
    const button = wrapper.find(Action);

    expect(button.length).toBe(1);
    expect(button.props().children).toBe('Display documentation link');
  });

  it('renders an action button for cloud-gov-identity-provider', () => {
    const props = {
      cost: 'Free',
      onAddInstance: sinon.spy(),
      plan: {
        guid: 'zgwefzexst4',
        name: 'cloud-gov-identity-provider',
        description: 'in-memory key value store'
      }
    };
    const wrapper = shallow(<ServicePlan { ...props } />);
    const button = wrapper.find(Action);

    expect(button.length).toBe(1);
    expect(button.props().children).toBe('Display documentation link');
  });

  it('renders an action button for cloud-gov-service-account', () => {
    const props = {
      cost: 'Free',
      onAddInstance: sinon.spy(),
      plan: {
        guid: 'zgwefzexst4',
        name: 'cloud-gov-service-account',
        description: 'in-memory key value store'
      }
    };
    const wrapper = shallow(<ServicePlan { ...props } />);
    const button = wrapper.find(Action);

    expect(button.length).toBe(1);
    expect(button.props().children).toBe('Display documentation link');
  });
});
