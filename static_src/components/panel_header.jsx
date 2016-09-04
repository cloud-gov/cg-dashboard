
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import panelCss from '../css/panel.css';

import createStyler from '../util/create_styler';

export default class PanelHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style, panelCss);
  }

  render() {
    return (
      <header className={ this.styler('panel-header') }>
        { this.props.children }
      </header>
    );
  }
}
