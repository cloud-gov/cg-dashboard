
import moment from 'moment';
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';
import formatRoute from '../util/format_route';
import RouteStore from '../stores/route_store';
import DomainStore from '../stores/domain_store';
import ServiceInstanceStore from '../stores/service_instance_store';


function stateSetter(props) {
  const item = props.item;
  const route = RouteStore.get(item.metadata.route_guid);

  let service;
  if (item.metadata.request && item.metadata.service_instance_guid) {
    service = ServiceInstanceStore.get(item.metadata.request.service_instance_guid)
  }

  let domain;
  if (route) {
    domain = DomainStore.get(route.domain_guid);
  }

  return {
    domain,
    route,
    service
  };
}


export default class ActivityLogItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...stateSetter(props),
      showRawJson: false,
      relativeTimestamp: false
    };

    this.styler = createStyler(style);
    this._onChange = this._onChange.bind(this);
    this.toggleRawJson = this.toggleRawJson.bind(this);
    this.toggleTimestampType = this.toggleTimestampType.bind(this);
  }

  componentDidMount() {
    DomainStore.addChangeListener(this._onChange);
    RouteStore.addChangeListener(this._onChange);
    ServiceInstanceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    DomainStore.removeChangeListener(this._onChange);
    RouteStore.removeChangeListener(this._onChange);
    ServiceInstanceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter(this.props));
  }

  formatTimestamp(timestamp) {
    if (this.state.relativeTimestamp) return moment(timestamp).fromNow();

    return moment(timestamp).format('MMM DD YYYY HH:mm:ss');
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
        <div className={ this.styler('activity_log-item_raw') }>
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

  get crashContent() {
    const item = this.props.item;
    const metadata = item.metadata;
    let content;

    switch (metadata.exit_description) {
      case 'app instance exited':
        content = `the app instance exited with ${metadata.exit_status} status`;
        break;
      case 'out of memory':
        content = 'it ran out of memory';
        break;
      case 'failed to accept connections within health check timeout':
        content = `it ${metadata.exit_description}`;
        break;
      default:
        content = 'bad things happened';
    }
    return (<span>The app crashed because { content }.</span>);
  }

  get content() {
    if (this.props.item.activity_type === 'log') {
      return this.logContent;
    } else {
      return this.eventContent;
    }
  }

  get eventContent() {
    let content = `${this.props.item.type} isn't handled`;
    let url = 'a url';
    const item = this.props.item;
    const metadata = item.metadata;
    const route = this.state.route;
    const domain = this.state.domain;
    if (route && domain) {
      url = formatRoute(domain.name, route.host, route.path);
    }
    const link = (route) ? (<a href={ `//${url}` }>{ url }</a>) : url;

    // TODO: if route is not found, trigger fetch action to get it
    // https://github.com/18F/cg-dashboard/pull/533#discussion_r73931508

    // TODO break each type out into it's own component to avoid so many
    // concerns (and store listeners) in a single component
    if (item.type === 'app.crash') {
      content = this.crashContent;
    } else if (item.type === 'audit.app.create') {
      content = (
        <span>{ item.actor_name } created the app with { metadata.request.memory } MBs of memory.</span>
      );
    } else if (item.type === 'audit.app.map-route') {
      content = (
        <span>{ item.actor_name } mapped { link } to the app.</span>
      );
    } else if (item.type === 'audit.app.restage') {
      content = (
        <span>{ item.actor_name} restaged the app.</span>
      );
    } else if (item.type === 'audit.app.unmap-route') {
      content = (
        <span>{ item.actor_name } unmapped { url } from the app.</span>
      );
    } else if (item.type === 'audit.app.update') {
      const appState = (metadata.request.state) ? metadata.request.state.toLowerCase() : 'updated';
      content = (
        <span>{ item.actor_name } { appState } the app.</span>
      );
    } else if (item.type === 'audit.service_binding.create') {
      const service = this.state.service;
      const serviceText = (service) ? service.guid : 'a service';
      content = (
        <span>{ item.actor_name} bound { serviceText } to the app.</span>
      );
    }

    return <p className={ this.styler('activity_log-item_text') }>{ content }</p>;
  }

  get logContent() {
    const item = this.props.item;

    return (
      <p className={ this.styler('activity_log-item_text') }>
        { item.status_code } { item.requested_url }
      </p>
    );
  }

  get cssClass() {
    let css;
    const item = this.props.item;
    if (item.activity_type === 'log') {
      css = 'activity_log-item-console';
    } else if (item.activity_type === 'event') {
      switch (item.type) {
        case 'app.crash':
          css = 'activity_log-item-error';
          break;
        case 'audit.app.update':
        case 'audit.app.restage':
          css = 'activity_log-item-warning';
          break;
        case 'audit.app.create':
          css = 'activity_log-item-success';
          break;
      }
    }
    return css;
  }

  render() {
    return (
      <li className={ this.styler('activity_log-item', this.cssClass) }>
        <div onClick={ this.toggleRawJson }>
          { this.content }
        </div>
        <div className={ this.styler('activity_log-item_timestamp') }>
          <span onClick={ this.toggleTimestampType }>
            { this.formatTimestamp(this.props.item.timestamp) }
          </span>
        </div>
        { this.code }
      </li>
    );
  }
}

ActivityLogItem.propTypes = {
  item: React.PropTypes.object.isRequired
};
