import PropTypes from "prop-types";
import React from "react";
import { config } from "skin";
import UserStore from "../stores/user_store";

const propTypes = {
  org: PropTypes.object,
  space: PropTypes.object,
  brief: PropTypes.bool,
  user: PropTypes.object
};

const defaultProps = {
  brief: false
};

export default class InfoAppCreate extends React.Component {
  get noPermission() {
    return (
      <p>
        <em>Space developers</em> can add apps to spaces. Read more about{" "}
        <a href={config.docs.deploying_apps}>adding apps</a> and{" "}
        <a href={config.docs.roles}>permissions</a>.
      </p>
    );
  }

  get spaceDeveloper() {
    const org = this.props.org || {};
    const space = this.props.space || {};
    let content;

    if (this.props.brief) {
      const cliLink = config.docs.cli ? (
        <a href={config.docs.cli}>command line interface (CLI)</a>
      ) : (
        <span>Command line interface (CLI)</span>
      );
      const deployingApps = config.docs.deploying_apps && (
        <a href={config.docs.deploying_apps}>Read more about adding apps</a>
      );

      content = (
        <div className="info info-app_create">
          <p>Add a new app to this space in the {cliLink}</p>
          <pre>
            <code>
              $ cf target -o {org.name || "<org>"} -s {space.name || "<space>"}
            </code>
            <br />
            <code>$ cf push my-app</code>
          </pre>
          {deployingApps}
        </div>
      );
    } else {
      content = (
        <div className="info info-app_create">
          <p>
            Learn how to{" "}
            <a href={config.docs.deploying_apps}>deploy a new app</a>.
          </p>

          <h5 className="info-header">Set up the Cloud Foundry CLI</h5>
          <p>
            Download and install the{" "}
            <a href={config.docs.cli}>Cloud Foundry command line interface</a>.
          </p>
          <pre>$ cf --version</pre>
          <p>Make sure to login if you haven't already.</p>
          <pre>
            <code>$ cf login -a {config.platform.api_host} --sso</code>
          </pre>

          <h5 className="info-header">Push your app</h5>
          <p>From your application directory:</p>
          <pre>
            <code>
              $ cf target -o {org.name || "<org>"} -s {space.name || "<space>"}
            </code>
            <br />
            <code>$ cf push my-app</code>
          </pre>
        </div>
      );
    }

    return content;
  }

  render() {
    const space = this.props.space || {};
    const user = this.props.user || {};

    const content = UserStore.hasRole(user.guid, space.guid, "space_developer")
      ? this.spaceDeveloper
      : this.noPermission;

    return <div className="info info-app_create">{content}</div>;
  }
}

InfoAppCreate.propTypes = propTypes;
InfoAppCreate.defaultProps = defaultProps;
