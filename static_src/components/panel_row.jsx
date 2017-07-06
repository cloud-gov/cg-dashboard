
import PropTypes from 'prop-types';
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const STYLES = [
  'bordered',
  'boxed',
  'clean', // TODO this should be reconciled with panel-row and panel-row-bordered
  'none'
];

const propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any,
  styleClass: PropTypes.oneOf(STYLES)
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
      <div id={ this.props.id }
        className={ [this.props.className, this.styler(mainClass, styleClass)].join(' ') }
      >
        { this.props.children }
      </div>
    );
  }
}

PanelRow.propTypes = propTypes;
PanelRow.defaultProps = defaultProps;
