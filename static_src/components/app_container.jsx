
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import Action from './action.jsx';
import ActivityLog from './activity_log.jsx';
import UsageLimits from './usage_and_limits.jsx';
import AppStore from '../stores/app_store.js';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
import QuotaStore from '../stores/quota_store.js';
import RoutesPanel from './routes_panel.jsx';
import Panel from './panel.jsx';
import ServiceInstancePanel from './service_instance_panel.jsx';
import SpaceStore from '../stores/space_store.js';
import appActions from '../actions/app_actions.js';

import createStyler from '../util/create_styler';

function appReady(app) {
  return !!app && !!app.name;
}

function stateSetter() {
  const currentAppGuid = AppStore.currentAppGuid;
  const app = AppStore.get(currentAppGuid);
  const space = SpaceStore.get(SpaceStore.currentSpaceGuid);
  const org = OrgStore.get(OrgStore.currentOrgGuid);

  const quotaGuid = (space && space.space_quota_definition_guid) ?
    space.space_quota_definition_guid :
    (org) ? org.quota_definition_guid : null;

  const quota = QuotaStore.get(quotaGuid);

  return {
    app: app || {},
    currentAppGuid,
    currentOrgName: OrgStore.currentOrgName,
    currentSpaceName: SpaceStore.currentSpaceName,
    empty: !AppStore.loading && !appReady(app) && !QuotaStore.loading,
    loading: AppStore.loading || QuotaStore.loading,
    quota
  };
}

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();

    this._onChange = this._onChange.bind(this);
    this._onRestart = this._onRestart.bind(this);
    this.styler = createStyler(style);
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
    OrgStore.addChangeListener(this._onChange);
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange);
    OrgStore.removeChangeListener(this._onChange);
    SpaceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  _onRestart() {
    appActions.restart(this.state.app.guid);
  }

  get fullTitle() {
    let content = <span><strong>{ this.state.app.name }</strong> application</span>
    if (this.state.currentSpaceName && this.state.currentOrgName) {
      content = <span><strong>{ this.state.app.name }</strong> application in your <strong>{ this.state.currentSpaceName }</strong> space, which is in your <strong>{ this.state.currentOrgName }</strong> organization</span>;
    }
    return content;
  }

  get statusUI() {
    return (
      <span className={ this.styler('usa-label') }>{ this.state.app.state }</span>
    );
  }

  get restart() {
    let loading;
    if (AppStore.isRestarting(this.state.app)) {
      loading = <Loading text="Restarting app" style="inline" />;
    }

    return (
      <div>
        <Action
          style="primary"
          clickHandler={ this._onRestart }
          label="restart app"
          disabled={ !AppStore.isRunning(this.state.app) }
          type="outline">
          <span>Restart app</span>
        </Action>
        { loading }
      </div>
    );
  }

  render() {
    let loading = <Loading text="Loading app" />;
    let content = <div>{ loading }</div>;

    if (this.state.empty) {
      content = <h4 className="test-none_message">No app</h4>;
    } else if (!this.state.loading && appReady(this.state.app)) {
      content = (
        <div>
          <h2>{ this.fullTitle } { this.statusUI }</h2>
          { this.restart }
          <Panel title="Usage and allocation">
            <UsageLimits app={ this.state.app } quota={ this.state.quota } />
          </Panel>
          <RoutesPanel />
          <ServiceInstancePanel />
          <Panel title="Recent activity">
            <ActivityLog initialAppGuid={ this.state.app.guid } />
          </Panel>
        </div>
      );
    }

    return (
      <div>
        { content }
      </div>
    );
  }
}

AppContainer.propTypes = { };
