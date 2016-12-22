import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';
import AppStore from '../stores/app_store';
import { pageKinds } from '../constants';
import PageMetadataStore from '../stores/page_metadata_store';


// Prefer title set by props or PageMetadataStore, then fallback to guessing by
// page type
function getTitle(props) {
  const pageMetadata = PageMetadataStore.current;
  let title = props.title || pageMetadata.title;
  if (title) {
    return title;
  }

  switch (pageMetadata.kind) {
    case pageKinds.APP_PAGE: {
      const app = AppStore.get(AppStore.currentAppGuid);
      if (app) {
        title = app.name;
      }
      break;
    }
    default:
      break;
  }

  return title;
}

function stateSetter(props) {
  const title = getTitle(props);

  return {
    title
  };
}

export default class PageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
    this.state = stateSetter(props);
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    PageMetadataStore.addChangeListener(this._onChange);
    AppStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    PageMetadataStore.removeChangeListener(this._onChange);
    AppStore.removeChangeListener(this._onChange);
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
