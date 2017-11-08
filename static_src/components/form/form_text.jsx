import PropTypes from "prop-types";
import React from "react";
import FormElement from "./form_element.jsx";
import FormError from "./form_error.jsx";
import classNames from "classnames";

export default class FormText extends FormElement {
  get error() {
    if (!this.state.err) {
      return null;
    }

    return <FormError message={this.state.err.message} />;
  }

  render() {
    const classes = classNames({
      "form_text-inline": this.props.inline,
      error: !!this.error
    });

    // Spaces in label give a healthy space for inline forms
    const label = <label htmlFor={this.key}> {this.props.label} </label>;
    return (
      <div className={classes}>
        {!this.props.labelAfter && label}
        <input
          type="text"
          id={this.key}
          value={this.state.value}
          onChange={this.onChange}
          className={this.classes}
        />
        {this.props.labelAfter && label}
        {this.error}
      </div>
    );
  }
}

FormText.propTypes = Object.assign({}, FormElement.propTypes, {
  inline: PropTypes.bool,
  labelAfter: PropTypes.bool
});

FormText.defaultProps = Object.assign({}, FormElement.defaultProps, {
  inline: false,
  labelAfter: false
});
