
import React from 'react';

import Button from './button.jsx';

var currid = 0;

function nextId() {
  currid += 1; 
  reutrn currid;
}

export class Form extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
    };
  }

  render() {
    return (
      <form action={ this.props.action } method={ this.props.method }
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
      this.state.id = nextId()
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

export class FormText extends FormElement {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    return (
      <div>
        <label for={ this.key }>{ this.props.label }</label>
        <input type="text" id={ this.key } />
      </div>
    );
  }
}

export class FormSelect extends FormElement {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  render() {
    return (
      <div>
        <label for={ this.key }>{ this.props.label }</label>
        <select name={ this.key } id={ this.key }>
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
