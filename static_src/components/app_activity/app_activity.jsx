
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import eventLogTypes from '../../util/event_log_types';
import ElasticLine from '../elastic_line.jsx';
import ElasticLineItem from '../elastic_line_item.jsx';
import Timestamp from './timestamp';
import LogItem from './log_item.jsx';
import CrashEventItem from './crash_event_item.jsx';
import RouteEventItem from './route_event_item.jsx';
import RawJSONDetail from './raw_json_detail.jsx';

const propTypes = {
  domain: PropTypes.object,
  item: PropTypes.object.isRequired,
  route: PropTypes.object,
  service: PropTypes.object
};

const activityTypes = {
  LOG: 'log',
  EVENT: 'event'
};

export default class ActivityLogItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRawJson: false
    };

    this.toggleRawJson = this.toggleRawJson.bind(this);
  }

  toggleRawJson() {
    const { showRawJson } = this.state;
    this.setState({ showRawJson: !showRawJson });
  }

  get logItem() {
    const { item } = this.props;

    if (item.activity_type === activityTypes.LOG) {
      return (
        <LogItem
          statusCode={ item.status_code }
          requestedUrl={ item.requested_url }
        />
      );
    }

    return <span className="activity_log-item_text">{ this.eventContent }</span>;
  }

  get CrashEventItem() {
    const { metadata } = this.props.item;
    const exitDescription = metadata.exit_description;
    const exitStatus = metadata.exit_status;
    const props = { exitDescription, exitStatus };

    return <CrashEventItem { ...props } />;
  }

  routeEventItem(actor, domain, route, unmapped) {
    const props = { actor, domain, route, unmapped };
    return <RouteEventItem { ...props } />;
  }

  formatStorageUpdateMessage(actor, metadata) {
    if ('memory' in metadata.request) {
      // Updated one of memory, disk_quota, or instances
      return `${actor} modified resource allocation of the app.`;
    }

    const appState = metadata.request.state ? metadata.request.state.toLowerCase() : 'updated';

    return `${actor} ${appState} the app.`;
  }

  formatBoundServiceMessage(actor, service) {
    const serviceText = service ? service.guid : 'a service';
    return `${actor} bound ${serviceText} to the app.`;
  }

  get eventContent() {
    const { domain, item, route } = this.props;
    const itemType = item.type;
    const metadata = item.metadata;

    switch (itemType) {
      case eventLogTypes.APP_CRASH:
        return this.CrashEventItem;
      case eventLogTypes.APP_CREATE:
        return `${item.actor_name} created the app with ${metadata.request.memory} MBs of memory.`;
      case eventLogTypes.APP_MAP_ROUTE:
        return this.routeEventItem(item.actor_name, domain, route);
      case eventLogTypes.APP_UNMAP_ROUTE:
        return this.routeEventItem(item.actor_name, domain, route, 'unmapped');
      case eventLogTypes.APP_RESTAGE:
        return `${item.actor_name} restaged the app.`;
      case eventLogTypes.APP_UPDATE:
        return this.formatStorageUpdateMessage(item.actor_name, metadata);
      case eventLogTypes.APP_BIND_SERVICE:
        return this.formatBoundServiceMessage(item.actor_name, this.props.service);
      default:
        return `${itemType} isn't handled`;
    }
  }

  get cssClass() {
    const { item } = this.props;

    if (item.activity_type === activityTypes.LOG) {
      return 'activity_log-item-console';
    }

    return item.activity_type === activityTypes.EVENT ? {
      'activity_log-item-error': item.type === eventLogTypes.APP_CRASH,
      'activity_log-item-warning': item.type === eventLogTypes.APP_UPDATE ||
        item.type === eventLogTypes.APP_RESTAGE,
      'activity_log-item-success': item.type === eventLogTypes.APP_CREATE
    } : {};
  }

  render() {
    const { item } = this.props;

    return (
      <li className={ classnames('activity_log-item', this.cssClass) }>
        <div className="activity_log-item_line" onClick={ this.toggleRawJson }>
          <ElasticLine>
            <ElasticLineItem>
              { this.logItem }
            </ElasticLineItem>
            <ElasticLineItem align="end">
              <Timestamp timestamp={ item.timestamp } />
            </ElasticLineItem>
          </ElasticLine>
        </div>
        <RawJSONDetail item={ item } visible={ this.state.showRawJson} />
      </li>
    );
  }
}

ActivityLogItem.propTypes = propTypes;
