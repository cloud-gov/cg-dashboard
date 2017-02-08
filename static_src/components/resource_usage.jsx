

import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';
import formatBytes from '../util/format_bytes';
import Stat from './stat.jsx';

const propTypes = {
  max: React.PropTypes.number,
  min: React.PropTypes.number,
  onChange: React.PropTypes.func,
  title: React.PropTypes.string.isRequired,
  amountUsed: React.PropTypes.number,
  amountTotal: React.PropTypes.number,
  byteWarningThreshold: React.PropTypes.number,
  secondaryInfo: React.PropTypes.node
};

const defaultProps = {
  amountUsed: 0,
  amountTotal: 0,
  byteWarningThreshold: 500000,
  onChange: () => {}
};

export default class ResourceUsage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  available() {
    return formatBytes(this.props.amountTotal - this.props.amountUsed);
  }

  statState(used, total) {
    if (total - used < this.props.byteWarningThreshold) return 'warning';
    return 'success';
  }

  render() {
    const props = this.props;
    let stat = (
      <Stat
        editable={ props.editable }
        max={ props.max }
        min={ props.min }
        onChange={ props.onChange }
        title={ props.title }
        name={ props.name }
        primaryStat={ props.amountTotal }
        secondaryInfo={ <span>{ props.secondaryInfo }</span> }
      />
    );

    if (props.amountUsed && props.amountTotal) {
      stat = (
        <Stat
          primaryStat={ props.amountUsed }
          title={ props.title }
          secondaryInfo={ <span>{this.available()} available</span> }
          statState={ this.statState(props.amountUsed, props.amountTotal) }
        />
      );
    }

    return stat;
  }
}

ResourceUsage.propTypes = propTypes;
ResourceUsage.defaultProps = defaultProps;
