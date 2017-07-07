import PropTypes from 'prop-types';
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

const propTypes = {
  children: PropTypes.node,
  title: PropTypes.node.isRequired
};

export default class PageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  get actions() {
    if (!this.props.children) {
      return null;
    }

    return <div className={ this.styler('page-header-actions') }>{ this.props.children }</div>;
  }

  render() {
    return (
      <div className={ this.styler('page-header') }>
        <h1 className={ this.styler('page-header-title', 'test-page-header-title') }>
          { this.props.title }
        </h1>
        { this.actions }
      </div>
    );
  }
}

PageHeader.propTypes = propTypes;
