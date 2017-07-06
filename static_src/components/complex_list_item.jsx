
import PropTypes from 'prop-types';
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const propTypes = {
  children: PropTypes.any
};

const defaultProps = {};

export default class ComplexListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    return (
      <div className={ this.styler('complex_list-item') }>
        { this.props.children }
      </div>
    );
  }
}

ComplexListItem.propTypes = propTypes;
ComplexListItem.defaultProps = defaultProps;
