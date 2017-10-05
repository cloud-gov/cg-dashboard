import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const displayTypeInline = 'inline';
const displayTypeGlobal = 'global';
const displayTypes = [displayTypeInline, displayTypeGlobal];

const propTypes = {
  error: PropTypes.object,
  displayType: PropTypes.oneOf(displayTypes).isRequired
};

const defaultProps = {
  error: null,
  displayType: displayTypeInline
};

export default class ErrorMessage extends Component {
  constructor(props) {
    super(props);

    this.styler = createStyler(style);
  }

  renderMessage() {
    const { error } = this.props;
    if (!error) {
      return 'An error occurred';
    }
    const { message, description } = error;
    return message || description;
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
        {this.renderMessage()}
      </div>
    );
  }
}

ErrorMessage.propTypes = propTypes;

ErrorMessage.defaultProps = defaultProps;
