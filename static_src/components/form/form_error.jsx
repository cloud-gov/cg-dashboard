import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../../util/create_styler';

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

FormError.propTypes = { message: React.PropTypes.string };
FormError.defaultProps = { message: '' };
