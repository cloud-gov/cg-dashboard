import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';
import AppStore from '../stores/app_store';
import OrgStore from '../stores/org_store';
import { pageKinds } from '../constants';
import PageMetadataStore from '../stores/page_metadata_store';
import SpaceStore from '../stores/space_store';


// Prefer title set by props or PageMetadataStore, then fallback to guessing by
// page kind
function getTitle(props) {
  const pageMetadata = PageMetadataStore.current;
  let title = props.title || pageMetadata.title;
  if (title) {
    return title;
  }

  // TODO this seems strange that the page header needs to know about specific
  // stores. Ideally the pages could update the title themselves, but it's
  // unclear on which action that would happen given how the data is loading
  // async on various pages.
  let entity;
  switch (pageMetadata.kind) {
    case pageKinds.APP_PAGE:
      entity = AppStore.get(AppStore.currentAppGuid);
      break;

    case pageKinds.ORG_PAGE:
      entity = OrgStore.get(OrgStore.currentOrgGuid);
      break;

    case pageKinds.SPACE_PAGE:
      entity = SpaceStore.get(SpaceStore.currentSpaceGuid);
      break;

    default:
      // The page should update the title itself
      break;
  }

  if (entity && entity.name) {
    title = entity.name;
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
    OrgStore.addChangeListener(this._onChange);
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    PageMetadataStore.removeChangeListener(this._onChange);
    AppStore.removeChangeListener(this._onChange);
    OrgStore.removeChangeListener(this._onChange);
    SpaceStore.removeChangeListener(this._onChange);
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
