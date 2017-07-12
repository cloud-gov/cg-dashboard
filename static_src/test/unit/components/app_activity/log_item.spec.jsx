import '../../../global_setup';
import React from 'react';
import LogItem from '../../../../components/app_activity/log_item.jsx';
import { shallow } from 'enzyme';

describe('<LogItem />', () => {
  it('renders a log item component', () => {
    expect(shallow(<LogItem />).find('.activity_log-item_text').length).toBe(1);
  });

  it('renders its props as a message to the user', () => {
    const url = 'https://great-url.biz';
    const code = 200;
    const wrapper = shallow(<LogItem statusCode={ code } requestedUrl={ url } />);

    expect(wrapper.text()).toBe(`${code} ${url}`);
  });
});
