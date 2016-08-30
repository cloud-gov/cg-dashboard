
import style from 'cloudgov-style';
import React from 'react';

import panelCss from '../css/panel.css';

import createStyler from '../util/create_styler';

export default class PanelGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style, panelCss);
  }

  render() {
    return (
      <div className={ this.styler('panel-group') }>
        { this.props.children }
      </div>
    );
  }
}
