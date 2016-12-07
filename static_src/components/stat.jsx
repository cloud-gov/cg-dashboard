
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
  onChange: React.PropTypes.func,
  primaryStat: React.PropTypes.number.isRequired,
  statState: React.PropTypes.oneOf(STATES),
  secondaryInfo: React.PropTypes.element
};

const defaultProps = {
  editable: false,
  onChange: (e) => e.preventDefault(),
  statState: 'none',
  secondaryInfo: <span></span>,
  unit: 'MB'
};

function stateSetter(props) {
  return {
    primaryStat: props.primaryStat,
    unit: props.unit
  };
}

const convert = {
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024
};

export default class Stat extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter(props);
    this.styler = createStyler(style);
    this._onChange = this._onChange.bind(this);
  }

  _onChange(e) {
    let unit = this.state.unit;

    if (e.target.name === `${this.props.name}-size`) {
      unit = e.target.value;
      this.setState({ primaryStat: this.state.primaryStat, unit });
      return;
    }

    const value = this.toBytes(e.target.value);
    this.props.onChange(value);
    this.setState(stateSetter({ primaryStat: value, unit }));
  }

  toBytes(value) {
    return value * convert[this.state.unit];
  }

  fromBytes(value) {
    return Math.floor(value / convert[this.state.unit]);
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
        <div>
          <input
            className={ this.styler('stat-input', 'stat-input-text') }
            type="text"
            id={ `${this.props.name}-value` }
            name={ `${this.props.name}-value` }
            value={ this.fromBytes(this.state.primaryStat) }
            onChange={ this._onChange }
          />
          <label className={ this.styler('stat-input', 'stat-input-label') } htmlFor={ `${this.props.name}-value` }>MB</label>
        </div>
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
