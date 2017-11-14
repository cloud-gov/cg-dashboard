import React from "react";

import AppQuicklook from "./app_quicklook.jsx";
import ComplexList from "./complex_list.jsx";
import EntityEmpty from "./entity_empty.jsx";
import EntityIcon from "./entity_icon.jsx";
import InfoAppCreate from "./info_app_create.jsx";
import Loading from "./loading.jsx";
import OrgStore from "../stores/org_store.js";
import SpaceStore from "../stores/space_store.js";
import UserStore from "../stores/user_store";

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;
  const currentUser = UserStore.currentUser;

  const space = SpaceStore.get(currentSpaceGuid);
  const apps = space && space.apps ? space.apps : [];

  return {
    currentOrg: OrgStore.get(currentOrgGuid),
    currentSpace: space,
    currentUser,
    apps: apps.sort((a, b) => a.name.localeCompare(b.name)),
    currentOrgGuid,
    currentSpaceGuid,
    currentSpaceName: SpaceStore.currentSpaceName,
    loading: SpaceStore.loading,
    empty: !SpaceStore.loading && !apps.length
  };
}

export default class AppList extends React.Component {
  constructor(props) {
    super(props);

    this.state = stateSetter();
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillReceiveProps() {
    this.setState(stateSetter());
  }

  componentWillUnmount() {
    SpaceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter(this.props));
  }

  render() {
    const loading = <Loading text="Loading apps" />;
    let content = <div>{loading}</div>;
    const title = (
      <span>
        <span>Apps in</span> <EntityIcon entity="space" iconSize="medium" />
        <span> {this.state.currentSpaceName}</span>
      </span>
    );

    if (this.state.empty) {
      content = (
        <EntityEmpty callout="You have no apps in this space">
          <InfoAppCreate
            space={this.state.currentSpace}
            org={this.state.currentOrg}
            user={this.state.currentUser}
          />
        </EntityEmpty>
      );
    } else if (!this.state.loading && this.state.apps.length > 0) {
      content = (
        <ComplexList titleElement={title}>
          {this.state.apps.map(app => (
            <AppQuicklook
              key={app.guid}
              app={app}
              orgGuid={this.state.currentOrgGuid}
              spaceGuid={this.state.currentSpaceGuid}
              spaceName={this.state.currentSpaceName}
              extraInfo={["state", "memory", "diskQuota"]}
            />
          ))}
        </ComplexList>
      );
    }

    return content;
  }
}

AppList.propTypes = {};

AppList.defaultProps = {};
