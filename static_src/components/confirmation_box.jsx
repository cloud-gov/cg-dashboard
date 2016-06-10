
/**
 * A component that renders a box with a different style and background
 */

import React from 'react';

import createStyler from '../util/create_styler';
import actionStyles from 'cloudgov-style/css/components/actions.css';
import baseStyles from 'cloudgov-style/css/base.css';

import Button from './button.jsx';

export default class ConfirmationBox extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
    this.styler = createStyler(actionStyles, baseStyles);
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
    return (
<<<<<<< HEAD
      <div className={ this.styler('actions-confirm') }>
=======
      <div className={ this.styler('action_box') }>
>>>>>>> Service isntance delete confirmation
        <Button label="Confirm"
            classes={[this.styler("usa-button-secondary")]}
            onClickHandler={ this._confirmHandler }>
          <span>Confirm delete</span>
        </Button>
        <Button label="cancel"
            classes={[this.styler("usa-button-outline")]}
            onClickHandler={ this._cancelHandler }>
          <span>Cancel</span>
        </Button>
      </div>
    );
  }
}
ConfirmationBox.propTypes = {
  confirmHandler: React.PropTypes.func.isRequired,
  cancelHandler: React.PropTypes.func.isRequired
};
ConfirmationBox.defaultProps = {
  confirmHandler: (ev) => { console.log('confirm ev', ev); },
  cancelHandler: (ev) => { console.log('cancel ev', ev); }
};

