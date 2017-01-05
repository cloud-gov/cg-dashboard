
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  title: React.PropTypes.string,
  secondary: React.PropTypes.object
};

const defaultProps = {
  title: null,
  secondary: null
};

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {

    let panelHed = null;
    if (this.props.title != '') {
      panelHed = <h1 className={ this.styler('panel-title') }>{ this.props.title }</h1>;
    }

    let panelSecondary = null;
    if (this.props.secondary != '') {
      panelSecondary = <p className={ this.styler('panel-secondary') }>{ this.props.secondary }</p>;
    }

    return (
      <div className={ this.styler('panel') }>
        <div className={ this.styler('panel-header') }>
          {panelHed}
          {panelSecondary}
        </div>
        <div className={ this.styler('panel-rows') }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;
