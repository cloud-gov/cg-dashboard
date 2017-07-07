
import moment from 'moment-timezone';
import style from 'cloudgov-style/css/cloudgov-style.css';
import PropTypes from 'prop-types';
import React from 'react';
import createStyler from '../util/create_styler';
import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';
import formatRoute from '../util/format_route';

const propTypes = {
  domain: PropTypes.object,
  item: PropTypes.object.isRequired,
  route: PropTypes.object,
  service: PropTypes.object
};

export default class ActivityLogItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRawJson: false
    };

    this.styler = createStyler(style);
    this.toggleRawJson = this.toggleRawJson.bind(this);
  }

  formatTimestamp(timestamp) {
    return moment(timestamp).tz(moment.tz.guess()).format('MMM DD YYYY HH:mm:ss z');
  }

  toggleRawJson() {
    const current = this.state.showRawJson;
    this.setState({ showRawJson: !current });
  }

  get code() {
    let content;
    if (this.state.showRawJson) {
      content = (
        <div className={ this.styler('activity_log-item_raw') }>
          <div>Raw event log</div>
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
      case 'failed to start':
        content = 'it failed to start';
        break;
      default:
        content = 'of an unknown reason';
    }
    return (<span>The app crashed because { content }.</span>);
  }

  get content() {
    if (this.props.item.activity_type === 'log') {
      return this.logContent;
    }

    return this.eventContent;
  }

  get eventContent() {
    let content = `${this.props.item.type} isn't handled`;
    let url = 'a url';
    const { domain, item, route } = this.props;
    const metadata = item.metadata;
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
        <span>
          { item.actor_name } created the app with { metadata.request.memory } MBs of memory.
        </span>
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
      if ('memory' in metadata.request) {
        // Updated one of memory, disk_quota, or instances
        content =
          <span>{ item.actor_name } modified resource allocation of the app.</span>;
      } else {
        const appState = metadata.request.state ? metadata.request.state.toLowerCase() : 'updated';
        content = (
          <span>{ item.actor_name } { appState } the app.</span>
        );
      }
    } else if (item.type === 'audit.service_binding.create') {
      const service = this.props.service;
      const serviceText = (service) ? service.guid : 'a service';
      content = (
        <span>{ item.actor_name} bound { serviceText } to the app.</span>
      );
    }

    return <span className={ this.styler('activity_log-item_text') }>{ content }</span>;
  }

  get logContent() {
    const item = this.props.item;

    return (
      <span className={ this.styler('activity_log-item_text') }>
        { item.status_code } { item.requested_url }
      </span>
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
        default:
          break;
      }
    }
    return css;
  }

  render() {
    return (
      <li className={ this.styler('activity_log-item', this.cssClass) }>
        <div
          className={ this.styler('activity_log-item_line') }
          onClick={ this.toggleRawJson }
        >
          <ElasticLine>
            <ElasticLineItem>
              { this.content }
            </ElasticLineItem>
            <ElasticLineItem align="end">
              <span className={ this.styler('activity_log-item_timestamp') }>
                { this.formatTimestamp(this.props.item.timestamp) }
              </span>
            </ElasticLineItem>
          </ElasticLine>
        </div>
        { this.code }
      </li>
    );
  }
}

ActivityLogItem.propTypes = propTypes;
