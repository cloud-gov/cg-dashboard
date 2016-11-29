

import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';
import formatBytes from '../util/format_bytes';
import Stat from './stat.jsx';

const propTypes = {
  title: React.PropTypes.string.isRequired,
  amountUsed: React.PropTypes.number,
  amountTotal: React.PropTypes.number,
  byteWarningThreshold: React.PropTypes.number
};

const defaultProps = {
  amountUsed: 0,
  amountTotal: 0,
  byteWarningThreshold: 500000
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
    let title = <h5>{ props.title } allocated</h5>;
    let stat = (
      <Stat
        editable={ props.editable }
        name={ props.name }
	primaryStat={ props.amountTotal }
      />
    );

    if (props.amountUsed) {
      title = <h5>{ props.title } used</h5>;
      stat = (
        <Stat
          primaryStat={ props.amountUsed }
          secondaryInfo={ <span>{this.available()} available</span> }
          statState={ this.statState(props.amountUsed, props.amountTotal) }
        />
      );
    }
    return (
      <div style={{ width: '100%' }}>
        { title }
        { stat }
      </div>
    );
  }
}

ResourceUsage.propTypes = propTypes;
ResourceUsage.defaultProps = defaultProps;
