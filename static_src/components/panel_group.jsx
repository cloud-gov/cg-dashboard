
import PropTypes from 'prop-types';
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  columns: PropTypes.number,
  children: PropTypes.any
};
const defaultProps = {
  columns: 0,
  children: null
};

export default class PanelGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    let gridClass = '';
    if (this.props.columns !== 0) {
      gridClass = `grid-width-${this.props.columns}`;
    }
    return (
      <div className={ this.styler('panel-group', gridClass) }>
        { this.props.children }
      </div>
    );
  }
}

PanelGroup.propTypes = propTypes;
PanelGroup.defaultProps = defaultProps;
