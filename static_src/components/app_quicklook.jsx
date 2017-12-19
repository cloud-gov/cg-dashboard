import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";
import ElasticLine from "./elastic_line.jsx";
import ElasticLineItem from "./elastic_line_item.jsx";
import EntityIcon from "./entity_icon.jsx";
import { appHref } from "../util/url";
import { appHealth, isHealthyApp } from "../util/health";

const EXTRA_INFO = ["state", "memory", "diskQuota"];

const propTypes = {
  app: PropTypes.object.isRequired,
  orgGuid: PropTypes.string.isRequired,
  spaceGuid: PropTypes.string.isRequired,
  spaceName: PropTypes.string,
  extraInfo: PropTypes.arrayOf(propVal => EXTRA_INFO.includes(propVal))
};

const defaultProps = {
  extraInfo: ["state"]
};

export default class AppQuicklook extends React.Component {
  appHref() {
    const props = this.props;
    const appGuid = props.app.guid;
    return appHref(props.orgGuid, props.spaceGuid, appGuid);
  }

  appState(app) {
    const health = appHealth(app);

    return (
      <span className={`status status-${health}`}>
        {app.state.toLowerCase()}
      </span>
    );
  }

  appName() {
    const { app } = this.props;

    return (
      <a
        className={classNames({ "status-error": !isHealthyApp(app) })}
        href={this.appHref()}
      >
        {app.name}
      </a>
    );
  }

  render() {
    const app = this.props.app;
    const info = [];

    if (this.props.extraInfo.includes("state")) {
      const oneInfo = this.props.extraInfo.length === 1;

      // Only show the state if app is crashed or theres only one extra col
      if (!isHealthyApp(app) || oneInfo) {
        info.push(
          <ElasticLineItem key="1">{this.appState(app)}</ElasticLineItem>
        );
      }
    }
    if (this.props.extraInfo.includes("memory")) {
      info.push(
        <ElasticLineItem key="2" align="end">
          {app.memory} MB <br />
          <span className="subtext">memory allocated</span>
        </ElasticLineItem>
      );
    }
    if (this.props.extraInfo.includes("diskQuota")) {
      info.push(
        <ElasticLineItem key="3" align="end">
          {app.disk_quota} MB <br />
          <span className="subtext">disk quota</span>
        </ElasticLineItem>
      );
    }

    return (
      <ElasticLine>
        <ElasticLineItem>
          <h3 className="contents-secondary">
            <EntityIcon
              entity="app"
              health={appHealth(app)}
              iconSize="medium"
            />
            <span className="contents-path">{this.props.spaceName} / </span>
            {this.appName()}
          </h3>
        </ElasticLineItem>
        {info}
      </ElasticLine>
    );
  }
}

AppQuicklook.propTypes = propTypes;
AppQuicklook.defaultProps = defaultProps;
