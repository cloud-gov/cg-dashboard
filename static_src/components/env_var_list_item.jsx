import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Action from './action.jsx';
import ConfirmationBox from './confirmation_box.jsx';
import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';
import Loading from './loading.jsx';
import EnvVarForm from './env_var_form.jsx';

export default class EnvVarListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleEditToggle = this.handleEditToggle.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
    this.handleDeleteDismiss = this.handleDeleteDismiss.bind(this);
  }

  handleDeleteClick(e) {
    e.preventDefault();
    this.setState(() => ({ deleting: true }));
  }

  handleDeleteConfirm(e) {
    e.preventDefault();
    const { name } = this.props;
    this.props.onDelete(name);
  }

  handleDeleteDismiss(e) {
    e.preventDefault();
    this.setState(() => ({ deleting: false }));
  }

  handleEditToggle(e) {
    e.preventDefault();
    this.setState(({ editing }) => ({ editing: !editing }));
  }

  renderDeleteAction() {
    const { name } = this.props;

    return (
      <Action
        key="delete"
        label={`Delete environment variable "${name}"`}
        type="link"
        style="warning"
        clickHandler={this.handleDeleteClick}
      >
        Delete
      </Action>
    );
  }

  renderEditAction() {
    const { name } = this.props;
    return (
      <Action
        key="edit"
        label={`Edit ${name} environment variable`}
        type="link"
        style="primary"
        clickHandler={this.handleEditToggle}
      >
        Edit
      </Action>
    );
  }

  renderActions() {
    const { app } = this.props;
    const { updating } = app;
    if (updating) {
      return <Loading loadingDelayMS={100} style="inline" />;
    }

    return [this.renderEditAction(), this.renderDeleteAction()];
  }

  render() {
    const { name, value, app, onUpdate } = this.props;
    const { editing, deleting } = this.state;
    const { updating } = app;

    if (editing) {
      return (
        <EnvVarForm
          name={name}
          value={value}
          onDismiss={this.handleEditToggle}
          onSubmit={onUpdate}
        />
      );
    }

    if (deleting) {
      return (
        <ConfirmationBox
          style="over"
          message={`Delete environment variable "${name}" from ${app.name}?`}
          confirmationText={'Yes, delete'}
          confirmHandler={this.handleDeleteConfirm}
          cancelHandler={this.handleDeleteDismiss}
          disabled={updating}
        />
      );
    }

    return (
      <ElasticLine>
        <ElasticLineItem>{name}</ElasticLineItem>
        <ElasticLineItem align="end">{this.renderActions()}</ElasticLineItem>
      </ElasticLine>
    );
  }
}

EnvVarListItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  app: PropTypes.shape({
    name: PropTypes.string.isRequired,
    updating: PropTypes.bool
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
