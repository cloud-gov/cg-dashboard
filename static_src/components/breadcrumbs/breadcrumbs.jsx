import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../../util/create_styler';


export default class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <div className={ this.styler('breadcrumbs') }>
        { this.props.children }
      </div>
    );
  }
}

Breadcrumbs.propTypes = {
  children: React.PropTypes.node.isRequired
};
