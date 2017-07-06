import PropTypes from 'prop-types';
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../../util/create_styler';

const propTypes = { message: PropTypes.string };
const defaultProps = { message: '' };

export default class FormError extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <span className={ this.styler('error_message')}>
        { this.props.message }
      </span>
    );
  }
}

FormError.propTypes = propTypes;
FormError.defaultProps = defaultProps;
