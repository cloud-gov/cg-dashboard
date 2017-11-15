import PropTypes from "prop-types";
import React from "react";

import ErrorStore from "../stores/error_store.js";
import GlobalError from "./global_error.jsx";

const propTypes = {
  maxItems: PropTypes.number
};
const defaultProps = {
  maxItems: 1
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

    this.state = stateSetter();

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    ErrorStore.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    ErrorStore.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState(stateSetter());
  }

  render() {
    let errNotifications;

    if (this.state.errs.length) {
      errNotifications = [];
      this.state.errs.slice(0, this.props.maxItems).forEach((err, i) => {
        const errorMessage = <GlobalError key={`error-${i}`} err={err} />;
        errNotifications.push(errorMessage);
      });
    }

    return <div className="test-global-errors">{errNotifications}</div>;
  }
}

GlobalErrorContainer.propTypes = propTypes;
GlobalErrorContainer.defaultProps = defaultProps;
