import PropTypes from "prop-types";
import React from "react";
import formatBytes from "../util/format_bytes";
import Stat from "./stat.jsx";

const propTypes = {
  formGuid: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  title: PropTypes.string.isRequired,
  amountUsed: PropTypes.number,
  amountTotal: PropTypes.number,
  byteWarningThreshold: PropTypes.number,
  secondaryInfo: PropTypes.node
};

const defaultProps = {
  amountUsed: 0,
  amountTotal: 0,
  byteWarningThreshold: 500000,
  onChange: () => {}
};

export default class ResourceUsage extends React.Component {
  available() {
    return formatBytes(this.props.amountTotal - this.props.amountUsed);
  }

  statState(used, total) {
    if (total - used < this.props.byteWarningThreshold) return "warning";
    return "success";
  }

  render() {
    const props = this.props;

    let properties = {
      title: props.title,
      primaryStat: props.amountTotal,
      secondaryInfo: props.secondaryInfo,
      editable: props.editable,
      max: props.max,
      min: props.min,
      onChange: props.onChange,
      name: props.name,
      formGuid: props.formGuid
    };

    if (props.amountUsed && props.amountTotal) {
      properties = {
        ...properties,
        primaryStat: props.amountUsed,
        secondaryInfo: <span>{this.available()} available</span>,
        statState: this.statState(props.amountUsed, props.amountTotal)
      };
    }

    return <Stat {...properties} />;
  }
}

ResourceUsage.propTypes = propTypes;
ResourceUsage.defaultProps = defaultProps;
