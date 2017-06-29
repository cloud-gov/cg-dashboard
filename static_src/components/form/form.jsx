
/**
 * form.jsx
 *
 * A controlled Form component. The form listens to DOM events that bubble up
 * in order to update FormFields in the FormStore and handle form submit
 * actions.
 **/


import React from 'react';
import classNames from 'classnames';

import FormError from './form_error.jsx';
import FormStore from '../../stores/form_store';


function stateSetter(props) {
  const model = FormStore.get(props.guid);
  return {
    errors: [],
    model
  };
}


export default class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter(props);

    this._onStoreChange = this._onStoreChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    FormStore.addChangeListener(this._onStoreChange);
  }

  componentWillUnmount() {
    FormStore.removeChangeListener(this._onStoreChange);
  }

  _onStoreChange() {
    this.setState(stateSetter(this.props));
  }

  _onSubmit(e) {
    if (!this.props.onSubmit) {
      // Without an onSubmit, just default to normal form behavior
      return;
    }

    e.preventDefault();
    // Only show error message after form was submitted
    const model = this.state.model;
    const errors = Object.keys(model && model.fields || {})
      .map(fieldName => model.fields[fieldName].error)
      .filter(error => !!error);

    // Update errors state (clear/set)
    this.setState({ errors });

    this.props.onSubmit(errors, this.state.model.fields);
  }

  render() {
    let errorMsg;
    const classes = classNames(...this.props.classes);

    if (this.props.errorOverride) {
      errorMsg = <FormError message={ this.props.errorOverride } />;
    } else if (this.state.errors.length) {
      errorMsg = <FormError message="There were errors submitting the form." />;
    }

    return (
      <form id={ this.props.guid } action={ this.props.action } method={ this.props.method }
        onSubmit={ this._onSubmit } className={ classes }
      >
        { errorMsg }
        <fieldset>
          { this.props.children }
        </fieldset>
      </form>
    );
  }
}

Form.propTypes = {
  action: React.PropTypes.string,
  children: React.PropTypes.node,
  classes: React.PropTypes.array,
  guid: React.PropTypes.string.isRequired,
  method: React.PropTypes.string,
  onSubmit: React.PropTypes.func,
  errorOverride: React.PropTypes.string
};

Form.defaultProps = {
  action: '/',
  classes: [],
  method: 'post'
};
