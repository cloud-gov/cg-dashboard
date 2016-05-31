
import React from 'react';

import AppStore from '../stores/app_store.js';
import RouteList from './route_list.jsx';

export default class AppPage extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      app: {},
      currentAppGuid: this.props.initialAppGuid
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      app: AppStore.get(this.state.currentAppGuid) || {}
    });
  }

  formatMb(bytes) {
    return Math.round(bytes / 1000000);
  }

  render() {
    let content = <h4 className="test-none_message">No app</h4>;

    if (this.state.app.name) {
      content = (
        <div>
          <h2>{ this.state.app.name }</h2>
          <section>
            <h3>About</h3>
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
                        this.state.app.stats.usage.mem) }MB</strong> out of
                      <span>&nbsp;</span>
                     { this.state.app.stats &&
                      this.formatMb(this.state.app.stats.mem_quota) }MB
                  </td>
                </tr>
                <tr>
                  <td><strong>Disk usage</strong></td>
                  <td>
                  <strong>{ this.state.app.stats && this.formatMb(
                    this.state.app.stats.usage.disk) }MB</strong> out of
                    <span>&nbsp;</span>
                    { this.state.app.stats &&
                      this.formatMb(this.state.app.stats.disk_quota) }MB
                  </td>
                </tr>
              </tbody>
            </table>
            <aside>
              <p>To start or stop an app, view the <a
                href="https://docs.cloudfoundry.org/devguide/deploy-apps/deploy-app.html"
                target="_blank">
                <span>&nbsp;</span>deployment guide</a> for more information.
              </p>
            </aside>
          </section>

          <h3>Routes</h3>
          <RouteList initialAppGuid={ this.state.app.guid } />

          <h3>Services</h3>
          <p>To bind or unbind a service instance to an app view<a
            href="https://docs.cloud.gov/apps/managed-services/#bind-the-service-instance"
            target="_blank">
            <span>&nbsp;</span>managed services guide</a> for more information.
          </p>
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

