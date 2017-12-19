/**
 * A component that renders a box with a different style and background
 */
import PropTypes from "prop-types";
import React from "react";
import Action from "./action.jsx";

const CONFIRM_STYLES = {
  INLINE: "inline",
  NEXTO: "nexto",
  OVER: "over",
  BLOCK: "block"
};

const propTypes = {
  style: PropTypes.oneOf(
    Object.keys(CONFIRM_STYLES).map(key => CONFIRM_STYLES[key])
  ),
  message: PropTypes.any,
  confirmationText: PropTypes.string,
  confirmHandler: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

const defaultProps = {
  style: CONFIRM_STYLES.INLINE,
  message: <div />,
  confirmationText: "Confirm delete",
  confirmHandler: ev => {
    console.log("confirm ev", ev);
  },
  cancelHandler: ev => {
    console.log("cancel ev", ev);
  }
};

export default class ConfirmationBox extends React.Component {
  render() {
    const styleClass = `confirm-${this.props.style}`;

    return (
      <div className={`confirm ${styleClass}`}>
        <span className="confirm-message">{this.props.message}</span>
        <div>
          <Action
            label="Cancel"
            style="base"
            type="outline"
            clickHandler={this.props.cancelHandler}
            disabled={this.props.disabled}
          >
            <span>Cancel</span>
          </Action>
          <Action
            label="Confirm"
            style="warning"
            clickHandler={this.props.confirmHandler}
            disabled={this.props.disabled}
          >
            <span>{this.props.confirmationText}</span>
          </Action>
        </div>
      </div>
    );
  }
}

ConfirmationBox.propTypes = propTypes;

ConfirmationBox.defaultProps = defaultProps;
