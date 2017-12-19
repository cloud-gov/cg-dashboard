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
    <h4>Basic Cloud Foundry structure</h4>
    <ul>
      <li>
        <strong>Organization:</strong> Each org is a{' '}
        <a href="https://docs.cloudfoundry.org/concepts/roles.html#orgs">
          system
        </a> that contains related spaces holding related applications.
      </li>
      <li>
        <strong>Spaces:</strong> Within an org, your{' '}
        <a href="https://docs.cloudfoundry.org/concepts/roles.html#spaces">
          spaces
        </a>.
      </li>
      <li>
        <strong>Marketplace:</strong> Use your org’s{' '}
        <a href="https://docs.cloudfoundry.org/devguide/services/managing-services.html">
          marketplace
        </a>{' '}
        to create instances for spaces in that org.
      </li>
    </ul>
  </section>
);

InfoStructure.propTypes = propTypes;

InfoStructure.defaultProps = defaultProps;

export default InfoStructure;
