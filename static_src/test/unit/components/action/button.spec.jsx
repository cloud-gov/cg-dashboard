import '../../../global_setup.js';

import React from 'react';
import { shallow } from 'enzyme';
import Button from '../../../../components/action/button.jsx';

describe('<Button/>', () => {
  it('returns a button tag', () => {
    expect(shallow(<Button />).find('button').length).toBe(1);
  });

  it('supplies the correct props to its child', () => {
    const props = {
      className: 'usa-button',
      disabled: false,
      clickHandler: () => true,
      type: 'button',
      label: 'my-button'
    };
    const button = shallow(<Button { ...props } />);
    const actualProps = button.find('button').props();

    expect(actualProps.className).toEqual(props.className);
    expect(actualProps.disabled).toEqual(props.disabled);
    expect(actualProps.onClick).toEqual(props.clickHandler);
    expect(actualProps.type).toEqual(props.type);
    expect(actualProps['aria-label']).toEqual(props.label);
  });
});
