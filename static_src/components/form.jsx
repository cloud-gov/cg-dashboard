
import React from 'react';

import classNames from 'classnames';

var currid = 0;

function nextId() {
  currid += 1;
  return currid;
}

export class Form extends React.Component {
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
    var fields =  this.state.fields;
    fields[element.props.name] = element;
    this.setState({ fields: fields });
  }

  detatchFromForm(element) {
    var fields =  this.state.fields;
    delete fields[element.props.name];
    this.setState({ fields: fields });
  }

  validate() {
    var name,
        errs = [];
    for (name in this.state.fields) {
      let field = this.state.fields[name];
      let err = field.validate();
      if (err) {
        errs.push(err);
      }
    }
    this.setState({errs: errs, isValid: !!errs.length});
    this.props.onValidate(errs);
    if (!errs.length) {
      this.props.onValid(this.state.fieldValues);
    }
  }

  _handleSubmit(ev) {
    var values = this.state.fieldValues;
    ev.preventDefault();
    for (name in this.state.fields) {
      let field = this.state.fields[name];
      values[name] = field.state.value;
    }
    this.setState({fieldValues: values});
    this.validate();
  }

  render() {
    var errorMsg;

    var classes = classNames(...this.props.classes);

    if (this.state.errs.length) {
      errorMsg = <FormError message='There were errors submitting the form.' />
    }

    return (
      <form action={ this.props.action } method={ this.props.method }
          onSubmit={ this._handleSubmit } className={ classes }>
        { errorMsg }
        <fieldset>
          { React.Children.map(this.props.children, (child) => {
            if (child && child.props && child.props.name) {
              if (child.props.name === 'submit') {
                return React.cloneElement(child, {
                  onClickHandler: this._handleSubmit
                })
              } else {
                return React.cloneElement(child, {
                  attachToForm: this.attachToForm,
                  detachFromForm: this.detachFromForm
                })
              }
            } else {
              return child;
            }
          })}
        </fieldset>
      </form>
    );
  }
};
Form.propTypes = {
  action: React.PropTypes.string,
  classes: React.PropTypes.array,
  method: React.PropTypes.string,
  onValidate: React.PropTypes.func,
  onValid: React.PropTypes.func
};
Form.defaultProps = {
  action: '/',
  classes: [],
  method: 'post',
  onValidate: function() { },
  onValid: function() { }
};

export class FormElement extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {err: null};
    if (!this.props.key) {
      this.state.id = nextId();
    }
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  componentWillMount() {
    this.props.attachToForm && this.props.attachToForm(this);
  }

  componentWillUnmount() {
    this.props.detatchFromForm && this.props.detatchFromForm(this);
  }

  static validatorString(value, name) {
    if (!value.length) {
      return {
        message: `The ${name || '' } field was not filled out`
      }
    }
  }

  validate() {
    var err = this.props.validator(this.state.value, this.props.label);
    if (err) {
      err.value = this.state.value;
      // TODO rename to onError.
      this.props.onValidate(err);
    }
    this.setState({ err: err });
    return err;
  }

  get key() {
    return this.props.key || 'form_element_' + this.state.id;
  }
}
FormElement.propTypes = {
  classes: React.PropTypes.array,
  label: React.PropTypes.string,
  validator: React.PropTypes.func,
  key: React.PropTypes.string,
  onValidate: React.PropTypes.func
};
FormElement.defaultProps = {
  classes: [],
  label: '',
  validator: function() {},
  onValidate: function() {}
};

export class FormError extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return <p>{ this.props.message }</p>;
  }
}
FormError.propTypes = { message: React.PropTypes.string };
FormError.defaultProps = { message: '' };


export class FormText extends FormElement {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = this.state || {};
    this.state.value = '';
    this.state.err = null;
    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange(ev) {
    this.setState({value: ev.target.value});
  }

  render() {
    var error;
    var classes = classNames(...this.props.classes);

    if (this.state.err) {
      error = <FormError message={ this.state.err.message } />
    }
    return (
      <div>
        { error }
        <label htmlFor={ this.key }>{ this.props.label }</label>
        <input type="text" id={ this.key } value={ this.state.value }
          onChange={ this._handleChange } className={ classes } />
      </div>
    );
  }
}


export class FormSelect extends FormElement {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = this.state || {};
    this.state.value = '';
    this.state.err = null;
    this._handleChange = this._handleChange.bind(this)
  }

  _handleChange(ev) {
    this.setState({ value: ev.target.value });
  }

  render() {
    var error;
    var classes = classNames(...this.props.classes);

    if (this.state.err) {
      error = <FormError message={ this.state.err.message } />
    }
    return (
      <div>
        { error }
        <label htmlFor={ this.key }>{ this.props.label }</label>
        <select
            className={ classes }
            name={ this.key }
            id={ this.key }
            onChange={ this._handleChange }
            value={ this.state.value }>
          <option value='' key={ this.key + '-null'}>
            --
          </option>
          { this.props.options.map((option, i) => {
            return (
              <option
                  value={ option.value }
                  key={ this.key + '-' + i }>
                { option.label }
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}
FormSelect.propTypes = Object.assign(FormSelect.propTypes, {
  options: React.PropTypes.array
});
FormSelect.defaultProps = Object.assign(FormSelect.defaultProps, {
  options: []
});
