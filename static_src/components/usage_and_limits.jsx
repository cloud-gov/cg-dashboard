
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import PanelGroup from './panel_group.jsx';
import PanelHeader from './panel_header.jsx';
import PanelBlock from './panel_block.jsx';
import PanelRow from './panel_row.jsx';
import ResourceUsage from './resource_usage.jsx';

import createStyler from '../util/create_styler';

export default class UsageAndLimits extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);

    this.getStat = this.getStat.bind(this);
  }

  getStat(statName) {
    if (statName.indexOf('quota') > -1) {
      return (this.props.app.stats &&
              this.props.app.stats[statName] ||
              0);
    } else {
      return (this.props.app.stats &&
              this.props.app.stats.usage[statName] ||
              0);

    }
  }

  // TODO move to util
  formatMb(bytes) {
    if (!bytes) return '0';
    return Math.round(bytes / 1000000);
  }

  get disk() {
    let helpText = <span></span>;
    if (this.props.app.state.toUpperCase() === 'STOPPED') {
      helpText = <em> Stopped apps do not use disk space.</em>;
    }
    return (
      <ResourceUsage title="Instance disk"
        amountUsed={ this.getStat('disk') }
        amountTotal={ this.getStat('disk_quota') }
      />
    );
  }

  get memory() {
    let helpText = <span></span>;
    if (this.props.app.state.toUpperCase() === 'STOPPED') {
      helpText = <em> Stopped apps do not use memory.</em>;
    }
    return (
      <ResourceUsage title="Instance memory"
        amountUsed={ this.getStat('mem') }
        amountTotal={ this.getStat('mem_quota') }
      />
    );
  }

  render() {
    let content = <div></div>;

    if (this.props.app) {
      content = (
        <PanelGroup>
          <PanelHeader>
            <h3>Usage and Limits</h3>
          </PanelHeader>
          <PanelBlock>
            { this.memory }
          </PanelBlock>
          <PanelBlock>
            { this.disk }
          </PanelBlock>
          <PanelRow>
            <div>
              <p style={{ width: '100%' }}>To start or stop an app, follow the <a
                href="https://docs.cloudfoundry.org/devguide/deploy-apps/deploy-app.html"
                target="_blank">Cloud Foundry deployment guide.</a>
              </p>
            </div>
          </PanelRow>
        </PanelGroup>
      );
    }

    return content;
  }
}

UsageAndLimits.propTypes = {
  app: React.PropTypes.object
};

UsageAndLimits.defaultProps = {
  app: {}
};
