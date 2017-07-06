
import PropTypes from 'prop-types';
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  title: PropTypes.string
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

    let panelHed = null;
    if (this.props.title != '') {
      panelHed = <h1 className={ this.styler('panel-title') }>{ this.props.title }</h1>;
    }

    return (
      <div className={ this.styler('panel') }>
        {panelHed}
        <div className={ this.styler('panel-rows') }>
          { this.props.children }
        </div>
      </div>
    );
  }
}

Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;
