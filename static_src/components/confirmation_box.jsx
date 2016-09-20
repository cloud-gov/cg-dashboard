
/**
 * A component that renders a box with a different style and background
 */

import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';

import Action from './action.jsx';

const CONFIRM_STYLES = [
  'inline',
  'block'
];

export default class ConfirmationBox extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
    this.styler = createStyler(style);
    this._confirmHandler = this._confirmHandler.bind(this);
    this._cancelHandler = this._cancelHandler.bind(this);
  }

  _confirmHandler(ev) {
    this.props.confirmHandler(ev);
  }

  _cancelHandler(ev) {
    this.props.cancelHandler(ev);
  }

  render() {
    let styles;
    if (this.props.style === 'block') {
      styles = {
        background: 'none',
        border: 'none',
        float: 'none',
        padding: 0
      };
    }
    return (
      <div style={styles} className={ this.styler('actions-confirm') }>
        { this.props.message }
        <Action label="Confirm"
            style="secondary"
            clickHandler={ this._confirmHandler }>
          <span>{ this.props.confirmationText }</span>
        </Action>
        <Action label="Cancel"
            style="primary"
            type="outline"
            clickHandler={ this._cancelHandler }>
          <span>Cancel</span>
        </Action>
      </div>
    );
  }
}

ConfirmationBox.propTypes = {
  style: React.PropTypes.oneOf(CONFIRM_STYLES),
  message: React.PropTypes.any,
  confirmationText: React.PropTypes.string,
  confirmHandler: React.PropTypes.func.isRequired,
  cancelHandler: React.PropTypes.func.isRequired
};

ConfirmationBox.defaultProps = {
  style: 'inline',
  message: <div></div>,
  confirmationText: 'Confirm delete',
  confirmHandler: (ev) => { console.log('confirm ev', ev); },
  cancelHandler: (ev) => { console.log('cancel ev', ev); }
};
