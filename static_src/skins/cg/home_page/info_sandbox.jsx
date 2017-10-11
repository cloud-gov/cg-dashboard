import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string
};

const defaultProps = {
  className: ''
};

const InfoSandbox = ({ className }) => (
  <section className={className}>
    <h4>Looking at an empty sandbox?</h4>
    <p>
      <a href="https://cloud.gov/docs/getting-started/your-first-deploy/">
        Try making a “hello world” app
      </a>.
    </p>
    <p>
      Then see{' '}
      <a href="https://cloud.gov/overview/pricing/free-limited-sandbox/#a-few-things-you-can-try-in-your-sandbox">
        what else you can do
      </a>{' '}
      and the{' '}
      <a href="https://cloud.gov/overview/pricing/free-limited-sandbox/#sandbox-limitations">
        sandbox policies
      </a>.
    </p>
  </section>
);

InfoSandbox.propTypes = propTypes;

InfoSandbox.defaultProps = defaultProps;

export default InfoSandbox;
