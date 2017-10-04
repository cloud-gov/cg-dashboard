import React, { Component } from 'react';
import PropTypes from 'prop-types';

import appActions from '../actions/app_actions';
import envActions from '../actions/env_actions';
import Action from './action.jsx';
import ErrorMessage from './error_message.jsx';
import ComplexList from './complex_list.jsx';
import PanelActions from './panel_actions.jsx';
import EnvVarListItem from './env_var_list_item.jsx';
import EnvVarForm from './env_var_form.jsx';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const Section = ({ styler, children }) => (
  <div className={styler('panel-row')}>{children}</div>
);

Section.propTypes = {
  styler: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};

const Header = ({ styler, children }) => (
  <header>
    <h4 className={styler('panel-row-header')}>{children}</h4>
  </header>
);

Header.propTypes = {
  styler: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired
};

export default class EnvPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.styler = createStyler(style);

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleShowUserEnvClick = this.handleShowUserEnvClick.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleAddFormDismiss = this.handleAddFormDismiss.bind(this);
    this.handleShowEnvClick = this.handleShowEnvClick.bind(this);
  }

  handleDelete(name) {
    const { app, env } = this.props;
    const { environment_json: envVars } = env;

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
    const { app, env } = this.props;
    const { environment_json: envVars } = env;

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
    const { app, env, updateError } = this.props;
    const { environment_json: envVars } = env;

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

    const label = 'Add env var';
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
        label={show ? 'Hide' : 'Reveal'}
        type="outline"
      >
        {show ? 'Hide' : 'Reveal'}
      </Action>
    );
  }

  render() {
    const { styler } = this;
    const { app, env, updateError } = this.props;
    const { showUserEnv, showAddForm, showEnv } = this.state;
    const { updating } = app;

    return (
      <div>
        <Section styler={styler}>
          <Header styler={styler}>User-defined environment variables</Header>
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
        <Section styler={styler}>
          <Header styler={styler}>System-defined environment variables</Header>
          {this.renderShowHideAction(showEnv, this.handleShowEnvClick)}
          {showEnv && (
            <pre>
              {JSON.stringify(
                {
                  ...env,
                  environment_json: '<omitted>'
                },
                null,
                2
              )}
            </pre>
          )}
        </Section>
      </div>
    );
  }
}

EnvPanel.propTypes = {
  app: PropTypes.shape({
    guid: PropTypes.string.isRequired
  }).isRequired,
  env: PropTypes.shape({
    environment_json: PropTypes.object.isRequired
  }).isRequired,
  updateError: PropTypes.shape({
    code: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    errorCode: PropTypes.string.isRequired
  })
};
