
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import ActivityLog from './activity_log.jsx';
import AppSettingsPanel from './app_settings_panel.jsx';
import AppStore from '../stores/app_store.js';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
import RoutesPanel from './routes_panel.jsx';
import ServiceInstancePanel from './service_instance_panel.jsx';
import SpaceStore from '../stores/space_store.js';

import createStyler from '../util/create_styler';

function appReady(app) {
  return !!app && !!app.name;
}

function stateSetter() {
  const currentAppGuid = AppStore.currentAppGuid;
  const app = AppStore.get(currentAppGuid);

  return {
    app: app || {},
    currentAppGuid,
    currentOrgName: OrgStore.currentOrgName,
    currentSpaceName: SpaceStore.currentSpaceName,
    empty: AppStore.fetched && !appReady(app),
    loading: AppStore.fetching
  };
}

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();

    this._onChange = this._onChange.bind(this);
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

  get fullTitle() {
    let content = <span><strong>{ this.state.app.name }</strong> application</span>
    if (this.state.currentSpaceName && this.state.currentOrgName) {
      content = <span><strong>{ this.state.app.name }</strong> application in your <strong>{ this.state.currentSpaceName }</strong> space, which is in your <strong>{ this.state.currentOrgName }</strong> organization</span>;
    }
    return content;
  }

  render() {
    let loading = <Loading text="Loading app" />;
    let content = <div>{ loading }</div>;

    if (this.state.empty) {
      content = <h4 className="test-none_message">No app</h4>;
    } else if (!this.state.loading && appReady(this.state.app)) {
      content = (
        <div>
          <ActivityLog initialAppGuid={ this.state.app.guid } title="Recent activity" />
          <h2>{ this.fullTitle }</h2>
          <AppSettingsPanel app={ this.state.app }/>
          <RoutesPanel />
          <ServiceInstancePanel />
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
