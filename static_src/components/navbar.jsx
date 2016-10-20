
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import createStyler from '../util/create_styler';
import spaceActions from '../actions/space_actions.js';
import orgActions from '../actions/org_actions.js';
import OrgStore from '../stores/org_store.js';
import SpaceStore from '../stores/space_store.js';

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;
  const currentSpaceGuid = SpaceStore.currentSpaceGuid;

  return {
    currentOrg: OrgStore.get(currentOrgGuid),
    currentSpace: SpaceStore.get(currentSpaceGuid),
    orgs: OrgStore.getAll()
  };
}

export class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter();
    this.styler = createStyler(style);
    this._onChange = this._onChange.bind(this);
    this._handleOverviewClick = this._handleOverviewClick.bind(this);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
    SpaceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  _handleOverviewClick() {
    orgActions.toggleSpaceMenu('0');
    spaceActions.changeCurrentSpace('0');
  }

  _handleOrgClick(orgGuid) {
    orgActions.toggleSpaceMenu(orgGuid);
  }

  _toggleSpacesMenu(orgGuid, ev) {
    ev.preventDefault();
    orgActions.toggleSpaceMenu(orgGuid);
  }

  // currently displays the space listing
  orgHref(org) {
    return `/#/org/${org.guid}`;
  }

  orgSubHref(org, linkHref) {
    return this.orgHref(org) + linkHref;
  }

  marketplaceHref(org) {
    return this.orgSubHref(org, '/marketplace');
  }

  spaceHref(org, spaceGuid) {
    return this.orgSubHref(org, `/spaces/${spaceGuid}`);
  }

  isCurrentSpace(spaceGuid) {
    if (!this.state.currentSpace) return false;
    if (this.state.currentSpace.guid === spaceGuid) return true;
    return false;
  }

  render() {
    const mainList = this.styler('usa-sidenav-list', 'sidenav-list', 'sidenav-level-one');
    const secondList = this.styler('usa-sidenav-sub_list', 'sidenav-list', 'sidenav-level-two');
    const thirdList = this.styler('sidenav-list', 'sidenav-level-three');
    const downArrow = this.styler('menu-arrow', 'sidenav-arrow', 'sidenav-arrow-down');
    const rightArrow = this.styler('menu-arrow', 'sidenav-arrow', 'sidenav-arrow-right');
    const header = this.styler('sidenav-header');
    const faHome = this.styler('fa', 'fa-home');
    const sortedOrgs = this.state.orgs.sort((a, b) => a.name < b.name ? -1 : 1);

    return (
      <div className={ this.styler('test-nav-primary') }>
        <ul className={ mainList }>
          <li key="overview" className={ this.styler('sidenav-entity') }>
            <i className={ faHome }></i>
            <a href="/#" onClick={this._handleOverviewClick}>Overview</a>
          </li>
          <li key="organizations" className={ this.styler('sidenav-header') }>
            <span className={ this.styler('sidenav-header-text') }>
              Organizations</span>
          </li>
        { sortedOrgs.map((org) => {
          let toggleSpaceHandler = this._toggleSpacesMenu.bind(this, org.guid);
          let arrowClasses = (org.space_menu_open) ? downArrow : rightArrow;
          let activeOrgClasses = (org.space_menu_open) ? this.styler('sidenav-active') : '';
          let subList = <div></div>;
          const sortedSpaces = org.spaces.sort((a, b) => a.name < b.name ? -1 : 1);

          if (org.space_menu_open) {
            subList = (
              <ul className={ secondList }>
                <li>
                  <a href={ this.orgHref(org) }>{ org.name } overview</a>
                  <ul className={ thirdList }>
                    { sortedSpaces.map((space) => {
                      let activeSpaceClasses = (this.isCurrentSpace(space.guid)) ?
                          this.styler('sidenav-active-dashboard') : '';
                      return (
                        <li key={ space.guid } className={activeSpaceClasses}>
                          <a href={ this.spaceHref(org, space.guid) }>
                            <span>{ space.name }</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li className={ this.styler('marketplace') }>
                  <a href={ this.marketplaceHref(org) }>{ org.name } marketplace</a>
                </li>
              </ul>
            );
          }

          return (
            <li key={ org.guid } className={ activeOrgClasses }>
              <a href="#" onClick={ toggleSpaceHandler } >
                <span>{ org.name }</span>
                <span className={ arrowClasses }></span>
              </a>
              { subList }
            </li>
          );
        })}
        </ul>
      </div>
    );
  }
}
Nav.propTypes = {
  subLinks: React.PropTypes.array
};
Nav.defaultProps = {
  subLinks: []
};
