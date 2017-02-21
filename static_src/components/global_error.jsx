
import React from 'react';

import Notification from './notification.jsx';
import createStyler from '../util/create_styler';
import errorActions from '../actions/error_actions.js';
import style from 'cloudgov-style/css/cloudgov-style.css';


const propTypes = {
  err: React.PropTypes.object
};

const defaultProps = {};

export default class GlobalError extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);

    this.onNotificationDismiss = this.onNotificationDismiss.bind(this);
  }

  onNotificationDismiss(ev) {
    ev.preventDefault();
    errorActions.dismissError(this.props.err);
  }

  render() {
    const err = this.props.err;

    return (
      <Notification
        message={ err.description }
        actions={[{ text: 'Refresh' }]}
        onDismiss={ this.onNotificationDismiss }
      />
    );
  }
}

GlobalError.propTypes = propTypes;
GlobalError.defaultProps = defaultProps;
