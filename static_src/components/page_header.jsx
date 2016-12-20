import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';
import PageMetadataStore from '../stores/page_metadata_store';

function stateSetter(props) {
  const pageMetadata = PageMetadataStore.current;
  const title = props.title || pageMetadata.title;

  return {
    title
  };
}

export default class PageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
    this.state = stateSetter(props);
  }

  componentDidMount() {
    PageMetadataStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    PageMetadataStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter(this.props));
  }

  render() {
    const title = this.state.title;
    const actions = this.props.children;

    return (
      <div className={ this.styler('page-header') }>
        <h1 className={ this.styler('page-header-title') }>{ title }</h1>
        <span className={ this.styler('page-header-title') }>{ actions }</span>
      </div>
    );
  }
}

PageHeader.propTypes = {
  children: React.PropTypes.node,
  title: React.PropTypes.node
};
