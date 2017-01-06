
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import Action from './action.jsx';
import Col from './col.jsx';
import { FormNumber } from './form';
import PanelActions from './panel_actions.jsx';
import PanelGroup from './panel_group.jsx';
import Row from './row.jsx';
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
    editing: !!props.editing,
    partialApp: {
      // Properties are mapped directly to API https://apidocs.cloudfoundry.org/246/apps/updating_an_app.html
      disk_quota: props.app.disk_quota,
      instances: props.app.instances,
      memory: props.app.memory
    }
  };
}

export default class UsageAndLimits extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
    this.state = stateSetter(props);

    this.getStat = this.getStat.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onToggleEdit = this._onToggleEdit.bind(this);
  }

  getStat(statName) {
    return getStat(statName, this.props);
  }

  _onToggleEdit() {
    this.setState(stateSetter(Object.assign({}, this.props, { editing: !this.state.editing })));
  }

  _onChange(property, value) {
    let parsedValue = value;
    switch (property) {
      case 'disk_quota':
      case 'memory':
        parsedValue = megabytes(value);
        break;
      default:
        parsedValue = parseInt(value, 10);
        break;
    }

    const partialApp = Object.assign(
      {},
      this.state.partialApp,
      { [property]: parsedValue }
    );
    this.setState({ partialApp });
  }


  get disk() {
    const onChange = this._onChange.bind(this, 'disk_quota');
    const disk = this.state.editing ? this.state.partialApp.disk_quota : this.props.app.disk_quota;

    return (
      <div className={ this.styler('row', 'row-gutters') }>
      <div className={ this.styler('col', 'col-flex-1') }>
        <ResourceUsage title="Instance disk"
          amountUsed={ this.getStat('disk') }
          amountTotal={ this.getStat('disk_quota') }
        />
      </div>
      <div className={ this.styler('col', 'col-flex-1') } style={{ textAlign: 'left' }}>
        <ResourceUsage title="Instance disk"
          editable={ this.state.editing }
          max={ 2 * 1024 }
          min={ 1 }
          onChange={ onChange }
          name="disk"
          amountTotal={ disk * 1024 * 1024 }
        />
      </div>
    </div>
    );
  }

  get memory() {
    const onChange = this._onChange.bind(this, 'memory');
    const memory = this.state.editing ? this.state.partialApp.memory : this.props.app.memory;

    return (
    <div className={ this.styler('row', 'row-gutters') }>
      <div className={ this.styler('col', 'col-flex-1') }>
        <ResourceUsage title="Instance memory"
          amountUsed={ this.getStat('mem') }
          amountTotal={ this.getStat('mem_quota') }
        />
      </div>
      <div className={ this.styler('col', 'col-flex-1') } style={{ textAlign: 'left' }}>
        <ResourceUsage title="Instance memory"
          editable={ this.state.editing }
          min={ 1 }
          max={ Math.floor(this.props.quota.memory_limit / this.state.partialApp.instances) }
          name="memory"
          onChange={ onChange }
          amountTotal={ memory * 1024 * 1024 }
        />
      </div>
    </div>
    );
  }

  get totalDisk() {
    // TODO get space quota
    return (
    <div className={ this.styler('col', 'col-flex-1') }>
      <ResourceUsage title="Total disk"
        amountUsed={ this.getStat('disk') * this.props.app.running_instances }
        amountTotal={ this.getStat('disk_quota') }
      />
    </div>
    );
  }

  get totalMemory() {
    return (
    <div className={ this.styler('col', 'col-flex-1') }>
      <ResourceUsage title="Total memory"
        amountUsed={ this.getStat('mem') * this.props.app.running_instances }
        amountTotal={ this.props.quota.memory_limit * 1024 * 1024 }
      />
    </div>
    );
  }

  get scale() {
    const onValidate = (err, value) => {
      this._onChange('instances', value);
    };

    const instanceCount = this.state.editing ?
      this.state.partialApp.instances : this.props.app.instances;


    let instances = (
      <span className={ this.styler('stat-primary')}>
	{ instanceCount }
      </span>
    );

    if (this.state.editing) {
      instances = (
        <FormNumber
          className={ this.styler('stat-input', 'stat-input-text', 'stat-input-text-scale') }
          id="scale"
          inline
          min={ 1 }
          max={ 64 }
          name="scale"
          onValidate={ onValidate }
          value={ instanceCount }
        />
      );
    }

    return (
      <div className={ this.styler('stat-single_box') }>
        <h2 className={ this.styler('stat-header')}>Instances</h2>
	{ instances }
        <br />
        <span className={ this.styler('subtext') }>
          Instance applies to memory and disk
        </span>
      </div>
    );
  }

  _onSubmit() {
    appActions.updateApp(this.props.app.guid, this.state.partialApp);
    this.setState({ editing: false });
  }

  render() {
    let content = <div></div>;
    let controls = (
      <Action
        style="primary"
        label="Modify allocation and scale"
        clickHandler={ this._onToggleEdit }
      >
          <span>Modify allocation and instances</span>
        </Action>
    );

    if (this.state.editing) {
      controls = (
        <div>
          <Action style="base" type="outline" label="Cancel" clickHandler={ this._onToggleEdit }>
            <span>Cancel</span>
          </Action>
          <Action style="finish" type="button" label="OK" clickHandler={ this._onSubmit }>
            <span>OK</span>
          </Action>
        </div>
      );
    }

    if (this.props.app) {
      content = (
      <div className={ this.styler('panel-content') }>
        <PanelGroup>
          <Row>
            <Col flex={ 2 } gutters>
              { this.memory }
              { this.disk }
            </Col>
            <Col flex={ 1 }>
              { this.scale }
            </Col>
            <Col flex={ 1 } gutters>
              <Row>
                { this.totalMemory }
              </Row>
              <Row>
                { this.totalDisk }
              </Row>
            </Col>
          </Row>
        </PanelGroup>

        <PanelGroup>
          <PanelActions align="right">
            { controls }
          </PanelActions>
        </PanelGroup>
      </div>
      );
    }

    return content;
  }
}

UsageAndLimits.propTypes = {
  app: React.PropTypes.object,
  editing: React.PropTypes.bool,
  quota: React.PropTypes.object
};

UsageAndLimits.defaultProps = {
  app: {},
  editing: false,
  quota: {}
};
