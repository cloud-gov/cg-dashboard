import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';


export default class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  breadcrumb(crumb) {
    const [node, url] = crumb;
    const content = url ?
      <a className={ this.styler('breadcrumbs-item-link') } href={ url }>{ node }</a> :
      <span className={ this.styler('breadcrumbs-item-current') }>{ node }</span>;

    return (
      <div className={ this.styler('breadcrumbs-item') }>
        { content }
      </div>
    );
  }

  render() {
    const crumbs = (this.props.path || []).map(crumb => this.breadcrumb(crumb));
    return (
      <div className={ this.styler('breadcrumbs') }>
        { crumbs }
      </div>
    );
  }
}

Breadcrumbs.propTypes = {
  // Array of pairs [content, url]. Content can be React.PropTypes.node or string
  path: React.PropTypes.array
};
