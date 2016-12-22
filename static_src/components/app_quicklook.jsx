
import React from 'react';

import EntityIcon from './entity_icon.jsx';
import Loading from './loading.jsx';
import PanelRow from './panel_row.jsx';
import { appStates } from '../constants.js';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const EXTRA_INFO = [
  'state',
  'memory',
  'diskQuota'
];

const propTypes = {
  app: React.PropTypes.object.isRequired,
  orgGuid: React.PropTypes.string.isRequired,
  spaceGuid: React.PropTypes.string.isRequired,
  spaceName: React.PropTypes.string,
  extraInfo: React.PropTypes.arrayOf((propVal) => EXTRA_INFO.includes(propVal))
};

const defaultProps = {
  spaceName: '',
  extraInfo: ['state']
};

export default class AppQuicklook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  appHref() {
    const props = this.props;
    const appGuid = props.app.guid;
    return `/#/org/${props.orgGuid}/spaces/${props.spaceGuid}/apps/${appGuid}`;
  }

  appState(appState) {
    const statusClass = `status-${appState.toLowerCase()}`;
    return (
      <span className={ this.styler('status', statusClass) }>
        { appState.toLowerCase() }
      </span>
    );
  }

  appName() {
    const app = this.props.app;
    const statusClass = (app.state === appStates.crashed) && 'status-crashed';
    return (
      <a className={ this.styler(statusClass) } href={ this.appHref() }>
        { app.name }
      </a>
    );
  }

  render() {
    const app = this.props.app;
    let info = [];

    if (this.props.extraInfo.includes('state')) {
      const oneInfo = this.props.extraInfo.length === 1;
      const panelModClass = oneInfo ? 'panel-column-less' : 'panel-column-shrink';

      // Only show the state if app is crashed or theres only one extra col
      if (app.state === appStates.crashed || oneInfo) {
        info.push(
          <span key="1" className={ this.styler('panel-column', panelModClass) }>
            { this.appState(app.state) }
          </span>
        );
      }
    }
    if (this.props.extraInfo.includes('memory')) {
      info.push(
        <span key="2" className={ this.styler('panel-column', 'panel-column-shrink') }>
          { app.memory } MB <br />
          <span className={ this.styler('subtext') }>memory allocated</span>
        </span>
      );
    }
    if (this.props.extraInfo.includes('diskQuota')) {
      info.push(
        <span key="3" className={ this.styler('panel-column', 'panel-column-shrink') }>
          { app.disk_quota } MB <br />
          <span className={ this.styler('subtext') }>disk quota</span>
        </span>
      );
    }

    return (
      <PanelRow key={ app.guid }>
        <div>
          <span className={ this.styler('panel-column') }>
            <h3 className={ this.styler('sans-s5') }>
              <EntityIcon entity="app" state={ app.state } />
              <span>{ this.props.spaceName } / { this.appName() }</span>
            </h3>
          </span>
          { info }
        </div>
      </PanelRow>
    );
  }
}

AppQuicklook.propTypes = propTypes;
AppQuicklook.defaultProps = defaultProps;
