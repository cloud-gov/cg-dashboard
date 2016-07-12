
import classNames from 'classnames';
import React from 'react';

import cgBaseStyles from 'cloudgov-style/css/base.css';
import cgSidenavStyles from 'cloudgov-style/css/components/sidenav.css';

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
    this.state = {
      currentOrg: OrgStore.get(this.props.initialCurrentOrgGuid),
      currentSpace: SpaceStore.get(this.props.initialSpaceGuid),
      orgs: OrgStore.getAll() || []
    };
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
    orgActions.changeCurrentOrg(orgGuid);
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
    const mainList = classNames(
      cgBaseStyles['usa-sidenav-list'],
      cgSidenavStyles['sidenav-list'], cgSidenavStyles['sidenav-level-one']
    );
    const secondList = classNames(
      cgBaseStyles['usa-sidenav-list'],
      cgSidenavStyles['sidenav-list'],
      cgSidenavStyles['sidenav-level-two']
    );
    const thirdList = classNames(
      cgSidenavStyles['sidenav-list'],
      cgBaseStyles['usa-sidenav-sub_list'],
      cgSidenavStyles['sidenav-level-three']
    );
    const downArrow = classNames(
      cgSidenavStyles['menu-arrow'],
      cgSidenavStyles['sidenav-arrow'],
      cgSidenavStyles['sidenav-arrow-down']
    );
    const rightArrow = classNames(
      cgSidenavStyles['menu-arrow'],
      cgSidenavStyles['sidenav-arrow'],
      cgSidenavStyles['sidenav-arrow-right']
    );
    const subMenu = classNames('sub-menu');
    const header = classNames(
      cgSidenavStyles['sidenav-header']
    );

    if (this.state.orgs) {
      const openOrg = this.state.orgs.find((org) => {
        return org.space_menu_open;
      });
      console.log('render open', openOrg);
      if (openOrg) {
        console.log('render spaces', openOrg.spaces);
      }
    }

    return (
      <div className={ classNames('test-nav-primary') }>
        <ul className={ mainList }>
          <li key="overview" className={cgSidenavStyles['sidenav-entity']}>
            <a href="/#" onClick={this._handleOverviewClick}>Overview</a>
          </li>
          <li key="organizations" className={classNames(
              cgSidenavStyles['sidenav-header'])}>
            <span className={cgSidenavStyles['sidenav-header-text']}>
              Organizations</span>
          </li>
        { this.state.orgs.map((org) => {
          let toggleSpaceHandler = this._toggleSpacesMenu.bind(this, org.guid);
          let arrowClasses = (org.space_menu_open) ? downArrow : rightArrow;
          let activeOrgClasses = (org.space_menu_open) ?
            cgSidenavStyles['sidenav-active'] : '';
          let subList = <div></div>;

          if (org.space_menu_open) {
            subList = (
              <ul className={ secondList }>
                <li className={ header }>
                  <a href={ this.orgHref(org) }>
                    <span className={cgSidenavStyles['sidenav-header-text']}>
                      Spaces</span>
                  </a>
                  <ul className={ thirdList }>
                    { org.spaces.map((space) => {
                      let activeSpaceClasses = (this.isCurrentSpace(space.guid)) ?
                          cgSidenavStyles['sidenav-active'] : '';
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
                <li className={cgSidenavStyles.marketplace}>
                  <a href={ this.marketplaceHref(org) }>Marketplace</a>
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
  subLinks: React.PropTypes.array,
  initialCurrentOrgGuid: React.PropTypes.string,
  initialSpaceGuid: React.PropTypes.string
};
Nav.defaultProps = {
  initialCurrentOrgGuid: '0',
  initialSpaceGuid: '0'
};
