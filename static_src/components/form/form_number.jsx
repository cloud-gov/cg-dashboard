import React from 'react';

import FormText from './form_text.jsx';
import { validateNumber } from '../../util/validators';


export default class FormNumber extends React.Component {
  constructor(props) {
    super(props);
    this.validateNumber = validateNumber({ max: props.max, min: props.min }).bind(this);
  }

  render() {
    const props = Object.assign({}, this.props, { validator: this.validateNumber });
    return <FormText { ...props } />;
  }
}

FormNumber.propTypes = {
  min: React.PropTypes.number,
  max: React.PropTypes.number
};
