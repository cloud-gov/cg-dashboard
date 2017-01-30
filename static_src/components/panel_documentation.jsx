
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  children: React.PropTypes.any,
  description: React.PropTypes.bool
};
const defaultProps = {
  children: null,
  description: false
};

export default class PanelDocumentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const descClass = this.props.description && 'panel-documentation-desc';

    return (
      <div className={ this.styler('panel-documentation', descClass) }>
        { this.props.children }
      </div>
    );
  }
}

PanelDocumentation.propTypes = propTypes;
PanelDocumentation.defaultProps = defaultProps;
