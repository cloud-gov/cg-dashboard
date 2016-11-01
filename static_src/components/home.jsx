
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <div>
        <div className={ this.styler('grid') }>
          <h1>Overview</h1>
          <p className={ this.styler('page-dek') }>The dashboard provides an overview of your organizations, spaces, and applications. For full management and deployment of applications, use the <a href="https://docs.cloud.gov/getting-started/setup/">command line interface</a>.
          </p>
          <h3 style={ {marginBottom: '0.5rem' }}>Cheatsheet</h3>
          <div className={ this.styler('grid') }>
            <section className={ this.styler('grid-width-6') }>
              <h4>A few things you can do here</h4>
              <ul>
                <li>See recent activity (log events) for your apps.</li>
                <li>Manage permissions for users of your orgs and spaces.</li>
                <li>Create and bind service instances for your spaces.</li>
                <li>Create and bind routes for your apps.</li>

              </ul>
            </section>
            <section className={ this.styler('grid-width-6') }>
              <h4>Basic cloud.gov structure</h4>
              <ul>
              <li><strong>Organization:</strong> Each org is a <a href="https://docs.cloud.gov/intro/terminology/pricing-terminology/">system</a> (<a href="https://docs.cloud.gov/getting-started/concepts/">shared perimeter</a>) that contains <a href="https://docs.cloud.gov/intro/pricing/system-stuffing/">related spaces holding related applications</a>.
                                                                                                                                                           </li>
                <li><strong>Spaces:</strong> Within an org, your <a href="https://docs.cloud.gov/getting-started/concepts/">spaces</a> provide environments for applications (<a href="https://docs.cloud.gov/intro/overview/using-cloudgov-paas/">example use</a>).
                </li>
                <li><strong>Marketplace:</strong> Use your org’s <a href="https://docs.cloud.gov/apps/managed-services/">marketplace</a> to create <a href="https://docs.cloud.gov/intro/pricing/rates/">service instances</a> for spaces in that org.
                </li>
              </ul>
              <h4>Environments</h4>
              <p>If your org <a href="https://docs.cloud.gov/apps/govcloud/">is in GovCloud</a>, use <a href="https://dashboard.fr.cloud.gov/"><code>https://dashboard.fr.cloud.gov/</code></a> to see it.</p>
            </section>
          </div>
          <div className={ this.styler('grid') }>
            <section className={ this.styler('grid-width-6') }>
              <h4>Looking at an empty sandbox?</h4>
              <p><a href="https://docs.cloud.gov/getting-started/your-first-deploy/">Try making a “hello world” app</a>.</p>
              <h4>About this Dashboard</h4>
              <p>This is an alpha version. You can check out the <a href="https://github.com/18F/cg-dashboard">source code</a> and <a href="https://github.com/18F/cg-dashboard/issues">issue tracker</a>.</p>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
