
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  title: React.PropTypes.string,
  helperText: React.PropTypes.object
};

const defaultProps = {
  title: null,
  helperText: null
};

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {

    let panelTitle = null;
    let panelHelperText = null;
    let panelHed = null;
    if (this.props.title != null) {
      panelTitle = <h1 className={ this.styler('panel-title') }>{ this.props.title }</h1>;
      if (this.props.helperText != null) {
        panelHelperText = <p className={ this.styler('panel-helpertext') }>{ this.props.helperText }</p>;
      }
      panelHed =  <div className={ this.styler('panel-header') }>
                    { panelTitle }
                    { panelHelperText }
                  </div>;
    }

    return (
      <div className={ this.styler('panel') }>
        { panelHed }
        { this.props.children }
      </div>
    );
  }
}

Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;
