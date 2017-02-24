
import React from 'react';

import Action from './action.jsx';
import ActivityLogItem from './activity_log_item.jsx';
import ActivityStore from '../stores/activity_store';
import DomainStore from '../stores/domain_store';
import PanelActions from './panel_actions.jsx';
import RouteStore from '../stores/route_store';
import createStyler from '../util/create_styler';
import { config } from 'skin';
import ServiceInstanceStore from '../stores/service_instance_store';
import style from 'cloudgov-style/css/cloudgov-style.css';

function stateSetter(props) {
  const activity = ActivityStore
    .getAll()
    .filter(item => {
      if (item.activity_type === 'log') {
        return item.app_guid === props.initialAppGuid && item.status_code >= 400;
      }

      if (item.activity_type === 'event' && item.type === 'audit.service_binding.create') {
        return item.metadata.request.app_guid === props.initialAppGuid;
      }

      if (item.activity_type === 'event') {
        return item.actee === props.initialAppGuid;
      }

      return false;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return {
    activity,
    empty: (ActivityStore.fetched && activity.length === 0),
    hasErrors: ActivityStore.hasErrors,
    errors: ActivityStore.errors
  };
}

const propTypes = {
  initialAppGuid: React.PropTypes.string.isRequired,
  maxItems: React.PropTypes.number
};

const defaultProps = {
  maxItems: 10
};

export default class ActivityLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter(props);
    this.state.maxItems = props.maxItems;
    this.styler = createStyler(style);

    this._onChange = this._onChange.bind(this);
    this.handleMore = this.handleMore.bind(this);
  }

  componentDidMount() {
    ActivityStore.addChangeListener(this._onChange);
    DomainStore.addChangeListener(this._onChange);
    RouteStore.addChangeListener(this._onChange);
    ServiceInstanceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ActivityStore.removeChangeListener(this._onChange);
    DomainStore.removeChangeListener(this._onChange);
    RouteStore.removeChangeListener(this._onChange);
    ServiceInstanceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter(this.props));
  }

  handleMore(ev) {
    ev.preventDefault();
    const currentState = stateSetter(this.props);
    currentState.maxItems = this.state.maxItems + this.props.maxItems;
    this.setState(currentState);
  }

  get documentation() {
    return <config.snippets.logs />;
  }

  showMoreActivity() {
    if (this.state.activity.length > this.props.maxItems &&
        this.state.activity.length >= this.state.maxItems) {
      return true;
    }
    return false;
  }

  render() {
    let content = <div></div>;

    if (this.state.empty && this.state.hasErrors) {
      content = <h5 className="test-none_message">An error occured fetching recent activity</h5>;
    } else if (this.state.empty) {
      content = <h5 className="test-none_message">No recent activity</h5>;
    } else {
      let showMore = this.showMoreActivity() &&
        (
          <PanelActions>
            <Action label="View more" clickHandler={ this.handleMore } type="outline">
              Show more activity
            </Action>
          </PanelActions>
        );
      content = (
        <div>
          { this.documentation }
          <ul className={ this.styler('activity_log') }>
            { this.state.activity
                .slice(0, this.state.maxItems)
                .map(item => {
                  let service;
                  if (item.metadata.request && item.metadata.service_instance_guid) {
                    service = ServiceInstanceStore.get(
                      item.metadata.request.service_instance_guid
                    );
                  }

                  let domain;
                  const route = RouteStore.get(item.metadata.route_guid);
                  if (route) {
                    domain = DomainStore.get(route.domain_guid);
                  }

                  return (
                    <ActivityLogItem
                      key={ item.guid }
                      item={ item }
                      service={ service }
                      route={ route }
                      domain={ domain }
                    />
                  );
                })
            }
            { showMore }
          </ul>
        </div>
      );
    }

    return (
      <div className={ this.styler('activity_log-container') }>
        { content }
      </div>
    );
  }
}

ActivityLog.propTypes = propTypes;
ActivityLog.defaultProps = defaultProps;
