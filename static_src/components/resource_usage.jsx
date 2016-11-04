

import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';
import Stat from './stat.jsx';

const propTypes = {
  title: React.PropTypes.string.isRequired,
  amountUsed: React.PropTypes.number,
  amountTotal: React.PropTypes.number
};

const defaultProps = {
  amountUsed: 0,
  amountTotal: 0
};

export default class ResourceUsage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }
  //
  // TODO move to util
  formatMb(bytes) {
    if (!bytes) return '0';
    return Math.round(bytes / 1000000);
  }

  available() {
    return this.formatMb(this.props.amountTotal - this.props.amountUsed);
  }

  unit(bytes) {
    if (bytes < 100000) return 'MB';
    else return 'GB';
  }

  statState(used, total) {
    if (this.formatMb(total) - this.formatMb(used) > 500) return 'warning';
    else return 'success';
  }

  render() {
    const props = this.props;
    return (
      <div>
        <div style={{ textAlign: 'left' }} className={ this.styler('panel-column')}>
          <h5>{ props.title } used</h5>
          <Stat
            primaryStat={ this.formatMb(props.amountUsed) + ' ' +
              this.unit(props.amountUsed) }
            secondaryInfo={ <span>{this.available()} {this.unit()} available</span> }
            statState={ this.statState(props.amountUsed, props.amountTotal) }
          />
        </div>
        <div style={{ textAlign: 'left' }} className={ this.styler('panel-column')}>
          <h5>{ props.title } allocated</h5>
          <Stat
            primaryStat={ this.formatMb(props.amountTotal) + ' ' +
              this.unit(props.amountTotal) }
          />
        </div>
      </div>
    );
  }
}

ResourceUsage.propTypes = propTypes;
ResourceUsage.defaultProps = defaultProps;
