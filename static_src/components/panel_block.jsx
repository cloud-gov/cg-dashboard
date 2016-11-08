
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  columns: React.PropTypes.number
};
const defaultProps = {
  columns: 0
};

export default class PanelBlock extends React.Component {
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
      <div className={ this.styler('panel-block', gridClass) }>
        { this.props.children }
      </div>
    );
  }
}

PanelBlock.propTypes = propTypes;
PanelBlock.defaultProps = defaultProps;
