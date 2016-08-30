
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import panelCss from '../css/panel.css';

import createStyler from '../util/create_styler';

const propTypes = {
  children: React.PropTypes.any
};
const defaultProps = {
  children: []
};

export default class PanelActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style, panelCss);
  }

  render() {
    return (
      <span className={ this.styler('panel-actions') }>
        { this.props.children }
      </span>
    );
  }
}

PanelActions.propTypes = propTypes;
PanelActions.defaultProps = defaultProps;
