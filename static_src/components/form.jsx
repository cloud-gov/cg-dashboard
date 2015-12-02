
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
    };
  }

  validate() {
    var errors = [];
    this.props.children.forEach(function(child) {
      var error = child.validate();
      if (error) {
        errors.push(error);
      }
    });
    return errors;
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

  static validatorString(value) {
    return (!!value.length);
  }

  get key() {
    return this.props.key || 'form_element_' + this.state.id;
  }
}
FormElement.propTypes = {
  label: React.PropTypes.string,
  validator: React.PropTypes.function,
  key: React.PropTypes.string
};
FormElement.defaultProps = {
  label: '',
  validator: function() {}
};

const ERR_MSG_MISSING_TEXT = 'No text entered';

export class FormText extends FormElement {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = this.state || {};
    this.state.value = null;
    this.state.error = null;
  }

  validate() {
    var error = null;

    if (!this.state.value && this.state.value.length) {
      error = ERR_MSG_MISSING_TEXT;
    }
    this.setState({error: error});
    return error;
  }

  _handleChange(ev) {
    this.setState({value: ev.target.value,
      error: null}); 
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
        <input type="text" id={ this.key } onChange={ this._handleChange } />
      </div>
    );
  }
}

export class FormSelect extends FormElement {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = this.state || {};
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor={ this.key }>{ this.props.label }</label>
        <select className="form-control" name={ this.key } id={ this.key }>
          { this.props.options.map((option) => {
            return (
              <option value={ option.value }>{ option.label }</option>
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
