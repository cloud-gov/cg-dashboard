import PropTypes from "prop-types";
import React from "react";
import { FormNumber } from "./form";
import formatBytes from "../util/format_bytes";

const STATES = ["error", "warning", "info", "success", "none"];

const propTypes = {
  formGuid: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  editable: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
  primaryStat: PropTypes.number.isRequired,
  statState: PropTypes.oneOf(STATES),
  secondaryInfo: PropTypes.node
};

const defaultProps = {
  editable: false,
  onChange: () => {},
  statState: "none",
  secondaryInfo: <span />,
  unit: "MB"
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
    this.onValidate = this.onValidate.bind(this);
    this.state = stateSetter(props);
  }

  componentWillReceiveProps(props) {
    this.setState(stateSetter(props));
  }

  onValidate(err, value) {
    if (err) {
      // No need to update model on error
      return;
    }

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
      <span className="stat-primary">
        {formatBytes(this.state.primaryStat)}
      </span>
    );

    // Avoid rendering 0 or non-numbers
    if (!this.state.primaryStat) {
      primaryStat = <span className="stat-primary">N/A</span>;
    }

    if (this.props.editable) {
      primaryStat = (
        <div className="stat-primary">
          <FormNumber
            formGuid={this.props.formGuid}
            className="stat-input stat-input-text"
            type="text"
            id={this.props.name}
            inline
            label="MB"
            labelAfter
            name={this.props.name}
            value={this.fromBytes(this.state.primaryStat)}
            min={this.props.min}
            max={this.props.max}
            onValidate={this.onValidate}
          />
        </div>
      );
    }

    return (
      <div className={`stat ${stateClass}`}>
        <h2 className="stat-header">{this.props.title}</h2>
        {primaryStat}
        <span className="stat-info">{this.props.secondaryInfo}</span>
      </div>
    );
  }
}

Stat.propTypes = propTypes;
Stat.defaultProps = defaultProps;
