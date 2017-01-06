
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import Action from './action.jsx';
import ActivityLog from './activity_log.jsx';
import { appHealth } from '../util/health';
import AppStore from '../stores/app_store.js';
import Breadcrumbs from './breadcrumbs';
import Col from './col.jsx';
import EntityIcon from './entity_icon.jsx';
import ErrorMessage from './error_message.jsx';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
import QuotaStore from '../stores/quota_store.js';
import RoutesPanel from './routes_panel.jsx';
import Row from './row.jsx';
import PageHeader from './page_header.jsx';
import Panel from './panel.jsx';
import ServiceInstancePanel from './service_instance_panel.jsx';
import SpaceStore from '../stores/space_store.js';
import UsageLimits from './usage_and_limits.jsx';
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

  const quotaGuid = (space && space.space_quota_definition_guid) ||
    (org && org.quota_definition_guid) || null;

  const quota = QuotaStore.get(quotaGuid);

  return {
    app: app || {},
    currentAppGuid,
    currentOrgName: OrgStore.currentOrgName,
    currentSpaceName: SpaceStore.currentSpaceName,
    empty: !AppStore.loading && !appReady(app) && !QuotaStore.loading,
    loading: AppStore.loading || QuotaStore.loading,
    org,
    quota,
    space
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
    let content = <span><strong>{ this.state.app.name }</strong> application</span>;
    if (this.state.currentSpaceName && this.state.currentOrgName) {
      content = (
        <span><strong>{ this.state.app.name }</strong> application in your <strong>
        { this.state.currentSpaceName }</strong> space, which is in your <strong>
        { this.state.currentOrgName }</strong> organization</span>
      );
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
    let error;

    if (AppStore.isRestarting(this.state.app)) {
      loading = <Loading text="Restarting app" style="inline" />;
    }

    if (AppStore.isUpdating(this.state.app)) {
      loading = <Loading text="Updating app" style="inline" />;
    }

    if (this.state.app.error) {
      error = (
        <ErrorMessage error={ this.state.app.error } />
      );
    }

    return (
      <div>
        <Action
          style="warning"
          clickHandler={ this._onRestart }
          label="restart app"
          disabled={ !AppStore.isRunning(this.state.app) }
        >
          <span>Restart app</span>
        </Action>
        { error }
        { loading }
      </div>
    );
  }

  render() {
    let loading = <Loading text="Loading app" />;
    let content = <div>{ loading }</div>;
    const title = (
      <span>
       <EntityIcon entity="app" health={ appHealth(this.state.app) } iconSize="large" />
       { this.state.app.name } { this.statusUI }
     </span>
    );

    if (this.state.empty) {
      content = <h4 className="test-none_message">No app</h4>;
    } else if (!this.state.loading && appReady(this.state.app)) {
      const usageSecondary = (
        <span>View more usage data at <a href="https://logs.cloud.gov">logs.cloud.gov</a></span>
      );
      content = (
        <div>
          <div className={ this.styler('grid') }>
            <div className={ this.styler('grid-width-12') }>
              <Breadcrumbs />
              <PageHeader title={ title }>
                { this.restart }
              </PageHeader>
            </div>
          </div>
          <Panel title="App usage and allocation" secondary={ usageSecondary }>
            <UsageLimits app={ this.state.app } quota={ this.state.quota } />
          </Panel>

          <Row gutters valign="top">
            <Col flex={ 1 }>
              <Panel title="Routes">
                <RoutesPanel />
              </Panel>
            </Col>
            <Col flex={ 1 }>
              <Panel title="Services">
                <ServiceInstancePanel />
              </Panel>
            </Col>
          </Row>

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
