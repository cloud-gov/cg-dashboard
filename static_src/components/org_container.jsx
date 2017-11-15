import React from "react";

import { config } from "skin";
import AppCountStatus from "./app_count_status.jsx";
import Breadcrumbs from "./breadcrumbs";
import EntityIcon from "./entity_icon.jsx";
import EntityEmpty from "./entity_empty.jsx";
import Loading from "./loading.jsx";
import OrgStore from "../stores/org_store.js";
import PageHeader from "./page_header.jsx";
import Panel from "./panel.jsx";
import ServiceCountStatus from "./service_count_status.jsx";
import SpaceCountStatus from "./space_count_status.jsx";
import SpaceStore from "../stores/space_store.js";
import SpaceQuicklook from "./space_quicklook.jsx";
import Users from "./users.jsx";
import UserStore from "../stores/user_store.js";

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;
  const currentUser = UserStore.currentUser;
  const currentUserGuid = currentUser && currentUser.guid;
  const currentUserCanViewSpace =
    UserStore.hasRole(currentUserGuid, currentOrgGuid, "org_manager") ||
    UserStore.hasRole(
      currentUserGuid,
      currentSpaceGuid,
      SpaceStore.viewPermissionRoles()
    );

  const org = OrgStore.get(currentOrgGuid);
  const spaces = SpaceStore.getAll()
    .filter(space => space.organization_guid === currentOrgGuid)
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    currentOrgGuid,
    currentUser,
    currentUserCanViewSpace,
    empty: !OrgStore.loading && !SpaceStore.loading && !org,
    loading: OrgStore.loading || SpaceStore.loading || UserStore.loading,
    org: org || {},
    spaces: spaces || []
  };
}

export default class OrgContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateSetter();
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this.handleChange);
    SpaceStore.addChangeListener(this.handleChange);
    UserStore.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this.handleChange);
    SpaceStore.removeChangeListener(this.handleChange);
    UserStore.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState(stateSetter());
  }

  get emptyState() {
    let content;
    let callout;

    if (this.state.currentUserCanViewSpace) {
      const spaceLink = config.docs.concepts_spaces ? (
        <a href={config.docs.concepts_spaces}>Spaces</a>
      ) : (
        <span>Spaces</span>
      );
      const contactLink = config.docs.contact ? (
        <a href={config.docs.contact}>contact us</a>
      ) : (
        <span>contact us</span>
      );

      callout = "You have no spaces in this organization";
      content = (
        <p>
          {spaceLink} are environments for development, deployment, and
          maintenance of apps and services. If you think you have spaces you
          don’t see here, {contactLink}.
        </p>
      );
    } else {
      callout =
        "You don’t have permission to see the spaces in this organization.";
      content = (
        <p>
          Organization auditors and billing managers can’t view spaces. Ask your
          organization’s administrator to give you these permissions..
        </p>
      );
    }

    return <EntityEmpty callout={callout}>{content}</EntityEmpty>;
  }

  allServices() {
    return this.state.spaces.reduce((all, space) => {
      if (space.services && space.services.length) {
        return all.concat(space.services);
      }
      return all;
    }, []);
  }

  allApps() {
    return this.state.spaces.reduce((all, space) => {
      if (space.apps && space.apps.length) {
        return all.concat(space.apps);
      }
      return all;
    }, []);
  }

  render() {
    const { org } = this.state;
    const state = this.state;
    const loading = <Loading text="Loading organization" />;
    let content = <div>{loading}</div>;
    const title = (
      <span>
        <EntityIcon entity="org" iconSize="large" /> {org.name}
      </span>
    );
    const spaces = !state.spaces.length
      ? this.emptyState
      : state.spaces.map(space => (
          <SpaceQuicklook
            key={space.guid}
            space={space}
            orgGuid={state.currentOrgGuid}
            user={state.currentUser}
            showAppDetail
          />
        ));

    if (state.empty) {
      content = <h4 className="test-none_message">No organizations</h4>;
    } else if (!state.loading && org) {
      const allApps = this.allApps();
      const allServices = this.allServices();

      // TODO repeated pattern space_container, overview
      content = (
        <div className="grid">
          <div className="grid">
            <div className="grid-width-12">
              <Breadcrumbs org={org} />
              <PageHeader title={title} />
            </div>
          </div>
          <Panel title="">
            <div className="grid panel-overview-header">
              <div className="grid-width-6">
                <h1 className="panel-title">Organization overview</h1>
              </div>
              <div className="grid-width-6">
                <div className="count_status_container">
                  <SpaceCountStatus spaces={state.spaces} />
                  <AppCountStatus
                    apps={allApps}
                    appCount={allApps && allApps.length}
                  />
                  <ServiceCountStatus
                    services={allServices}
                    serviceCount={allServices && allServices.length}
                  />
                </div>
              </div>
            </div>
            {spaces}
          </Panel>

          <Panel title="Organization users">
            <Users />
          </Panel>
        </div>
      );
    }

    return content;
  }
}
