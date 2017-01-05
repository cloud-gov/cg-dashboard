
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

    let panelTitle = null;
    let panelSecondary = null;
    let panelHed = null;
    if (this.props.title != null) {
      panelTitle = <h1 className={ this.styler('panel-title') }>{ this.props.title }</h1>;
      if (this.props.secondary != null) {
        panelSecondary = <p className={ this.styler('panel-secondary') }>{ this.props.secondary }</p>;
      }
      panelHed =  <div className={ this.styler('panel-header') }>
                    { panelTitle }
                    { panelSecondary }
                  </div>;
    }

    return (
      <div className={ this.styler('panel') }>
        { panelHed }
        <div className={ this.styler('panel-rows') }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;
