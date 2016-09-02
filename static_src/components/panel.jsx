
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import panelCss from '../css/panel.css';

import createStyler from '../util/create_styler';

const propTypes = {
  title: React.PropTypes.string
};

const defaultProps = {
  title: 'Default title'
};

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style, panelCss);
  }

  render() {
    return (
      <div className={ this.styler('panel') }>
        <h1>{ this.props.title }</h1>
        <div className={ this.styler('panel-rows') }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;
