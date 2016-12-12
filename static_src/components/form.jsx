
import React from 'react';

import classNames from 'classnames';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

let currid = 0;

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
      if (!this.state.fields.isPropertyEnumerable(name)) {
        continue;
      }

      const field = this.state.fields[name];
      const err = field.validate();
      if (err) {
        errs.push(err);
      }
    }
    this.setState({ errs, isValid: !!errs.length });
    this.props.onValidate(errs);
    if (!errs.length) {
      this.props.onValid(this.state.fieldValues);
    }
  }

  _handleSubmit(ev) {
    const values = this.state.fieldValues;
    ev.preventDefault();
    let name;
    for (name in this.state.fields) {
      if (!this.state.fields.isPropertyEnumerable(name)) {
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

export class FormElement extends React.Component {
  static validatorString(value, name) {
    if (!value.length) {
      return { message: `The ${name || ''} field was not filled out` };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = { err: null };
    if (!this.props.key) {
      this.state.id = nextId();
    }
    this.componentWillMount = this.componentWillMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    if (this.props.attachToForm) {
      this.props.attachToForm(this);
    }
  }

  componentWillUnmount() {
    if (this.props.detatchFromForm) {
      this.props.detatchFromForm(this);
    }
  }

  onChange(e) {
    this.setState({ value: e.target.value });
  }

  validate() {
    const err = this.props.validator(this.state.value, this.props.label);
    if (err) {
      err.value = this.state.value;
      // TODO rename to onError.
      this.props.onValidate(err);
    }
    this.setState({ err });
    return err;
  }

  get key() {
    return this.props.key || `form_element_${this.state.id}`;
  }
}

FormElement.propTypes = {
  attachToForm: React.propTypes.func,
  classes: React.PropTypes.array,
  detatchFromForm: React.propTypes.func,
  key: React.PropTypes.string,
  label: React.PropTypes.string,
  onValidate: React.PropTypes.func,
  validator: React.PropTypes.func
};

FormElement.defaultProps = {
  classes: [],
  label: '',
  onValidate: () => {},
  validator: () => {}
};

export class FormError extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <span className={ this.styler('error_message')}>
        { this.props.message }
      </span>
    );
  }
}
FormError.propTypes = { message: React.PropTypes.string };
FormError.defaultProps = { message: '' };


export class FormText extends FormElement {
  constructor(props) {
    super(props);
    this.state = this.state || {};
    this.state.value = '';
    this.state.err = null;
  }

  render() {
    let error;
    const classes = classNames(...this.props.classes);

    if (this.state.err) {
      error = <FormError message={ this.state.err.message } />;
    }

    return (
      <div>
        { error }
        <label htmlFor={ this.key }>{ this.props.label }</label>
        <input type="text" id={ this.key } value={ this.state.value }
          onChange={ this.onChange } className={ classes }
        />
      </div>
    );
  }
}

FormText.propTypes = FormElement.propTypes;
FormText.defaultProps = FormElement.defaultProps;

export class FormInlineText extends FormInlineText {
  render() {
    let classes = classNames(...this.props.classes);
    let error = null;
    if (this.state.err) {
      error = <FormError message={ this.state.err.message } />;
    }

    return (
      <span>
        <input type="text" id={ this.key } value={ this.state.value }
          onChange={ this.onChange } className={ classes }
        />
        { error }
      </span>
    );
  }
}


export class FormNumber extends React.Component {
  constructor(props) {
    super(props);
    this.validateNumber = this.validateNumber.bind(this);
  }

  validateNumber(text) {
    const value = parseInt(text, 10);
    if (typeof value !== 'number') {
      return { message: 'Invalid number' };
    }

    if (Number.isNaN(value)) {
      return { message: 'Invalid number' };
    }

    const min = this.props.min;
    if (typeof min === 'number' && value < min) {
      return { message: `Total must be greater than ${min}` };
    }

    const max = this.props.max;
    if (typeof max === 'number' && value > max) {
      return { message: `Total exceeds ${max}` };
    }

    return null;
  }

  render() {
    return <FormInlineText { ...this.props } validator={ this.validateNumber } />;
  }
}

FormNumber.propTypes = {
  min: React.PropTypes.number,
  max: React.PropTypes.number
};

export class FormSelect extends FormElement {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = this.state || {};
    this.state.value = '';
    this.state.err = null;
    this._handleChange = this._handleChange.bind(this);
  }

  _handleChange(ev) {
    this.setState({ value: ev.target.value });
  }

  render() {
    let error;
    const classes = classNames(...this.props.classes);

    if (this.state.err) {
      error = <FormError message={ this.state.err.message } />;
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
          value={ this.state.value }
        >
          <option value="" key={ `${this.key}-null` }>
            --
          </option>
          { this.props.options.map((option, i) => (
              <option
                value={ option.value }
                key={ `${this.key}-${i}` }
              >
                { option.label }
              </option>
          ))}
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
