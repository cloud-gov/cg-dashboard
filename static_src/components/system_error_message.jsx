import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const displayTypeInline = 'inline';
const displayTypeGlobal = 'global';
const displayTypes = [displayTypeInline, displayTypeGlobal];

export default class SystemErrorMessage extends Component {
  constructor(props) {
    super(props);

    this.styler = createStyler(style);
  }

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
    const { displayType, error } = this.props;

    if (!error) {
      return null;
    }

    return (
      <div
        className={this.styler('error_message', `error-${displayType}`)}
        role="alert"
      >
        {this.errorMessage}
      </div>
    );
  }
}

SystemErrorMessage.propTypes = {
  error: PropTypes.object,
  displayType: PropTypes.oneOf(displayTypes).isRequired
};

SystemErrorMessage.defaultProps = {
  error: null,
  displayType: displayTypeInline
};
