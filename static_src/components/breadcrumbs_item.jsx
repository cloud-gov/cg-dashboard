
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  children: React.PropTypes.node.isRequired,
  url: React.PropTypes.string
};

export default class BreadcrumbsItem extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    const url = this.props.url;
    const content = url ?
      (
        <a className={ this.styler('breadcrumbs-item-link') } href={ url }>
          { this.props.children }
        </a>
      )
      : <span className={ this.styler('breadcrumbs-item-current') }>{ this.props.children }</span>;

    return (
      <li className={ this.styler('breadcrumbs-item') }>
        { content }
      </li>
    );
  }
}

BreadcrumbsItem.propTypes = propTypes;
