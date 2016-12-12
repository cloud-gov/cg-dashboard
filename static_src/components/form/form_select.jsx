import React from 'react';
import classNames from 'classnames';

import FormElement from './form_element.jsx';
import FormError from './form_error.jsx';


export default class FormSelect extends FormElement {
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
