import PropTypes from "prop-types";
import React from "react";

import FormElement from "./form_element.jsx";
import FormError from "./form_error.jsx";

export default class FormSelect extends FormElement {
  constructor(props) {
    super(props);

    this.state = this.state || {};
    this.state.value = "";
    this.state.err = null;
  }

  render() {
    let error;

    if (this.state.err) {
      error = <FormError message={this.state.err.message} />;
    }
    return (
      <div>
        {error}
        <label htmlFor={this.key}>{this.props.label}</label>
        <select
          className={this.classes}
          name={this.key}
          id={this.key}
          onChange={this.onChange}
          value={this.state.value}
        >
          <option value="" key={`${this.key}-null`}>
            --
          </option>
          {this.props.options.map((option, i) => (
            <option value={option.value} key={`${this.key}-${i}`}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
FormSelect.propTypes = Object.assign(FormSelect.propTypes, {
  options: PropTypes.array
});
FormSelect.defaultProps = Object.assign(FormSelect.defaultProps, {
  options: []
});
