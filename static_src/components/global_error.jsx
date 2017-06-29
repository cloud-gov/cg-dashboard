
import React from 'react';

import Notification from './notification.jsx';
import createStyler from '../util/create_styler';
import { config } from 'skin';
import errorActions from '../actions/error_actions.js';
import style from 'cloudgov-style/css/cloudgov-style.css';


const propTypes = {
  err: React.PropTypes.object
};

const defaultProps = {};

export default class GlobalError extends React.Component {
  constructor(props) {
    super(props);

    this.styler = createStyler(style);

    this.onNotificationDismiss = this.onNotificationDismiss.bind(this);
    this.onNotificationRefresh = this.onNotificationRefresh.bind(this);
  }

  onNotificationDismiss(ev) {
    ev.preventDefault();
    errorActions.dismissError(this.props.err);
  }

  onNotificationRefresh(ev) {
    ev.preventDefault();
    window.location.reload();
  }

  render() {
    const err = this.props.err;
    const link = (config.docs.status) && (
      <span> check <a target="_blank" href={ config.docs.status }>
        { config.platform.name }'s status</a> or
      </span>
    );

    const description = err.description || 'An unknown error occurred';
    const wrappedDescription = (
      <span>
        { description }. { (description.length > 80) && <br /> }
        Please { link } try again.
      </span>
    );

    return (
      <Notification
        message={ wrappedDescription }
        actions={[{ text: 'Refresh', clickHandler: this.onNotificationRefresh }]}
        onDismiss={ this.onNotificationDismiss }
      />
    );
  }
}

GlobalError.propTypes = propTypes;
GlobalError.defaultProps = defaultProps;
