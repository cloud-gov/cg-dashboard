import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../../util/create_styler';
import AppStore from '../../stores/app_store';
import OrgStore from '../../stores/org_store';
import SpaceStore from '../../stores/space_store';
import HomeBreadcrumbsItem from './home.jsx';
import OrgBreadcrumbsItem from './org.jsx';
import SpaceBreadcrumbsItem from './space.jsx';


function stateSetter() {
  const app = AppStore.get(AppStore.currentAppGuid);
  const space = SpaceStore.get(SpaceStore.currentSpaceGuid);
  const org = OrgStore.get(OrgStore.currentOrgGuid);

  return {
    app,
    org,
    space
  };
}

export default class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);
    this.styler = createStyler(style);
    this.state = stateSetter();
  }

  render() {
    let breadcrumbs = [];

    // Add the parent states
    if (this.state.org && this.state.org.name) {
      breadcrumbs.push(<HomeBreadcrumbsItem />);
    }

    if (this.state.space && this.state.space.name) {
      breadcrumbs.push(<OrgBreadcrumbsItem org={ this.state.org } />);
    }

    if (this.state.app && this.state.app.name) {
      breadcrumbs.push(<SpaceBreadcrumbsItem org={ this.state.org } space={ this.state.space } />);
    }

    return (
      <div className={ this.styler('breadcrumbs') }>
        { breadcrumbs }
      </div>
    );
  }
}
