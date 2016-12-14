import React from 'react';
import classNames from 'classnames';

import FormError from './form_error.jsx';


export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      isValid: false,
      fields: {},
      fieldValues: {},
      errs: []
    };
    this._handleSubmit = this._handleSubmit.bind(this);
    this.attachToForm = this.attachToForm.bind(this);
    this.detatchFromForm = this.detatchFromForm.bind(this);
  }

  attachToForm(element) {
    const fields = this.state.fields;
    fields[element.props.name] = element;
    this.setState({ fields });
  }

  detatchFromForm(element) {
    const fields = this.state.fields;
    delete fields[element.props.name];
    this.setState({ fields });
  }

  validate() {
    let name;
    const errs = [];
    for (name in this.state.fields) {
      if (!this.state.fields.propertyIsEnumerable(name)) {
        continue;
      }

      const field = this.state.fields[name];
      const err = field.validate();
      if (err) {
        errs.push(err);
      }
    }
    this.setState({ errs, isValid: !!errs.length });
    this.props.onValidate(errs, this.state.fieldValues);
    if (!errs.length) {
      this.props.onValid(this.state.fieldValues);
    }
  }

  _handleSubmit(ev) {
    const values = this.state.fieldValues;
    ev.preventDefault();
    let name;
    for (name in this.state.fields) {
      if (!this.state.fields.propertyIsEnumerable(name)) {
        continue;
      }

      const field = this.state.fields[name];
      values[name] = field.state.value;
    }
    this.setState({ fieldValues: values });
    this.validate();
  }

  render() {
    let errorMsg;
    const classes = classNames(...this.props.classes);

    if (this.state.errs.length) {
      errorMsg = <FormError message="There were errors submitting the form." />;
    }

    return (
      <form action={ this.props.action } method={ this.props.method }
        onSubmit={ this._handleSubmit } className={ classes }
      >
        { errorMsg }
        <fieldset>
          { React.Children.map(this.props.children, (child) => {
            if (!child || !child.props || !child.props.name) {
              return child;
            }

            let element;
            if (child.props.name === 'submit') {
              element = React.cloneElement(child, {
                onClickHandler: this._handleSubmit
              });
            } else {
              element = React.cloneElement(child, {
                attachToForm: this.attachToForm,
                detachFromForm: this.detachFromForm
              });
            }

            return element;
          })}
        </fieldset>
      </form>
    );
  }
}

Form.propTypes = {
  action: React.PropTypes.string,
  children: React.PropTypes.node,
  classes: React.PropTypes.array,
  method: React.PropTypes.string,
  onValidate: React.PropTypes.func,
  onValid: React.PropTypes.func
};

Form.defaultProps = {
  action: '/',
  classes: [],
  method: 'post',
  onValidate: () => {},
  onValid: () => {}
};
