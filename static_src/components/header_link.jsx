import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';

export default class HeaderLink extends React.Component {

  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <li className={ this.styler('nav-link') }>
        <a href={this.props.url}>{this.props.text}</a>
      </li>
    );
  }
}

HeaderLink.propTypes = {
  url: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired
};
