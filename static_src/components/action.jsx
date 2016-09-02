
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import panelCss from '../css/panel.css';

import createStyler from '../util/create_styler';

const BUTTON_STYLES = [
  'cautious',
  'outline',
  'outline-inverse',
  'primary',
  'primary-alt',
  'secondary'
];

const BUTTON_TYPES = [
  'button',
  'link',
  'submit'
];

const propTypes = {
  style: React.PropTypes.oneOf(BUTTON_STYLES),
  classes: React.PropTypes.array,
  label: React.PropTypes.string,
  type: React.PropTypes.oneOf(BUTTON_TYPES),
  disabled: React.PropTypes.bool,
  clickHandler: React.PropTypes.func,
  children: React.PropTypes.any
};

const defaultProps = {
  style: 'primary',
  classes: [],
  label: '',
  type: 'button',
  disabled: false,
  clickHandler: () => true,
  children: []
};

export default class Action extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style, panelCss);
  }

  render() {
    const styleClass = `usa-button-${this.props.style}`;
    let classes = this.styler(...this.props.classes);
    let content = <div></div>;

    if (this.props.type !== 'link') {
      const classList = [...this.props.classes];
      if (this.props.disabled) {
        classList.push('usa-button-disabled');
      } else {
        classList.push('usa-button');
        classList.push(styleClass);
      }
      classes = this.styler(...classList);
    }

    if (this.props.type === 'link') {
      const classList = [...this.props.classes];

      classList.push('action-link');
      if (this.props.style === 'cautious') {
        classList.push('action-cautious');
      }

      classes = this.styler(...classList);

      content = (
        <a href="#"
          className={ classes }
          title={ this.props.label }
          onClick={ (ev) => this.props.clickHandler(ev) }
          disabled={ this.props.disabled }
        >
          { this.props.children }
        </a>
      );
    } else {
      content = (
        <button
          className={ classes }
          aria-label={ this.props.label }
          onClick={ (ev) => this.props.clickHandler(ev) }
          disabled={this.props.disabled}
          type={this.props.type}
        >
          { this.props.children }
        </button>
      );
    }

    return content;
  }
}

Action.propTypes = propTypes;
Action.defaultProps = defaultProps;
