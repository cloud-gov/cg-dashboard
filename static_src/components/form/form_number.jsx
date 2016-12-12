import React from 'react';

import FormText from './form_text.jsx';


export default class FormNumber extends React.Component {
  constructor(props) {
    super(props);
    this.validateNumber = this.validateNumber.bind(this);
  }

  validateNumber(text) {
    const value = parseInt(text, 10);
    if (typeof value !== 'number') {
      return { message: 'Invalid number' };
    }

    if (Number.isNaN(value)) {
      return { message: 'Invalid number' };
    }

    const min = this.props.min;
    if (typeof min === 'number' && value < min) {
      return { message: `Total must be greater than ${min}` };
    }

    const max = this.props.max;
    if (typeof max === 'number' && value > max) {
      return { message: `Total exceeds ${max}` };
    }

    return null;
  }

  render() {
    return <FormText { ...this.props } validator={ this.validateNumber } />;
  }
}

FormNumber.propTypes = Object.assign({}, FormText.propTypes, {
  min: React.PropTypes.number,
  max: React.PropTypes.number
});

FormNumber.defaultProps = FormText.defaultProps;
