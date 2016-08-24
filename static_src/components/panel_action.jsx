
import style from 'cloudgov-style';
import React from 'react';

import panelCss from '../css/panel.css';

import createStyler from '../util/create_styler';

const propTypes = {
  text: React.PropTypes.string.isRequired,
  handleClick: React.PropTypes.func
};

const defaultProps = {
  handleClick: (e) => e
};

export default class PanelAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style, panelCss);
  }

  render() {
    return (
      <span className={ this.styler('panel-action') }>
        <a href="#" onClick={ this.props.handleClick }>{ this.props.text }</a>
      </span>
    );
  }
}

PanelAction.propTypes = propTypes;
PanelAction.defaultProps = defaultProps;
