import PropTypes from "prop-types";
import React from "react";

import FormText from "./form_text.jsx";
import { validateInteger } from "../../util/validators";

const propTypes = {
  min: PropTypes.number,
  max: PropTypes.number
};

export default class FormNumber extends React.Component {
  constructor(props) {
    super(props);
    this.validateInteger = validateInteger({
      max: props.max,
      min: props.min
    }).bind(this);
  }

  componentWillReceiveProps(props) {
    this.validateInteger = validateInteger({
      max: props.max,
      min: props.min
    }).bind(this);
  }

  render() {
    const props = Object.assign({}, this.props, {
      validator: this.validateInteger
    });
    return <FormText {...props} />;
  }
}

FormNumber.propTypes = propTypes;
