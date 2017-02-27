
import React from 'react';

import ErrorStore from '../stores/error_store.js';
import GlobalError from './global_error.jsx';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const propTypes = {
  maxItems: React.PropTypes.number
};
const defaultProps = {
  maxItems: 2
};

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
    ErrorStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    let errNotifications;

    if (this.state.errs.length) {
      errNotifications = [];
      this.state.errs
        .slice(0, this.props.maxItems)
        .forEach((err, i) => {
          const errorMessage = (
            <GlobalError key={ `error-${i}` }err={ err } />
          );
          errNotifications.push(errorMessage);
        });
    }

    return (
      <div className="test-global-errors">
        { errNotifications }
      </div>
    );
  }
}

GlobalErrorContainer.propTypes = propTypes;
GlobalErrorContainer.defaultProps = defaultProps;
