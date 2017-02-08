
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import { FormNumber, FormText } from './form';
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
  title: React.PropTypes.string,
  editable: React.PropTypes.bool,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  onChange: React.PropTypes.func,
  primaryStat: React.PropTypes.number.isRequired,
  statState: React.PropTypes.oneOf(STATES),
  secondaryInfo: React.PropTypes.node
};

const defaultProps = {
  editable: false,
  onChange: () => {},
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
    this.styler = createStyler(style);
    this.onValidate = this.onValidate.bind(this);
    this.state = stateSetter(props);
  }

  componentWillReceiveProps(props) {
    this.setState(stateSetter(props));
  }

  onValidate(err, value) {
    // TODO the max/min limits don't match this unit, the validators work on
    // raw input rather than the converted value.
    const unit = this.state.unit;
    const size = this.toBytes(value);

    this.props.onChange(size);
    this.setState(stateSetter({ primaryStat: size, unit }));
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

    // Avoid rendering 0 or non-numbers
    if (!this.state.primaryStat) {
      primaryStat = (
        <span className={ this.styler('stat-primary')}>
          N/A
        </span>
      );
    }

    if (this.props.editable) {
      primaryStat = (
        <div className={ this.styler('stat-primary')}>
          <StatFormNumber
            className={ this.styler('stat-input', 'stat-input-text') }
            type="text"
            id={ `${this.props.name}-value` }
            inline
            label="MB"
            name={ `${this.props.name}-value` }
            value={ this.fromBytes(this.state.primaryStat) }
            min={ this.props.min }
            max={ this.props.max }
            onValidate={ this.onValidate }
          />
        </div>
      );
    }

    return (
      <div className={ this.styler('stat', stateClass) }>
        <h2 className={ this.styler('stat-header')}>{ this.props.title }</h2>
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

class StatFormNumber extends FormNumber {
  render() {
    const props = Object.assign({}, this.props, { validator: this.validateNumber });
    return <StatFormText { ...props } />;
  }
}


// Extend FormText for control over layout
class StatFormText extends FormText {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <span>
        <input type="text" id={ this.key } value={ this.state.value }
          onChange={ this.onChange } className={ this.classes }
        />
        <label
          className={ this.styler('stat-input', 'stat-input-label') }
          htmlFor={ `${this.props.name}-value` }
        >{ this.props.label }</label>
        <div>
          { this.error }
        </div>
      </span>
    );
  }
}
