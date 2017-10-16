import '../../../global_setup';
import React from 'react';
import { shallow } from 'enzyme';

import UPSIPanel from '../../../../components/upsi/upsi_panel';
import Panel from '../../../../components/panel.jsx';
import ComplexList from '../../../../components/complex_list.jsx';
import ComplexListItem from '../../../../components/complex_list_item.jsx';

const defaultApp = {
  guid: '1234',
  name: 'App',
  updating: false,
  services: []
};

const defaultUPSIsRequest = {
  isFetching: false,
  error: false,
  items: []
};

describe('<UPSIPanel />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(
      <UPSIPanel app={defaultApp} upsisRequest={defaultUPSIsRequest} />
    );

    expect(wrapper.find(Panel).length).toBe(1);

    expect(wrapper.find(ComplexList).length).toBe(2);
  });

  const tests = [
    {
      name: '0 instances bound, 2 others',
      services: [],
      upsis: [{ guid: 'abcd' }, { guid: 'efgh' }],
      bound: 0,
      other: 2
    },
    {
      name: '1 instance bound, 1 other',
      services: [{ guid: 'abcd' }],
      upsis: [{ guid: 'abcd' }, { guid: 'efgh' }],
      bound: 1,
      other: 1
    },
    {
      name: '2 instances bound, 0 others',
      services: [{ guid: 'efgh' }, { guid: 'abcd' }],
      upsis: [{ guid: 'abcd' }, { guid: 'efgh' }],
      bound: 2,
      other: 0
    }
  ];

  for (const { name, services, upsis, bound, other } of tests) {
    it(`renders bound UPSIs correctly › ${name}`, () => {
      const wrapper = shallow(
        <UPSIPanel
          app={{
            ...defaultApp,
            services
          }}
          upsisRequest={{
            ...defaultUPSIsRequest,
            items: upsis
          }}
        />
      );

      expect(
        wrapper
          .find({ title: 'Bound to app' })
          .dive()
          .find(ComplexListItem).length
      ).toBe(bound);

      expect(
        wrapper
          .find({ title: 'Other instances in this space' })
          .dive()
          .find(ComplexListItem).length
      ).toBe(other);
    });
  }
});
