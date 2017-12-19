import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const propTypes = {
  error: PropTypes.object,
  inline: PropTypes.bool.isRequired
};

const defaultProps = {
  error: null,
  inline: true
};

export default class SystemErrorMessage extends Component {
  get errorMessage() {
    const { error } = this.props;
    const message = (error && error.message) || error.description;

    return message ? this.knownMessage(message) : this.shortDefaultMessage;
  }

  get statusCode() {
    return (this.props.error && this.props.error.status_code) || 500;
  }

  get shortDefaultMessage() {
    return (
      <span>
        The system returned an error ("status {this.statusCode}"). If you didn't
        expect this, <a href="https://cloud.gov/docs/help/">contact support</a>.
        You can also try again.
      </span>
    );
  }

  knownMessage(message) {
    return `The system returned an error, ${message}. Please try again`;
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
        {this.errorMessage}
      </div>
    );
  }
}

SystemErrorMessage.propTypes = propTypes;

SystemErrorMessage.defaultProps = defaultProps;
