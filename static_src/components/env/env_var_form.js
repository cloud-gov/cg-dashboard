import React, { Component } from "react";
import PropTypes from "prop-types";

import { generateId } from "../../util/element_id";
import PanelActions from "../panel_actions.jsx";
import Action from "../action.jsx";

const propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const defaultProps = {
  name: "",
  value: "",
  disabled: false
};

export default class EnvVarForm extends Component {
  constructor(props) {
    super(props);

    const { name, value } = this.props;
    this.state = { name, value };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.nameInputId = generateId("env_var_form_name_");
    this.valueInputId = generateId("env_var_form_value_");
  }

  handleNameChange(e) {
    const name = e.currentTarget.value;
    this.setState(() => ({ name }));
  }

  handleValueChange(e) {
    const value = e.currentTarget.value;
    this.setState(() => ({ value }));
  }

  handleSubmit(e) {
    e.preventDefault();
    const { name, value } = this.state;
    this.props.onSubmit({ name, value });
  }

  render() {
    const { disabled, onDismiss } = this.props;
    const { name, value } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <div>
            <label htmlFor={this.nameInputId}>Name</label>
            <input
              id={this.nameInputId}
              type="text"
              value={name}
              onChange={this.handleNameChange}
            />
          </div>
        </fieldset>
        <fieldset>
          <div>
            <label htmlFor={this.valueInputId}>Value</label>
            <input
              id={this.valueInputId}
              type="text"
              value={value}
              onChange={this.handleValueChange}
            />
          </div>
        </fieldset>
        <PanelActions>
          <Action
            clickHandler={onDismiss}
            label="Cancel"
            style="base"
            type="outline"
            disabled={disabled}
          >
            Cancel
          </Action>
          <Action
            clickHandler={this.handleSubmit}
            label="Save"
            style="finish"
            type="outline"
            disabled={disabled}
          >
            Save
          </Action>
        </PanelActions>
      </form>
    );
  }
}

EnvVarForm.propTypes = propTypes;

EnvVarForm.defaultProps = defaultProps;
