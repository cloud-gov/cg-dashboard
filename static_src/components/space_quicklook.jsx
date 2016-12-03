
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

import AppCountStatus from './app_count_status.jsx';
import PanelRow from './panel_row.jsx';
import SpaceCountStatus from './space_count_status.jsx';
import { appStates } from '../constants.js';
import orgActions from '../actions/org_actions.js';

const propTypes = {
  space: React.PropTypes.object.isRequired,
  orgGuid: React.PropTypes.string.isRequired
};

const defaultProps = {
};

export default class SpaceQuicklook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  spaceHref() {
    const props = this.props;
    return `/#/org/${props.orgGuid}/spaces/${props.space.guid}`;
  }

  appHref(appGuid) {
    const props = this.props;
    return `/#/org/${props.orgGuid}/spaces/${props.space.guid}/apps/${appGuid}`;
  }

  appState(appState) {
    const statusClass = `status-${appState.toLowerCase()}`;
    return (
      <span className={ this.styler('status', statusClass) }>
        { appState.toLowerCase() }
      </span>
    );
  }

  appName(app) {
    const statusClass = (app.state === appStates.crashed) && 'status-crashed';
    return (
      <a className={ this.styler(statusClass) } href={ this.appHref(app.guid) }>
        { app.name }
      </a>
    );
  }

  render() {
    const space = this.props.space;

    return (
      <PanelRow>
        <h3><a href={ this.spaceHref() }>{ space.name }</a></h3>
        { space.apps && space.apps.map((app) => {
          return (
          <PanelRow key={ app.guid }>
            <span className={ this.styler('panel-column') }>
              <h3>
                { space.name } / { this.appName(app) }
              </h3>
            </span>
            <span className={ this.styler('panel-column', 'panel-column-less') }>
              { this.appState(app.state) }
            </span>
          </PanelRow>
          );
        })}
      </PanelRow>
    );
  }
}

SpaceQuicklook.propTypes = propTypes;
SpaceQuicklook.defaultProps = defaultProps;
