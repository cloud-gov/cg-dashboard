
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

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
  render() {
    const { props } = this;
    const classes = classnames({
      [`panel-row-${props.styleClass}`]: props.styleClass,
      'panel-row': props.styleClass !== 'boxed'
    });

    return (
      <div id={ this.props.id } className={ classes }>
        { this.props.children }
      </div>
    );
  }
}

PanelRow.propTypes = propTypes;
PanelRow.defaultProps = defaultProps;
