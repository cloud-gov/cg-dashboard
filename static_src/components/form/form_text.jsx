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

  render() {
    const classes = [];

    if (this.props.inline) {
      classes.push('form_text-inline');
    }

    if (!!this.error) {
      classes.push('error');
    }

    // Spaces in label give a healthy space for inline forms
    const label = <label htmlFor={ this.key }> { this.props.label } </label>;
    return (
      <div className={ this.styler(classes) }>
        { !this.props.labelAfter && label }
        <input type="text" id={ this.key } value={ this.state.value }
          onChange={ this.onChange } className={ this.classes }
        />
        { this.props.labelAfter && label }
        { this.error }
      </div>
    );
  }
}

FormText.propTypes = Object.assign({}, FormElement.propTypes, {
  inline: React.PropTypes.bool,
  labelAfter: React.PropTypes.bool
});

FormText.defaultProps = Object.assign({}, FormElement.defaultProps, {
  inline: false,
  labelAfter: false
});
