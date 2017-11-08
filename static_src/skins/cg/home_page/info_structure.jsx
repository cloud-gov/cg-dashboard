import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  className: PropTypes.string
};

const defaultProps = {
  className: ''
};

const InfoStructure = ({ className }) => (
  <section className={className}>
    <h4>Basic cloud.gov structure</h4>
    <ul>
      <li>
        <strong>Organization:</strong> Each org is a{' '}
        <a href="https://cloud.gov/overview/terminology/pricing-terminology/#system">
          system
        </a>{' '}
        (<a href="https://cloud.gov/docs/getting-started/concepts/#organizations">
          shared perimeter
        </a>) that contains{' '}
        <a href="https://cloud.gov/overview/pricing/system-stuffing/">
          related spaces holding related applications
        </a>.
      </li>
      <li>
        <strong>Spaces:</strong> Within an org, your{' '}
        <a href="https://cloud.gov/docs/getting-started/concepts/#spaces">
          spaces
        </a>{' '}
        provide environments for applications (<a href="https://cloud.gov/overview/overview/using-cloudgov-paas/">
          example use
        </a>).
      </li>
      <li>
        <strong>Marketplace:</strong> Use your org’s{' '}
        <a href="https://cloud.gov/docs/apps/managed-services/">
          marketplace
        </a>{' '}
        to create <a href="https://cloud.gov/docs/services/">service</a>{' '}
        instances for spaces in that org.
      </li>
    </ul>
  </section>
);

InfoStructure.propTypes = propTypes;

InfoStructure.defaultProps = defaultProps;

export default InfoStructure;
