
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const STATES = [
  'error',
  'warning',
  'info',
  'success',
  'none'
];

const propTypes = {
  primaryStat: React.PropTypes.string.isRequired,
  statState: React.PropTypes.oneOf(STATES),
  secondaryInfo: React.PropTypes.element
};

const defaultProps = {
  statState: 'none',
  secondaryInfo: <span></span>
};

export default class Stat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const stateClass = `stat-${this.props.statState}`;

    return (
      <div className={ this.styler('stat', stateClass) }>
        <span className={ this.styler('stat-primary')}>
          { this.formatBytes(this.props.primaryStat) }
        </span>
        <span className={ this.styler('stat-info')}>
          { this.props.secondaryInfo }
        </span>
      </div>
    );
  }
}

Stat.propTypes = propTypes;
Stat.defaultProps = defaultProps;

