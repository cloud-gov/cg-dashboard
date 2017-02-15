import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';
import FormElement from './form_element.jsx';
import FormError from './form_error.jsx';
import createStyler from '../../util/create_styler';


export default class FormText extends FormElement {
  constructor(props) {
    super(props);
    this.state = this.state || {};
    this.styler = createStyler(style);
  }

  get error() {
    if (!this.state.err) {
      return null;
    }

    return <FormError message={ this.state.err.message } />;
  }

  get inline() {
    const errorClass = !!this.error && 'error';
    return (
      <span className={ this.styler(errorClass) }>
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
