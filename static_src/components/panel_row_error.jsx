
import React from 'react';

import {FormError} from './form';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

export default class RowError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    return (
      <span style={{ textAlign: 'right' }}
        className={this.styler('panel-column', 'panel-column-less')}>
        <FormError message={ this.props.message } />
      </span>
    );
  }
}

RowError.propTypes = { message: React.PropTypes.string };
RowError.defaultProps = { message: 'Unknown error' };
