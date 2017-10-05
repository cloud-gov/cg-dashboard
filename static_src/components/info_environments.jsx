
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  className: PropTypes.string
};

const defaultProps = {
  className: ''
};

export default class InfoEnvironment extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className={ this.props.className }></section>
    );
  }
}

InfoEnvironment.propTypes = propTypes;

InfoEnvironment.defaultProps = defaultProps;
