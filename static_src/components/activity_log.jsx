
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import ActivityLogItem from './activity_log_item.jsx';
import ActivityStore from '../stores/activity_store';
import createStyler from '../util/create_styler';

function stateSetter(props) {
  const activity = ActivityStore.getAll().filter((item) => {
    if (item.type === 'audit.service_binding.create') {
      return item.metadata.request.app_guid === props.initialAppGuid;
    }
    return item.actee === props.initialAppGuid;
  }).sort((a, b) => a.timestamp < b.timestamp);

  return {
    activity
  };
}

const propTypes = {
  initialAppGuid: React.PropTypes.string.isRequired,
  title: React.PropTypes.string
};

const defaultProps = {
  title: 'Activity Log'
};

export default class ActivityLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter(props);
    this.styler = createStyler(style);

    this._onChange = this._onChange.bind(this);
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

  render() {
    return (
      <div>
        <h1>{ this.props.title }</h1>
        <ul className={ this.styler('activity_log') }>
          { this.state.activity.map((item) => {
            return (
              <ActivityLogItem key={ item.guid } item={ item } />
            );
          })}
        </ul>
      </div>
    );
  }
}

ActivityLog.propTypes = propTypes;
ActivityLog.defaultProps = defaultProps;
