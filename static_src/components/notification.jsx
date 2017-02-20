
import React from 'react';
import keymirror from 'keymirror';

import Action from './action.jsx';
import createStyler from '../util/create_styler';
import { entityHealth } from '../constants.js';
import style from 'cloudgov-style/css/cloudgov-style.css';

const STATUSES = Object.assign({}, entityHealth, keymirror({
  info: null
}));


const propTypes = {
  message: React.PropTypes.string,
  status: React.PropTypes.oneOf(Object.keys(STATUSES)),
  actions: React.PropTypes.arrayOf(React.PropTypes.object),
  onDismiss: React.PropTypes.func
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
    this.props = props;
    this.styler = createStyler(style);
  }

  onCloseClick(ev) {
    ev.preventDefault();
    this.props.onDismiss(ev);
  }

  render() {
    const statusClass = `notification-${this.props.status}`;
    let content = <span>{ this.props.message }</span>;
    let actionElements;

    if (this.props.actions.length) {
      actionElements = this.props.actions.map((action, i) => (
        <Action key={ `notificationAction-${i}` } type="outline" style="white"
          classes= {[ 'notification-action' ]}
        >
          { action.text }
        </Action>
      ));
    }

    return (
    <div className={ this.styler('notification', statusClass) }>
      <div className={ this.styler('notification-wrap') }>
        <p className={ this.styler('notification-message') }>
          { content }
        </p>
        { actionElements }
        <a className={ this.styler('notification-dismiss') }
           onClick={ this.onCloseClick }
           title="Dismiss notification">
          <span className={ this.styler('usa-sr-only') }>Close</span>
        </a>
      </div>
    </div>
    );
  }
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;
