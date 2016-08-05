
import moment from 'moment';
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';
import RouteStore from '../stores/route_store';
import ServiceInstanceStore from '../stores/service_instance_store';

export default class ActivityLogItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRawJson: false,
      relativeTimestamp: true
    };

    this.styler = createStyler(style);
    this._onChange = this._onChange.bind(this);
    this.toggleRawJson = this.toggleRawJson.bind(this);
    this.toggleTimestampType = this.toggleTimestampType.bind(this);
  }

  componentDidMount() {
    RouteStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    RouteStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({});
  }

  formatTimestamp(timestamp) {
    if (this.state.relativeTimestamp) return moment(timestamp).fromNow();

    return moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
  }

  toggleRawJson() {
    const current = this.state.showRawJson;
    this.setState({ showRawJson: !current });
  }

  toggleTimestampType() {
    this.setState({ relativeTimestamp: !this.state.relativeTimestamp });
  }

  get code() {
    let content;
    if (this.state.showRawJson) {
      content = (
        <div className={ this.styler('activity-log-item-raw') }>
          <code>
            <pre>
              { JSON.stringify(this.props.item, null, 2) }
            </pre>
          </code>
        </div>
      );
    }

    return content;
  }

  get content() {
    let content = `${this.props.item.type} isn't handled`;
    const item = this.props.item;
    const metadata = item.metadata;
    const route = RouteStore.get(metadata.route_guid);
    const url = (route) ? `${route.host}${route.domain}/${route.path}` : 'a url';
    const link = (route) ? (<a href={ `//${url}` }>{ url }</a>) : url;

    // TODO: if route is not found, trigger fetch action to get it

    if (item.type === 'app.crash') {
      content = (<p>The app crashed with { metadata.exit_description }.</p>);
    } else if (item.type === 'audit.app.create') {
      content = (
        <p>{ item.actor_name } created the app with { metadata.request.memory } MBs of memory.</p>
      );
    } else if (item.type === 'audit.app.map-route') {
      content = (
        <p>{ item.actor_name } mapped { link } to the app.</p>
      );
    } else if (item.type === 'audit.app.restage') {
      content = (
        <p>{ item.actor_name} restaged the app.</p>
      );
    } else if (item.type === 'audit.app.unmap-route') {
      content = (
        <p>{ item.actor_name } unmapped { url } from the app.</p>
      );
    } else if (item.type === 'audit.app.update') {
      const appState = (metadata.request.state) ? metadata.request.state.toLowerCase() : 'updated';
      content = (
        <p>{ item.actor_name } { appState } the app.</p>
      );
    } else if (item.type === 'audit.service_binding.create') {
      const service = ServiceInstanceStore.get(metadata.request.service_instance_guid);
      const serviceText = (service) ? service.guid : 'a service';
      content = (
        <p>{ item.actor_name} bound { serviceText } to the app.</p>
      );
    }

    return content;
  }

  render() {
    return (
      <li>
        <div className={ this.styler('activity-log-item') }>
          <div className={ this.styler('activity-log-item-text') }
            onClick={ this.toggleRawJson }
          >
            { this.content }
          </div>
          <div className={ this.styler('activity-log-item-timestamp') }>
            <span onClick={ this.toggleTimestampType }>
              { this.formatTimestamp(this.props.item.timestamp) }
            </span>
          </div>
          { this.code }
        </div>
      </li>
    );
  }
}

ActivityLogItem.propTypes = {
  item: React.PropTypes.object.isRequired
};
