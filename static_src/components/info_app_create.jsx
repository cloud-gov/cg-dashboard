
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';
import { config } from 'skin';

import createStyler from '../util/create_styler';
import UserStore from '../stores/user_store';

const propTypes = {
  org: React.PropTypes.object,
  space: React.PropTypes.object,
  user: React.PropTypes.object
};

const defaultProps = {
};


export default class InfoAppCreate extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  get noPermission() {
    return (
      <p>
        <em>Space developers</em> can add apps to
        spaces. Read more about <a href={ config.docs.deploying_apps }>adding
        apps</a> and <a href={ config.docs.roles }>permissions</a>.
      </p>
    );
  }

  get spaceDeveloper() {
    const org = this.props.org || {};
    const space = this.props.space || {};

    return (
      <div>
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

  render() {
    const space = this.props.space || {};
    const user = this.props.user || {};

    const content = UserStore.hasRole(user.guid, space.guid, 'space_developer') ?
      this.spaceDeveloper :
      this.noPermission;

    return (
      <div className={ this.styler('info', 'info-app_create') }>
        { content }
      </div>
    );
  }
}

InfoAppCreate.propTypes = propTypes;
InfoAppCreate.defaultProps = defaultProps;
