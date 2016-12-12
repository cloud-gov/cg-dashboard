
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import { FormNumber, FormError } from './form';
import createStyler from '../util/create_styler';
import formatBytes from '../util/format_bytes';
import { validateNumber } from '../util/validators';

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
  err: React.PropTypes.object,
  max: React.PropTypes.number,
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
    err: props.err || null,
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
    this.styler = createStyler(style);
    this._onChange = this._onChange.bind(this);
    this.validator = validateNumber({ min: 1, max: this.props.max });

    const err = props.err || this.validator(props.primaryStat);
    this.state = stateSetter(Object.assign({}, props, { err }));
  }

  _onChange(e) {
    let unit = this.state.unit;

    if (e.target.name === `${this.props.name}-size`) {
      unit = e.target.value;
      this.setState({ primaryStat: this.state.primaryStat, unit });
      return;
    }

    const err = this.validator(e.target.value);
    const value = this.toBytes(e.target.value);
    this.props.onChange(value);
    this.setState(stateSetter({ primaryStat: value, err, unit }));
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
      const err = this.state.err && <FormError message={ this.state.err.message } />;
      primaryStat = (
        <div>
          <input
            className={ this.styler('stat-input', 'stat-input-text') }
            type="text"
            id={ `${this.props.name}-value` }
            label="MB"
            name={ `${this.props.name}-value` }
            value={ this.fromBytes(this.state.primaryStat) }
            onChange={ this._onChange }
          />
          <label className={ this.styler('stat-input', 'stat-input-label') } htmlFor={ `${this.props.name}-value` }>MB</label>
          { err }
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



class FormElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };

    this.onChange.bind(this);
  }

  onChange(e) {
    const err = this.props.validate(e.target.value);
    if (err) {
      this.props.error(err);
    }

    this.setState({ value: e.target.value, err });
  }

  render() {
    return <input { ...this.props } value={ this.state.value } onChange={ this.onChange } />;
  }
}

FormElement.propTypes = {
  error: React.PropTypes.func,
  value: React.PropTypes.string,
  validate: React.PropTypes.func
};

FormElement.defaultProps = {
  error: () => {},
  validate: () => {}
};
