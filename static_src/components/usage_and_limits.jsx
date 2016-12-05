
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import Action from './action.jsx';
import PanelGroup from './panel_group.jsx';
import PanelHeader from './panel_header.jsx';
import PanelBlock from './panel_block.jsx';
import PanelRow from './panel_row.jsx';
import ResourceUsage from './resource_usage.jsx';

import appActions from '../actions/app_actions.js';
import createStyler from '../util/create_styler';

function getStat(statName, props) {
  if (statName.indexOf('quota') > -1) {
    return (props.app.stats &&
            props.app.stats[statName] ||
            0);
  }

  return (props.app.stats &&
          props.app.stats.usage[statName] ||
          0);
}

function megabytes(value) {
  return Math.floor(value / 1024 / 1024);
}

function stateSetter(props) {
  return {
    isEditing: !!props.isEditing
  };
}

export default class UsageAndLimits extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
    this.state = stateSetter(props);
    // Properties are mapped directly to API https://apidocs.cloudfoundry.org/246/apps/updating_an_app.html
    this.state.partialApp = {
      memory: megabytes(getStat('mem_quota', props)),
      disk_quota: megabytes(getStat('disk_quota', props))
    };

    this.getStat = this.getStat.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onToggleEdit = this._onToggleEdit.bind(this);
  }

  getStat(statName) {
    return getStat(statName, this.props);
  }

  _onToggleEdit() {
    this.setState(stateSetter({ isEditing: !this.state.isEditing }));
  }

  _onChange(property, value) {
    // TODO use form validation to parse values
    const size = megabytes(value);
    const partialApp = Object.assign(
      {},
      this.state.partialApp,
      { [property]: size }
    );
    this.setState({ partialApp });
  }


  get disk() {
    const onChange = this._onChange.bind(this, 'disk_quota');

    return (
    <div className={ this.styler('panel-row-space') }>
      <div className={ this.styler('panel-column') }>
        <ResourceUsage title="Instance disk"
          amountUsed={ this.getStat('disk') }
          amountTotal={ this.getStat('disk_quota') }
        />
      </div>
      <div className={ this.styler('panel-column') } style={{ textAlign: 'left' }}>
        <ResourceUsage title="Instance disk"
          editable={ this.state.isEditing }
          onChange={ onChange }
          name="disk"
          amountTotal={ this.props.app.disk_quota * 1024 * 1024 }
        />
      </div>
    </div>
    );
  }

  get memory() {
    const onChange = this._onChange.bind(this, 'memory');

    return (
    <div>
      <div className={ this.styler('panel-column') }>
        <ResourceUsage title="Instance memory"
          amountUsed={ this.getStat('mem') }
          amountTotal={ this.getStat('mem_quota') }
        />
      </div>
      <div className={ this.styler('panel-column') } style={{ textAlign: 'left' }}>
        <ResourceUsage title="Instance memory"
          editable={ this.state.isEditing }
          name="memory"
          onChange={ onChange }
          amountTotal={ this.props.app.memory * 1024 * 1024 }
        />
      </div>
    </div>
    );
  }

  get totalDisk() {
    // TODO get space quota
    return (
    <div className={ this.styler('panel-row-space') }>
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
        amountTotal={ this.props.quota.memory_limit * 1024 * 1024 }
      />
    </div>
    );
  }

  get scale() {
    return (
      <div className={ this.styler('stat-single_box') }>
        <h5>App scale</h5>
        <span className={ this.styler('stat-primary')}>
          { this.props.app.instances }X
        </span>
        <br />
        <h5 className={ this.styler('stat-info') }>
          Scale applies to memory and disk
        </h5>
      </div>
    );
  }

  _onSubmit() {
    appActions.updateApp(this.props.app.guid, this.state.partialApp);
    this.setState({ isEditing: false });
  }

  render() {
    let content = <div></div>;
    let controls = (
      <Action
        style="primary"
        type="outline"
        label="Modify allocation and scale"
        clickHandler={ this._onToggleEdit }
      >
          <span>Modify allocation and scale</span>
        </Action>
    );

    if (this.state.isEditing) {
      controls = (
        <div>
          <Action style="primary" type="outline" label="OK" clickHandler={ this._onSubmit }>
            <span>OK</span>
          </Action>
          <Action style="primary" type="outline" label="Cancel" clickHandler={ this._onToggleEdit }>
            <span>Cancel</span>
          </Action>
        </div>
      );
    }

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
        { controls }
      </div>
      );
    }

    return content;
  }
}

UsageAndLimits.propTypes = {
  app: React.PropTypes.object,
  isEditing: React.PropTypes.bool,
  quota: React.PropTypes.object
};

UsageAndLimits.defaultProps = {
  app: {},
  isEditing: false,
  quota: {}
};
