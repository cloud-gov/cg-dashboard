
import React from 'react';

import Button from './button.jsx';

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
      fields: {}
    };
  }

  componentWillMount() {
    this.registerElements(this.props.children);
  }

  attachToForm = (element) => {
    this.state.fields[element.props.name] = element;
  }

  detatchFromForm = () => {
    delete this.state.fields[element.props.name];
  }

  validate() {
    var name;
    for (name in this.state.fields) {
      let field = this.state.fields[name];
      field.validate();
    }
  }

  registerElements = (children) => {
    React.Children.forEach(children, (child) => {
      if(child.props.name) {
        // TODO, loop through children in render and pass prop there.
        child.props.attachToForm = this.attachToForm;
        child.props.detachForm = this.detatchFromForm;
      }
    });
  }

  render() {
    return (
      <form action={ this.props.action } method={ this.props.method }>
        <fieldset>
          { this.props.children }
        </fieldset>
      </form>
    );
  }
};
Form.propTypes = {
  action: React.PropTypes.string,
  method: React.PropTypes.string
};
Form.defaultProps = {
  action: '/',
  method: 'post'
};

export class FormElement extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
    if (!this.props.key) {
      this.state.id = nextId();
    }
  }
  
  componentWillMount = () => {
    this.props.attachToForm && this.props.attachToForm(this);
  }

  componentWillUnmount = () => {
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
  }

  get key() {
    return this.props.key || 'form_element_' + this.state.id;
  }
}
FormElement.propTypes = {
  label: React.PropTypes.string,
  validator: React.PropTypes.func,
  key: React.PropTypes.string,
  onValidate: React.PropTypes.func
};
FormElement.defaultProps = {
  label: '',
  validator: function() {},
  onValidate: function() {}
};


export class FormText extends FormElement {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = this.state || {};
    this.state.value = '';
    this.state.error = null;
  }

  _handleChange(ev) {
    this.setState({value: ev.target.value}); 
  }

  render() {
    var error;
    if (this.state.error) {
      error = <span>{ this.state.error }</span>;
    }
    return (
      <div className="form-group">
        { error }
        <label htmlFor={ this.key }>{ this.props.label }</label>
        <input type="text" id={ this.key } value={ this.state.value }
          onChange={ this._handleChange } />
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
    this.state.error = null;
  }

  _handleChange(ev) {
    this.setState({ value: ev.target.value });
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor={ this.key }>{ this.props.label }</label>
        <select className="form-control" name={ this.key } id={ this.key }
            value={ this.state.value }>
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
