
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';
import formatBytes from '../util/format_bytes';

const STATES = [
  'error',
  'warning',
  'info',
  'success',
  'none'
];

const propTypes = {
  name: React.PropTypes.string,
  editable: React.PropTypes.bool,
  primaryStat: React.PropTypes.string.isRequired,
  statState: React.PropTypes.oneOf(STATES),
  secondaryInfo: React.PropTypes.element
};

const defaultProps = {
  editable: false,
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
    let primaryStat = (
      <span className={ this.styler('stat-primary')}>
	{ formatBytes(this.props.primaryStat) }
      </span>
    );

    if (this.props.editable) {
      primaryStat = <input type="text" name={ this.props.name } value={ this.props.primaryStat } />;
    }

    return (
      <div className={ this.styler('stat', stateClass) }>
        { primaryStat }
        <span className={ this.styler('stat-info')}>
          { this.props.secondaryInfo }
        </span>
      </div>
    );
  }
}

Stat.propTypes = propTypes;
Stat.defaultProps = defaultProps;
