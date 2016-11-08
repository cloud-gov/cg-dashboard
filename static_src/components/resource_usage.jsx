

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

  // TODO move to util
  formatBytes(bytes, decimals=0) {
     if (bytes == 0) return '0';
     const k = 1000;
     const dm = decimals + 1 || 3;
     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
     const i = Math.floor(Math.log(bytes) / Math.log(k));
     return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  available() {
    return this.formatBytes(this.props.amountTotal - this.props.amountUsed);
  }

  statState(used, total) {
    console.log('compare', used, total);
    if (total - used < 500000) return 'warning';
    else return 'success';
  }

  render() {
    const props = this.props;
    let title = <h5>{ props.title } allocated</h5>
    let stat = <Stat primaryStat={ this.formatBytes(props.amountTotal) }/>;
    if (props.amountUsed) {
      title = <h5>{ props.title } used</h5>
      stat = (
        <Stat
          primaryStat={ this.formatBytes(props.amountUsed) }
          secondaryInfo={ <span>{this.available()} available</span> }
          statState={ this.statState(props.amountUsed, props.amountTotal) }
        />
      );
    }
    return (
      <div>
        { title }
        { stat }
      </div>
    );
  }
}

ResourceUsage.propTypes = propTypes;
ResourceUsage.defaultProps = defaultProps;
