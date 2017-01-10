
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import Action from './action.jsx';
import ActivityLogItem from './activity_log_item.jsx';
import ActivityStore from '../stores/activity_store';
import createStyler from '../util/create_styler';

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
    empty: (ActivityStore.fetched && activity.length === 0)
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
  }

  componentWillUnmount() {
    ActivityStore.removeChangeListener(this._onChange);
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

  render() {
    let content = <div></div>;

    if (this.state.empty) {
      content = <h5 className="test-none_message">No recent activity</h5>;
    } else {
      content = (
        <div>
          <p>View advanced logs at <a href="https://logs.cloud.gov">logs.cloud.gov</a></p>
          <ul className={ this.styler('activity_log') }>
            { this.state.activity
                .slice(0, this.state.maxItems)
                .map(item => <ActivityLogItem key={ item.guid } item={ item } />)
            }
          </ul>
          <Action label="View more" clickHandler={ this.handleMore }>
            Show more activity
          </Action>
        </div>
      );
    }

    return (
      <div className={ this.styler('panel-content') }>
        <div className={ this.styler('activity_log-container') }>
          { content }
        </div>
      </div>
    );
  }
}

ActivityLog.propTypes = propTypes;
ActivityLog.defaultProps = defaultProps;
