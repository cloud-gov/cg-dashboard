import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const propTypes = {
  error: PropTypes.object,
  inline: PropTypes.bool.isRequired
};

const defaultProps = {
  error: null,
  inline: false
};

export default class ErrorMessage extends Component {
  renderMessage() {
    const { error } = this.props;
    if (!error) {
      return "An error occurred";
    }
    const { message, description } = error;
    return message || description;
  }

  render() {
    const { error, inline } = this.props;

    if (!error) {
      return null;
    }

    return (
      <div
        className={classNames("error_message", {
          "error-inline": inline
        })}
        role="alert"
      >
        {this.renderMessage()}
      </div>
    );
  }
}

ErrorMessage.propTypes = propTypes;

ErrorMessage.defaultProps = defaultProps;
