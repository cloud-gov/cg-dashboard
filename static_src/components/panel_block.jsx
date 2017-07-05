
import PropTypes from 'prop-types';
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  children: PropTypes.any
};
const defaultProps = {
  children: null
};

export default class PanelBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    return (
      <div className={ this.styler('panel-block') }>
        { this.props.children }
      </div>
    );
  }
}

PanelBlock.propTypes = propTypes;
PanelBlock.defaultProps = defaultProps;
