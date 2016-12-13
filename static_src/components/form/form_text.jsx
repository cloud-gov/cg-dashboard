import React from 'react';
import classNames from 'classnames';

import FormElement from './form_element.jsx';
import FormError from './form_error.jsx';


export default class FormText extends FormElement {
  constructor(props) {
    super(props);
    this.state = this.state || {};
  }

  get classes() {
    return classNames(...this.props.classes);
  }

  get error() {
    if (!this.state.err) {
      return null;
    }

    return <FormError message={ this.state.err.message } />;
  }

  get inline() {
    return (
      <span>
        <input type="text" id={ this.key } value={ this.state.value }
          onChange={ this.onChange } className={ this.classes }
        />
        { this.error }
      </span>
    );
  }

  get content() {
    return (
      <div>
        { this.error }
        <label htmlFor={ this.key }>{ this.props.label }</label>
        <input type="text" id={ this.key } value={ this.state.value }
          onChange={ this.onChange } className={ this.classes }
        />
      </div>
    );
  }

  render() {
    return this.props.inline ? this.inline : this.content;
  }
}

FormText.propTypes = Object.assign({}, FormElement.propTypes, {
  inline: React.PropTypes.bool
});

FormText.defaultProps = Object.assign({}, FormElement.defaultProps, {
  inline: false
});
