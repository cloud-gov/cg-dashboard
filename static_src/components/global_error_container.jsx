
import React from 'react';

import ErrorStore from '../stores/error_store.js';
import Notification from './notification.jsx';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const propTypes = {};
const defaultProps = {};

function stateSetter() {
  const errs = ErrorStore.getAll();

  return {
    errs
  };
}

export default class GlobalErrorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();
    this.styler = createStyler(style);

    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    ErrorStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ErroStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    let errNotifications;

    if (this.state.errs.length) {
      errNotifications = [];
      this.state.errs.forEach((err, i) => {
        const errorMessage = (
          <Notification key={ `error-${i}` }
            message={ err.description }
            actions={[{ text: 'Refresh' }]}
          />
        );
        errNotifications.push(errorMessage);
      });
    }

    return (
      <div>
        { errNotifications }
      </div>
    );
  }
}

GlobalErrorContainer.propTypes = propTypes;
GlobalErrorContainer.defaultProps = defaultProps;
