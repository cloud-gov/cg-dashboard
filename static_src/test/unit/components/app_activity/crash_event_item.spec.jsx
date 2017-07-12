import '../../../global_setup';
import React from 'react';
import CrashEventItem from '../../../../components/app_activity/crash_event_item.jsx';
import { shallow } from 'enzyme';

const crashPrefix = 'The app crashed because';

describe('<CrashEventItem />', () => {
  it('renders a span tag with a fallback if no props supplied', () => {
    const wrapper = shallow(<CrashEventItem />);

    expect(wrapper.find('span').length).toBe(1);
    expect(wrapper.text()).toBe(`${crashPrefix} of an unknown reason.`);
  });

  it('renders the correct messages based on props', () => {
    const status = 200;

    const descriptions = {
      'app instance exited': `the app instance exited with ${status} status.`,
      'out of memory': 'it ran out of memory.',
      'failed to accept connections within health check timeout':
        'it failed to accept connections within health check timeout.',
      'failed to start': 'it failed to start.'
    };

    Object.keys(descriptions).forEach(description => {
      const props = { exitDescription: description, exitStatus: status };
      const wrapper = shallow(<CrashEventItem { ...props } />);

      expect(wrapper.text()).toBe(`${crashPrefix} ${descriptions[description]}`);
    });
  });
});
