import PropTypes from "prop-types";
import React from "react";
import classnames from "classnames";
import Link from "./action/link.jsx";
import Button from "./action/button.jsx";

const BUTTON_TYPES = {
  BUTTON: "button",
  OUTLINE: "outline",
  LINK: "link",
  SUBMIT: "submit"
};
const BUTTON_STYLES = ["warning", "primary", "finish", "base", "white"];
const propTypes = {
  children: PropTypes.any,
  classes: PropTypes.array,
  clickHandler: PropTypes.func,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.oneOf(BUTTON_STYLES),
  type: PropTypes.oneOf(Object.keys(BUTTON_TYPES).map(t => BUTTON_TYPES[t]))
};
const defaultProps = {
  style: "primary",
  classes: [],
  label: "",
  type: "button",
  disabled: false,
  clickHandler: () => true
};

export default class Action extends React.Component {
  get baseClasses() {
    return `action action-${this.props.style}`;
  }

  get classes() {
    return this.props.classes.join(" ");
  }

  get buttonClasses() {
    if (this.typeOfLink) return {};

    return classnames(
      {
        "action-outline": this.props.type === BUTTON_TYPES.OUTLINE,
        "usa-button-disabled": this.props.disabled
      },
      "usa-button",
      `usa-button-${this.props.style}`
    );
  }

  get sharedProps() {
    return {
      className: classnames(this.baseClasses, this.classes, this.buttonClasses),
      label: this.props.label,
      clickHandler: this.props.clickHandler
    };
  }

  get buttonProps() {
    const htmlButtonType =
      this.props.type === BUTTON_TYPES.BUTTON
        ? BUTTON_TYPES.BUTTON
        : BUTTON_TYPES.SUBMIT;

    return { disabled: this.props.disabled, type: htmlButtonType };
  }

  get linkProps() {
    return { href: this.props.href };
  }

  get typeOfLink() {
    return this.props.type === BUTTON_TYPES.LINK;
  }

  get isLink() {
    return this.props.href || this.typeOfLink;
  }

  get component() {
    return this.isLink ? Link : Button;
  }

  render() {
    const Component = this.component;
    const extraProps = this.isLink ? this.linkProps : this.buttonProps;

    return (
      <Component {...this.sharedProps} {...extraProps}>
        {this.props.children}
      </Component>
    );
  }
}

Action.propTypes = propTypes;
Action.defaultProps = defaultProps;
