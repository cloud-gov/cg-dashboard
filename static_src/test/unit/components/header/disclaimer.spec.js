import '../../../global_setup';
import React from 'react';
import { shallow } from 'enzyme';

import Disclaimer from '../../../../components/header/disclaimer';

describe('<Disclaimer />', () => {
  it('renders without crashing', () => {
    shallow(<Disclaimer />);
  });
});
