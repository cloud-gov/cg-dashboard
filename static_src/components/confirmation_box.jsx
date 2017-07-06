
/**
 * A component that renders a box with a different style and background
 */

import style from 'cloudgov-style/css/cloudgov-style.css';
import PropTypes from 'prop-types';
import React from 'react';

import createStyler from '../util/create_styler';

import Action from './action.jsx';

const CONFIRM_STYLES = [
  'nexto',
  'over',
  'block'
];

const propTypes = {
  style: PropTypes.oneOf(CONFIRM_STYLES),
  message: PropTypes.any,
  confirmationText: PropTypes.string,
  confirmHandler: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func.isRequired
};

const defaultProps = {
  style: 'inline',
  message: <div></div>,
  confirmationText: 'Confirm delete',
  confirmHandler: (ev) => { console.log('confirm ev', ev); },
  cancelHandler: (ev) => { console.log('cancel ev', ev); }
};

export default class ConfirmationBox extends React.Component {
  constructor(props) {
    super(props);

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
    const styleClass = `confirm-${this.props.style}`;

    return (
      <div className={ this.styler('confirm', styleClass) }>
        <span className={ this.styler('confirm-message') }>
        { this.props.message }</span>
        <div>
          <Action label="Cancel"
              style="base"
              type="outline"
              clickHandler={ this._cancelHandler }>
            <span>Cancel</span>
          </Action>
          <Action label="Confirm"
              style="warning"
              clickHandler={ this._confirmHandler }>
            <span>{ this.props.confirmationText }</span>
          </Action>
        </div>
      </div>
    );
  }
}

ConfirmationBox.propTypes = propTypes;

ConfirmationBox.defaultProps = defaultProps;
