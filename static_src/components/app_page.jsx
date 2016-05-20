
import React from 'react';

import AppStore from '../stores/app_store.js';

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
                  <td><strong>Memory</strong></td>
                  <td>
                    { this.state.app.stats && this.formatMb(
                        this.state.app.stats.usage.mem) }MB /
                    { this.state.app.stats &&
                      this.formatMb(this.state.app.stats.mem_quota) }MB
                  </td>
                </tr>
                <tr>
                  <td><strong>Disk limit</strong></td>
                  <td>
                    { this.state.app.stats && this.formatMb(
                        this.state.app.stats.usage.disk) }MB /
                    { this.state.app.stats &&
                      this.formatMb(this.state.app.stats.disk_quota) }MB
                  </td>
                </tr>
              </tbody>
            </table>
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

