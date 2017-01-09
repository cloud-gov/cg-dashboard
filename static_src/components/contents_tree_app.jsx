
import React from 'react';

import Col from './col.jsx';
import ContentsTreeCol from './contents_tree_col.jsx';
import EntityIcon from './entity_icon.jsx';
import PanelEntry from './panel_entry.jsx';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';
import { appHref } from '../util/url';
import { appHealth, isHealthyApp } from '../util/health';

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
  extraInfo: ['state']
};

export default class ContentsTreeApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  appHref() {
    const props = this.props;
    const appGuid = props.app.guid;
    return appHref(props.orgGuid, props.spaceGuid, appGuid);
  }

  appState(app) {
    const health = appHealth(app);
    const statusClass = `status-${health}`;
    return (
      <span className={ this.styler('status', statusClass) }>
        { app.state.toLowerCase() }
      </span>
    );
  }

  appName() {
    const app = this.props.app;
    const statusClass = !isHealthyApp(app) && 'status-error';

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

      // Only show the state if app is crashed or theres only one extra col
      if (!isHealthyApp(app) || oneInfo) {
        info.push(
          <ContentsTreeCol key="3">
            { this.appState(app) }
          </ContentsTreeCol>
        );
      }
    }
    if (this.props.extraInfo.includes('memory')) {
      info.push(
        <ContentsTreeCol key="1">
          <span className={ this.styler('contents-tree-value') }>
            { app.memory } MB </span>
          <span className={ this.styler('subtext') }>memory allocated</span>
        </ContentsTreeCol>
      );
    }
    if (this.props.extraInfo.includes('diskQuota')) {
      info.push(
        <ContentsTreeCol key="2">
          <span className={ this.styler('contents-tree-value') }>
          { app.disk_quota } MB </span>
          <span className={ this.styler('subtext') }>disk quota</span>
        </ContentsTreeCol>
      );
    }

    return (
      <div className={ this.styler('contents-tree-app')}>
        <PanelEntry key={ app.guid }>
          <Col flex={ 1 }>
            <h3 className={ this.styler('contents-secondary') }>
              <EntityIcon entity="app" health={ appHealth(app) } iconSize="medium" />
              { this.appName() }
            </h3>
          </Col>
          { info }
        </PanelEntry>
      </div>
    );
  }
}

ContentsTreeApp.propTypes = propTypes;
ContentsTreeApp.defaultProps = defaultProps;
