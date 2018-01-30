import React from "react";

import Action from "./action.jsx";
import ActivityLog from "./activity_log.jsx";
import { appHealth, worstAppInstanceState } from "../util/health";
import { appStates } from "../constants";
import { config } from "skin";
import AppStore from "../stores/app_store.js";
import Breadcrumbs from "./breadcrumbs";
import DomainStore from "../stores/domain_store.js";
import EnvStore from "../stores/env_store.js";
import RouteStore from "../stores/route_store.js";
import EntityIcon from "./entity_icon.jsx";
import SystemErrorMessage from "./system_error_message.jsx";
import Loading from "./loading.jsx";
import OrgStore from "../stores/org_store.js";
import QuotaStore from "../stores/quota_store.js";
import RoutesPanel from "./routes_panel.jsx";
import EnvPanel from "./env/env_panel";
import PageHeader from "./page_header.jsx";
import Panel from "./panel.jsx";
import ServiceInstancePanel from "./service_instance_panel.jsx";
import UPSIPanel from "./upsi/upsi_panel";
import SpaceStore from "../stores/space_store.js";
import UPSIStore from "../stores/upsi_store";
import UsageLimits from "./usage_and_limits.jsx";
import appActions from "../actions/app_actions.js";

function appReady(app) {
  return !!app && !!app.name;
}

function mapStoreToState() {
  let route;
  const { currentAppGuid } = AppStore;
  const app = AppStore.get(currentAppGuid);
  const envRequest = EnvStore.getEnvRequest(currentAppGuid);
  const envUpdateError = EnvStore.getUpdateError(currentAppGuid);
  const space = SpaceStore.get(SpaceStore.currentSpaceGuid);
  const org = OrgStore.get(OrgStore.currentOrgGuid);
  const upsisRequest = space
    ? UPSIStore.getAllForSpaceRequest(space.guid)
    : null;

  if (app) {
    // This depends on DomainStore
    route = RouteStore.getRouteURLForApp(app);
  }

  const quotaGuid =
    (space && space.space_quota_definition_guid) ||
    (org && org.quota_definition_guid) ||
    null;

  const quota = QuotaStore.get(quotaGuid);

  return {
    app: app || {},
    currentAppGuid,
    currentOrgName: OrgStore.currentOrgName,
    currentSpaceName: SpaceStore.currentSpaceName,
    empty: !AppStore.loading && !appReady(app) && !QuotaStore.loading,
    envRequest,
    envUpdateError,
    loading:
      OrgStore.loading ||
      SpaceStore.loading ||
      AppStore.loading ||
      QuotaStore.loading,
    org,
    route,
    quota,
    space,
    upsisRequest
  };
}

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = mapStoreToState();

    this.handleChange = this.handleChange.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener(this.handleChange);
    DomainStore.addChangeListener(this.handleChange);
    EnvStore.addChangeListener(this.handleChange);
    OrgStore.addChangeListener(this.handleChange);
    QuotaStore.addChangeListener(this.handleChange);
    RouteStore.addChangeListener(this.handleChange);
    SpaceStore.addChangeListener(this.handleChange);
    UPSIStore.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.handleChange);
    DomainStore.removeChangeListener(this.handleChange);
    EnvStore.removeChangeListener(this.handleChange);
    OrgStore.removeChangeListener(this.handleChange);
    QuotaStore.removeChangeListener(this.handleChange);
    RouteStore.removeChangeListener(this.handleChange);
    SpaceStore.removeChangeListener(this.handleChange);
    UPSIStore.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState(mapStoreToState());
  }

  handleRestart() {
    appActions.restart(this.state.app.guid);
  }

  handleStart() {
    appActions.start(this.state.app.guid);
  }

  get statusUI() {
    let label;
    let worstState = this.state.app.state;
    if (this.state.app.state === appStates.started) {
      // If the app is started, use the instance state
      worstState = worstAppInstanceState(
        (this.state.app.app_instances || []).map(instance => instance.state)
      );
    }

    if (worstState) {
      label = <span className="usa-label">{worstState}</span>;
    }

    return label;
  }

  get openApp() {
    const route = this.state.route;
    if (!route) return null;
    return (
      <Action
        style="primary"
        href={`https://${route}`}
        label="open app"
        type="outline"
      >
        <span>Open app</span>
      </Action>
    );
  }

  get restart() {
    let loading;

    let handler = this.handleRestart;
    let actionText = "Restage app";
    if (!AppStore.isRunning(this.state.app)) {
      handler = this.handleStart;
      actionText = "Start app";
    }

    if (AppStore.isStarting(this.state.app)) {
      loading = <Loading text="Starting app" style="inline" />;
    }

    if (AppStore.isRestarting(this.state.app)) {
      loading = <Loading text="Restaging app" style="inline" />;
    }

    const action = loading || (
      <Action
        style="primary"
        clickHandler={handler}
        label={actionText}
        type="outline"
      >
        <span>{actionText}</span>
      </Action>
    );

    return action;
  }

  get error() {
    let error;

    if (this.state.app.error) {
      error = <SystemErrorMessage error={this.state.app.error} />;
    }

    return error;
  }

  get logsDocumentation() {
    return <config.snippets.logs />;
  }

  render() {
    const {
      org,
      space,
      app,
      envRequest,
      envUpdateError,
      upsisRequest
    } = this.state;

    const loading = <Loading text="Loading app" />;
    let content = <div>{loading}</div>;
    const title = (
      <span>
        <EntityIcon
          entity="app"
          health={appHealth(this.state.app)}
          iconSize="large"
        />
        {this.state.app.name} {this.statusUI}
      </span>
    );

    if (this.state.empty) {
      content = <h4 className="test-none_message">App not available</h4>;
    } else if (!this.state.loading && appReady(this.state.app)) {
      content = (
        <div>
          <div className="grid">
            <div className="grid-width-12">
              <Breadcrumbs org={org} space={space} app={app} />
              <PageHeader title={title}>
                {this.error}
                {this.openApp}
                {this.restart}
              </PageHeader>
            </div>
          </div>
          <Panel title="Usage and allocation">
            <UsageLimits app={this.state.app} quota={this.state.quota} />
          </Panel>

          <Panel title="Routes">
            <RoutesPanel />
          </Panel>

          <Panel title="Services">
            <ServiceInstancePanel />
          </Panel>

          {upsisRequest && <UPSIPanel app={app} upsisRequest={upsisRequest} />}

          {envRequest && (
            <EnvPanel
              app={app}
              envRequest={envRequest}
              updateError={envUpdateError}
            />
          )}

          <Panel title="Recent activity">
            {this.logsDocumentation}
            <ActivityLog />
          </Panel>
        </div>
      );
    }

    return <div>{content}</div>;
  }
}

AppContainer.propTypes = {};
