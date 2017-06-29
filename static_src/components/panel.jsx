
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import PanelHeader from './panel_header.jsx';
import createStyler from '../util/create_styler';

const propTypes = {
  title: React.PropTypes.string,
  children: React.PropTypes.any
};

const defaultProps = {
  title: 'Default title'
};

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    let panelHed;

    if (this.props.title !== '') {
      panelHed = (
        <PanelHeader>
          <h1 className={ this.styler('panel-title') }>{ this.props.title }</h1>
        </PanelHeader>
      );
    }

    return (
      <div className={ this.styler('panel') }>
        {panelHed}
        <div>
          { this.props.children }
        </div>
      </div>
    );
  }
}

Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;
