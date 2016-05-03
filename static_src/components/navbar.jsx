
import classNames from 'classnames';
import React from 'react';

import cgBaseStyles from 'cloudgov-style/base.css';
import cgSidenavStyles from 'cloudgov-style/components/sidenav.css';

import orgActions from '../actions/org_actions.js';
import OrgStore from '../stores/org_store.js';

function stateSetter() {
  const currentOrgGuid = OrgStore.currentOrgGuid;

  return {
    currentOrg: OrgStore.get(currentOrgGuid),
    orgs: OrgStore.getAll()
  };
}

export class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentOrg: OrgStore.get(this.props.initialCurrentOrgGuid),
      orgs: []
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OrgStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  _handleOrgClick(orgGuid) {
    orgActions.changeCurrentOrg(orgGuid);
  }

  _toggleSpacesMenu(orgGuid) {
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

  render() {
    const mainList = classNames(
      cgBaseStyles['usa-sidenav-list'],
      cgSidenavStyles['sidenav-list'], cgSidenavStyles['sidenav-level-one']
    );
    const secondList = classNames(
      cgBaseStyles['usa-sidenav-sub_list'],
      cgSidenavStyles['sidenav-list'],
      cgSidenavStyles['sidenav-level-two']
    );
    const thirdList = classNames(
      cgSidenavStyles['sidenav-list'],
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

    return (
      <div className={ classNames('test-nav-primary') }>
        <ul className={ mainList }>
        { this.state.orgs.map((org) => {
          let toggleSpaceHandler = this._toggleSpacesMenu.bind(this, org.guid);
          let arrowClasses = (org.space_menu_open) ? downArrow : rightArrow;
          let spacesDisplayStyle = { display: (org.space_menu_open) ? 'block' : 'none' };
          return (
            <li key={ org.guid } className={ subMenu }>
              <a href={ this.orgHref(org) }>
                <span>{ org.name }</span>
              </a>
              <ul className={ secondList }>
                <li className={ subMenu }>
                  <a onClick={ toggleSpaceHandler }>
                    <span>Spaces</span>
                    <span className={ arrowClasses }>
                    </span>
                  </a>
                  <ul className={ thirdList } style={ spacesDisplayStyle }>
                    { org.spaces.map((space) => {
                      return (
                        <li key={ space.guid }>
                          <a href={ this.spaceHref(org, space.guid) }>
                            <span>{ space.name }</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li className={ subMenu }>
                  <a href={ this.marketplaceHref(org) }>Marketplace</a>
                </li>
              </ul>
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
  initialCurrentOrgGuid: React.PropTypes.string
}
Nav.defaultProps = {
  initialCurrentOrgGuid: '0'
};
