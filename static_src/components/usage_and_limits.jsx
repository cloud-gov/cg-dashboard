
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

  get disk() {
    return (
    <div style={{ marginTop: '1rem' }}>
      <div className={ this.styler('panel-column') }>
        <ResourceUsage title="Instance disk"
          amountUsed={ this.getStat('disk') }
          amountTotal={ this.getStat('disk_quota') }
          />
      </div>
      <div className={ this.styler('panel-column') } style={{ textAlign: 'left'}}>
        <ResourceUsage title="Instance disk"
          amountTotal={ this.getStat('disk_quota') }
        />
      </div>
    </div>
    );
  }

  get memory() {
    return (
    <div>
      <div className={ this.styler('panel-column') }>
        <ResourceUsage title="Instance memory"
          amountUsed={ this.getStat('mem') }
          amountTotal={ this.getStat('mem_quota') }
        />
      </div>
      <div className={ this.styler('panel-column') } style={{ textAlign: 'left'}}>
        <ResourceUsage title="Instance memory"
          amountTotal={ this.getStat('mem_quota') }
        />
      </div>
    </div>
    );
  }

  get totalDisk() {
    // TODO get space quota
    return (
    <div style={{ marginTop: '1rem' }}>
      <ResourceUsage title="Total disk"
        amountUsed={ this.getStat('disk') * this.props.app.running_instances }
        amountTotal={ this.getStat('disk_quota') }
      />
    </div>
    );
  }

  get totalMemory() {
    return (
    <div>
      <ResourceUsage title="Total memory"
        amountUsed={ this.getStat('mem') * this.props.app.running_instances }
        amountTotal={ this.getStat('mem_quota') }
      />
    </div>
    );
  }

  get scale() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h5>App scale</h5>
        <span className={ this.styler('stat-primary')}>
          { this.props.app.running_instances }X
        </span>
        <br />
        <h5 style={{ fontSize: '0.75rem', maxWidth: '5rem', display: 'inline-block', marginTop: '3rem' }}>
          Scale applies to memory and disk
        </h5>
      </div>
    );
  }

  render() {
    let content = <div></div>;

    if (this.props.app) {
      content = (
      <div>
        <PanelGroup>
          <PanelGroup columns={ 6 }>
            <PanelRow>
              { this.memory }
            </PanelRow>
            <PanelRow>
              { this.disk }
            </PanelRow>
          </PanelGroup>
          <PanelGroup columns={ 3 }>
            <PanelBlock>
              { this.scale }
            </PanelBlock>
          </PanelGroup>
          <PanelGroup columns={ 3 }>
            <PanelRow>
              { this.totalMemory }
            </PanelRow>
            <PanelRow>
              { this.totalDisk }
            </PanelRow>
          </PanelGroup>
        </PanelGroup>
        <PanelGroup columns={ 12 }>
          <PanelRow>
            <div>
              <p style={{ width: '100%' }}>To start or stop an app, follow the <a
                href="https://docs.cloudfoundry.org/devguide/deploy-apps/deploy-app.html"
                target="_blank">Cloud Foundry deployment guide.</a>
              </p>
            </div>
          </PanelRow>
        </PanelGroup>
      </div>
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
