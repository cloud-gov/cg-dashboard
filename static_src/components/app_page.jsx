
import React from 'react';

import AppStore from '../stores/app_store.js';
import Loading from './loading.jsx';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';
import RouteList from './route_list.jsx';

import sectionStyle from 'cloudgov-style/css/components/section.css';
import createStyler from '../util/create_styler';

function stateSetter(current) {

  return {
    app: AppStore.get(current.currentAppGuid) || {},
    currentAppGuid: current.currentAppGuid,
    currentOrgName: OrgStore.currentOrgName,
    currentSpaceName: SpaceStore.currentSpaceName,
    loading: AppStore.fetching
  };
}

export default class AppPage extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter({ currentAppGuid: this.props.initialAppGuid });
    this._onChange = this._onChange.bind(this);
    this.styler = createStyler(sectionStyle);
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
    this.setState(stateSetter(this.state));
  }

  logsLink(appName) {
    return `https://logs.cloud.gov/app/kibana#/dashboard/App-Overview?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now%2Fy,mode:quick,to:now))&_a=(filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:%5Blogs-app-%5DYYYY.MM.DD,key:'@source.app.name',negate:!f,value:${appName}),query:(match:('@source.app.name':(query:${appName},type:phrase))))),options:(darkTheme:!f),panels:!((col:1,id:App-logs-by-type,panelIndex:1,row:1,size_x:9,size_y:2,type:visualization),(col:10,id:App-names,panelIndex:2,row:1,size_x:3,size_y:2,type:visualization),(col:1,columns:!('@level','@source.name','@source.app.name','@message'),id:app-all,panelIndex:3,row:3,size_x:12,size_y:7,sort:!('@timestamp',desc),type:search)),query:(query_string:(analyze_wildcard:!t,query:'*')),title:'App%20-%20Overview',uiState:(P-1:(spy:(mode:(fill:!f,name:!n))),P-2:(spy:(mode:(fill:!f,name:!n)))))`;
  }

  eventsLink(appName) {
    return `https://logs.cloud.gov/app/kibana?#/dashboard/App-Events?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now%2Fy,mode:quick,to:now))&_a=(filters:!(),options:(darkTheme:!f),panels:!((col:1,columns:!(app_event.app_name,'@message',app_event.actor_type,app_event.actor_name,app_event.actee_type,app_event.actee_name),id:AppEvent,panelIndex:1,row:3,size_x:12,size_y:6,sort:!('@timestamp',desc),type:search),(col:1,id:App-events,panelIndex:2,row:1,size_x:12,size_y:2,type:visualization)),query:(query_string:(analyze_wildcard:!t,query:'app_event.app_name:%20${appName}')),title:'App%20-%20Events',uiState:())`;
  }

  formatMb(bytes) {
    return Math.round(bytes / 1000000);
  }

  get fullTitle() {
    let content = <span><strong>{ this.state.app.name }</strong> application</span>
    if (this.state.currentSpaceName && this.state.currentOrgName) {
      content = <span><strong>{ this.state.app.name }</strong> application in your <strong>{ this.state.currentSpaceName }</strong> space, which is in your <strong>{ this.state.currentOrgName }</strong> organization</span>;
    }
    return content;
  }

  render() {
    let content = <h4 className="test-none_message">No app</h4>;

    if (this.state.loading) {
      content = <Loading text="Loading app now" />
    } else if (this.state.app.name) {
      content = (
        <div>
          <h2>{ this.fullTitle }</h2>
          <section className={this.styler('section-card')}>
            <h3>About this application</h3>
            <table>
              <tbody>
                <tr>
                  <td><strong>Name</strong></td>
                  <td>{ this.state.app.name }</td>
                </tr>
                <tr>
                  <td><strong>State</strong></td>
                  <td>{ this.state.app.state }</td>
                </tr>
                <tr>
                  <td><strong>Last push</strong></td>
                  <td>{ this.state.app.package_updated_at }</td>
                </tr>
                <tr>
                  <td><strong>Buildpack</strong></td>
                  <td>{ this.state.app.buildpack }</td>
                </tr>
                <tr>
                  <td><strong>Memory usage</strong></td>
                  <td>
                    <strong>{ this.state.app.stats && this.formatMb(
                        this.state.app.stats.usage.mem) } MB</strong> out of
                      <span>&nbsp;</span>
                     { this.state.app.stats &&
                      this.formatMb(this.state.app.stats.mem_quota) } MB
                  </td>
                </tr>
                <tr>
                  <td><strong>Disk usage</strong></td>
                  <td>
                  <strong>{ this.state.app.stats && this.formatMb(
                    this.state.app.stats.usage.disk) } MB</strong> out of
                    <span>&nbsp;</span>
                    { this.state.app.stats &&
                      this.formatMb(this.state.app.stats.disk_quota) } MB
                  </td>
                </tr>
              </tbody>
            </table>
            <aside>
              <p>To start or stop an app, follow the <a
                href="https://docs.cloudfoundry.org/devguide/deploy-apps/deploy-app.html"
                target="_blank">Cloud Foundry deployment guide.</a>
              </p>
            </aside>
          </section>
          <section className={this.styler("section-card")}>
            <h3>Routes</h3>
            <RouteList initialAppGuid={ this.state.app.guid } />
          </section>
          <section className={this.styler("section-card")}>
            <h3>Services</h3>
            <p>To bind or unbind a service instance to an app, follow the <a
              href="https://docs.cloud.gov/apps/managed-services/#bind-the-service-instance"
              target="_blank">managed services guide</a>.
            </p>
          </section>
          <section className={this.styler("section-card")}>
            <h3>Events</h3>
            <p><a href={ this.eventsLink(this.state.app.name) }>
              View this app’s events on logs.cloud.gov.</a>
            </p>
          </section>
          <section className={this.styler("section-card")}>
            <h3>Logs</h3>
            <p><a href={ this.logsLink(this.state.app.name) }>
            View this app’s logs on logs.cloud.gov.</a></p>
          </section>
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

AppPage.propTypes = {
  initialAppGuid: React.PropTypes.string.isRequired
};
