
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const STYLES = [
  'bordered',
  'boxed',
  'none'
];

const propTypes = {
  styleClass: React.PropTypes.oneOf(STYLES)
};

const defaultProps = {};

export default class PanelRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const props = this.props;
    const styleClass = props.styleClass && `panel-row-${this.props.styleClass}`;
    const mainClass = props.styleClass !== 'boxed' && 'panel-row';

    return (
      <div className={ this.styler(mainClass, styleClass) }>
        { this.props.children }
      </div>
    );
  }
}

PanelRow.propTypes = propTypes;
PanelRow.defaultProps = defaultProps;
