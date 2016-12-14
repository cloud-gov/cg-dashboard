
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';

export default class InfoStructure extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <section className={ this.props.className }>
        <h4>Basic cloud.gov structure</h4>
        <ul>
          <li><strong>Organization:</strong> Each org is a <a href="https://docs.cloud.gov/intro/terminology/pricing-terminology/">system</a> (<a href="https://docs.cloud.gov/getting-started/concepts/">shared perimeter</a>) that contains <a href="https://docs.cloud.gov/intro/pricing/system-stuffing/">related spaces holding related applications</a>.
          </li>
          <li><strong>Spaces:</strong> Within an org, your <a href="https://docs.cloud.gov/getting-started/concepts/">spaces</a> provide environments for applications (<a href="https://docs.cloud.gov/intro/overview/using-cloudgov-paas/">example use</a>).
          </li>
          <li><strong>Marketplace:</strong> Use your org’s <a href="https://docs.cloud.gov/apps/managed-services/">marketplace</a> to create <a href="https://docs.cloud.gov/intro/pricing/rates/">service instances</a> for spaces in that org.
          </li>
        </ul>
      </section>
    );
  }
}

InfoStructure.propTypes = {
  className: React.PropTypes.string
};

InfoStructure.defaultProps = {
  className: ''
};
