
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  flex: React.PropTypes.number,
  children: React.PropTypes.any
};

const defaultProps = {
  flex: 0,
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
    if (this.props.flex !== 0) {
      gridClass = `col-flex-${this.props.flex}`;
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
