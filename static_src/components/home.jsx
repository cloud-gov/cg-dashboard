
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
        <aside className={ this.styler('usa-alert', 'usa-alert-info') }>
          <p className={ this.styler('usa-alert-body') }><em>
            We updated the Deck and renamed it the Dashboard!
            <a href="https://cloud.gov/2016/07/07/deck-update.html"> Here’s what
            changed and how to give feedback</a> on this alpha version. The <a href="https://console.cloud.gov/">old Deck</a> will
            be available until July 11.
          </em></p>
        </aside>
        <div className={ this.styler('usa-grid') }>
          <h2>Dashboard</h2>
          <p>This Dashboard is a good way to get an overview of your organizations, spaces, and applications. For full management and deployment of applications, use the <a href="https://docs.cloud.gov/getting-started/setup/">command line interface</a>.
          </p>

          <h3 style={ {marginBottom: '0.5rem' }}>Cheatsheet</h3>
          <section className={ this.styler('usa-width-one-half') }>
            <h4>A few things you can do here</h4>
            <ul>
              <li>See information about your orgs, spaces, and apps.</li>
              <li>Manage permissions for users of your orgs and spaces.</li>
              <li>Create service instances for your spaces.</li>
            </ul>
          </section>
          <section className={ this.styler('usa-width-one-half') }
            style={{ width: '45.82117%' }}>
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
          <section className={ this.styler('usa-width-one-half') }
            style={{marginTop: '-4rem'}}>
            <h4>Looking at an empty sandbox?</h4>
            <p><a href="https://docs.cloud.gov/getting-started/your-first-deploy/">Try making a “hello world” app</a>.</p>
            <h4>About this Dashboard</h4>
            <p>This is an alpha version. You can check out the <a href="https://github.com/18F/cg-deck">source code</a> and <a href="https://github.com/18F/cg-deck/issues">issue tracker</a>.</p>
          </section>
        </div>
      </div>
    );
  }
}
