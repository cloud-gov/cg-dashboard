
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import panelCss from '../css/panel.css';

import createStyler from '../util/create_styler';

const propTypes = {
  disabled: React.PropTypes.bool,
  text: React.PropTypes.string.isRequired,
  type: React.PropTypes.string,
  handleClick: React.PropTypes.func
};

const defaultProps = {
  disabled: false,
  handleClick: (e) => e,
  type: 'link'
};

export default class PanelAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style, panelCss);
  }

  render() {
    let css = [];
    if (this.props.type !== 'link') {
      css = ['usa-button', `usa-button-${this.props.type}`];
    }

    return (
      <span className={ this.styler('panel-action') }>
        <a href="#" className={ this.styler.apply(this, css) }
          onClick={ this.props.handleClick } disabled={ this.props.disabled }
        >
          { this.props.text }
        </a>
      </span>
    );
  }
}

PanelAction.propTypes = propTypes;
PanelAction.defaultProps = defaultProps;
