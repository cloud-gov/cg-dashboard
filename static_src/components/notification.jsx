
import PropTypes from 'prop-types';
import React from 'react';
import keymirror from 'keymirror';
import Action from './action.jsx';
import { entityHealth } from '../constants.js';

const STATUSES = Object.assign({}, entityHealth, keymirror({
  info: null
}));


const propTypes = {
  message: PropTypes.node,
  status: PropTypes.oneOf(Object.keys(STATUSES)),
  actions: PropTypes.arrayOf(PropTypes.object),
  onDismiss: PropTypes.func
};

const defaultProps = {
  message: 'There was a problem',
  status: entityHealth.warning,
  actions: [],
  onDismiss: () => {}
};

export default class Notification extends React.Component {
  constructor(props) {
    super(props);

    this.onCloseClick = this.onCloseClick.bind(this);
  }

  onCloseClick(ev) {
    ev.preventDefault();
    this.props.onDismiss(ev);
  }

  render() {
    let actionElements;

    if (this.props.actions.length) {
      actionElements = this.props.actions.map((action, i) => (
        <Action key={ `notificationAction-${i}` } type="outline" style="white"
          clickHandler={ action.clickHandler }
          classes={ ['notification-action', 'test-notification-action'] }
        >
          { action.text }
        </Action>
      ));
    }

    return (
    <div className={ `notification notification-${this.props.status} test-notification` }>
      <div className="notification-wrap">
        <p className="notification-message test-notification-message">
          { this.props.message }
        </p>
        { actionElements }
        <a className="notification-dismiss test-notification-dismiss"
          onClick={ this.onCloseClick }
          title="Dismiss notification"
          href="#"
        >
          <span className="usa-sr-only">Close</span>
        </a>
      </div>
    </div>
    );
  }
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;
