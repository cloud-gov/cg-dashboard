import '../../../global_setup';
import React from 'react';
import RawJSONDetail from '../../../../components/app_activity/raw_json_detail.jsx';
import { shallow } from 'enzyme';

describe('<RawJSONDetail />', () => {
  it('renders null when visible is false', () => {
    const wrapper = shallow(<RawJSONDetail />);

    expect(wrapper.children().length).toBe(0);
  });

  it('renders a code block of raw json when visible', () => {
    const wrapper = shallow(<RawJSONDetail visible={ 1 } item={ {} } />);

    expect(wrapper.find('.activity_log-item_raw').length).toBe(1);
    expect(wrapper.find('code').length).toBe(1);
    expect(wrapper.find('code').text()).toEqual('{}');
  });
});
