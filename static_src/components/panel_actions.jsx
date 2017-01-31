
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const ALIGN_TYPES = ['left', 'right', 'both'];

const propTypes = {
  children: React.PropTypes.any,
  align:  React.PropTypes.oneOf(ALIGN_TYPES)
};
const defaultProps = {
  children: [],
  align: ALIGN_TYPES[0]
};

export default class PanelActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const alignClass = `panel-actions-${this.props.align}`;
    return (
      <span className={ this.styler('panel-actions', alignClass) }>
        { this.props.children }
      </span>
    );
  }
}

PanelActions.propTypes = propTypes;
PanelActions.defaultProps = defaultProps;
