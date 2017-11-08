import React, { Component } from "react";

import { appPropType } from "../../../stores/app_store";
import appActions from "../../../actions/app_actions";
import {
  envRequestPropType,
  updateErrorPropType
} from "../../../stores/env_store";
import envActions from "../../../actions/env_actions";
import Action from "../../action.jsx";
import Loading from "../../loading.jsx";
import ErrorMessage from "../../error_message.jsx";
import ComplexList from "../../complex_list.jsx";
import Panel from "../../panel.jsx";
import PanelActions from "../../panel_actions.jsx";
import EnvVarListItem from "../env_var_list_item";
import EnvVarForm from "../env_var_form";
import Header from "./header";
import Section from "./section";

const propTypes = {
  app: appPropType.isRequired,
  envRequest: envRequestPropType.isRequired,
  updateError: updateErrorPropType
};

export default class EnvPanel extends Component {
  constructor(props) {
    super(props);

    this.state = { showUserEnv: false, showAddForm: false, showEnv: false };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleShowUserEnvClick = this.handleShowUserEnvClick.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleAddFormDismiss = this.handleAddFormDismiss.bind(this);
    this.handleShowEnvClick = this.handleShowEnvClick.bind(this);
  }

  handleDelete(name) {
    const { app, envRequest: { result } } = this.props;
    const { environment_json: envVars } = result;

    appActions
      .updateApp(app.guid, {
        environment_json: {
          ...envVars,
          [name]: undefined
        }
      })
      .then(() => envActions.fetchEnv(app.guid));
  }

  handleAddClick(e) {
    e.preventDefault();
    this.setState(({ showAddForm }) => ({ showAddForm: !showAddForm }));
    const { app } = this.props;
    envActions.invalidateUpdateError(app.guid);
  }

  handleUpdate({ name, value }) {
    const { app, envRequest: { result } } = this.props;
    const { environment_json: envVars } = result;

    envActions.invalidateUpdateError(app.guid);
    appActions
      .updateApp(app.guid, {
        environment_json: {
          ...envVars,
          [name]: value
        }
      })
      .then(() => this.setState(() => ({ showAddForm: false })))
      .then(() => envActions.fetchEnv(app.guid));
  }

  handleShowUserEnvClick(e) {
    e.preventDefault();
    this.setState(({ showUserEnv, showAddForm }) => ({
      showUserEnv: !showUserEnv,
      showAddForm: !showUserEnv ? false : showAddForm
    }));
  }

  handleAddFormDismiss(e) {
    e.preventDefault();
    this.setState(() => ({ showAddForm: false }));
    const { app } = this.props;
    envActions.invalidateUpdateError(app.guid);
  }

  handleShowEnvClick(e) {
    e.preventDefault();
    this.setState(({ showEnv }) => ({ showEnv: !showEnv }));
  }

  renderUserVarItems() {
    const { app, envRequest: { result }, updateError } = this.props;
    const { environment_json: envVars } = result;

    return Object.keys(envVars).map(name => (
      <EnvVarListItem
        key={`${name}${envVars[name]}`}
        name={name}
        value={envVars[name]}
        app={app}
        updateError={updateError}
        deleteError={updateError}
        onUpdate={this.handleUpdate}
        onDelete={this.handleDelete}
      />
    ));
  }

  renderAddAction() {
    const { app } = this.props;
    const { updating } = app;

    const label = "Add env var";
    return (
      <Action
        clickHandler={this.handleAddClick}
        label={label}
        type="outline"
        disabled={updating}
      >
        {label}
      </Action>
    );
  }

  renderShowHideAction(show, handler) {
    return (
      <Action
        style="primary"
        clickHandler={handler}
        label={show ? "Hide" : "Reveal"}
        type="outline"
      >
        {show ? "Hide" : "Reveal"}
      </Action>
    );
  }

  renderEnv() {
    const { envRequest: { result } } = this.props;

    return (
      <pre>
        {JSON.stringify(
          {
            ...result,
            environment_json: "<omitted>"
          },
          null,
          2
        )}
      </pre>
    );
  }

  renderContents() {
    const { app, envRequest, updateError } = this.props;
    const { updating } = app;
    const { isFetching, error } = envRequest;
    const { showUserEnv, showAddForm, showEnv } = this.state;

    if (isFetching) {
      return <Loading style="inline" />;
    }

    if (error) {
      return (
        <ErrorMessage
          error={{ message: "Could not load environment details." }}
        />
      );
    }

    return (
      <div>
        <Section>
          <Header>User-defined environment variables</Header>
          <PanelActions>
            {this.renderShowHideAction(
              showUserEnv,
              this.handleShowUserEnvClick
            )}
            {showUserEnv && !showAddForm && this.renderAddAction()}
          </PanelActions>
        </Section>
        {showUserEnv && (
          <div>
            {showAddForm && (
              <EnvVarForm
                disabled={updating}
                onDismiss={this.handleAddFormDismiss}
                onSubmit={this.handleUpdate}
              />
            )}
            {showAddForm && updateError && <ErrorMessage error={updateError} />}
            <ComplexList>{this.renderUserVarItems()}</ComplexList>
          </div>
        )}
        <Section>
          <Header>System-defined environment variables</Header>
          {this.renderShowHideAction(showEnv, this.handleShowEnvClick)}
          {showEnv && this.renderEnv()}
        </Section>
      </div>
    );
  }

  render() {
    return <Panel title="Environment variables">{this.renderContents()}</Panel>;
  }
}

EnvPanel.propTypes = propTypes;
