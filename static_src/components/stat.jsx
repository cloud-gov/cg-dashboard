
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
  primaryStat: React.PropTypes.number.isRequired,
  statState: React.PropTypes.oneOf(STATES),
  secondaryInfo: React.PropTypes.element
};

const defaultProps = {
  editable: false,
  statState: 'none',
  secondaryInfo: <span></span>
};

function stateSetter(props) {
  return {
    primaryStat: props.primaryStat
  };
}

export default class Stat extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter(props);
    this.styler = createStyler(style);
    this._onChange = this._onChange.bind(this);
  }

  _onChange(e) {
    this.setState(stateSetter({ primaryStat: e.target.value }));
  }

  render() {
    const stateClass = `stat-${this.props.statState}`;
    let primaryStat = (
      <span className={ this.styler('stat-primary')}>
	{ formatBytes(this.state.primaryStat) }
      </span>
    );

    if (this.props.editable) {
      primaryStat = (
        <input
          type="text"
          id={ this.props.name }
          name={ this.props.name }
          value={ this.state.primaryStat }
          onChange={ this._onChange }
        />
      );
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
