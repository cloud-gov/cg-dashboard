
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';
import { config } from 'skin';

import createStyler from '../util/create_styler';

const propTypes = {
  org: React.PropTypes.object,
  space: React.PropTypes.object
};

const defaultProps = {
};


export default class SpaceContainer extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    const org = this.props.org || {};
    const space = this.props.space || {};

    return (
      <div className={ this.styler('info', 'info-app_create') }>
        <p>
          Learn how to <a href={ config.docs.deploying_apps }>deploy a new app</a>.
        </p>

        <h5 className={ this.styler('info-header') }>
          Set up the Cloud Foundry CLI
        </h5>
        <p>
          Download and install the <a href={ config.docs.cli }>Cloud
          Foundry command line interface</a>.
        </p>
        <pre>
          $ cf --version
        </pre>
        <p>Make sure to login if you haven't already.</p>
        <pre>
          <code>$ cf login -a { config.platform.api_host } --sso</code>
        </pre>

        <h5 className={ this.styler('info-header') }>
          Push your app
        </h5>
        <p>
          From your application directory:
        </p>
        <pre>
          <code>$ cf target -o { org.name || '<org>' } -s { space.name || '<space>' }</code><br />
          <code>$ cf push my-app</code>
        </pre>
      </div>
    );
  }
}

SpaceContainer.propTypes = propTypes;
SpaceContainer.defaultProps = defaultProps;
