
import classNames from 'classnames';
import React from 'react';

import styles from '../css/components/navbar.css';
import cgStyles from 'cloudgov-style/components/sidenav.css';

import Dropdown from '../components/dropdown.jsx';
import orgActions from '../actions/org_actions.js';
import OrgStore from '../stores/org_store.js';

export class NavLink extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <li className={ styles['sub-menu'] }>
        <a href={ this.props.href }>{ this.props.name }</a>
      </li>
    );
  }
}
NavLink.propTypes = {
  href: React.PropTypes.string.isRequired,
  name: React.PropTypes.string,
  onClick: React.PropTypes.func
};
NavLink.defaultProps = {
  name: '',
  onClick: function() { }
};

export class NavList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    var classes = classNames(cgStyles.sidenav, cgStyles['sidenav-list'],
    cgStyles['sidenav-level-one']);

    return (
      <ul className={ classes }>
        { this.props.children }
      </ul>
    );
  }
}

function stateSetter() {
  var currentOrgGuid = OrgStore.currentOrgGuid,
      currentOrg = OrgStore.get(currentOrgGuid);

  return {
    currentOrg: currentOrg,
    orgs: OrgStore.getAll()
  };
}

export class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    let currentOrg = OrgStore.get(this.props.initialCurrentOrgGuid);
    this.state = {
      currentOrg: currentOrg,
      orgs: []
    }
    this._handleOrgClick = this._handleOrgClick.bind(this);
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

  orgHref(org) {
    return  '#/org/' + org.guid;
  }

  orgSubHref(org, linkHref) {
    return this.orgHref(org) + linkHref;
  }

  render() {
    var classes = classNames('test-nav-primary');
    return (
      <div className={ classes }>
      { this.state.orgs.map((org) => {
        return (
          <NavList key={ org.guid }>
            <NavLink href={ this.orgHref(org) } name={ org.name } />
            <NavList>
              { this.props.subLinks.map((sub) => {
                return (
                  <NavLink
                    href={ this.orgSubHref(org, sub.link) }
                    name={ sub.name } />
                )
              })}
            </NavList>
          </NavList>
        );
      })}
      </div>
    );
  }
}
Nav.propTypes = {
  subLinks: React.PropTypes.array,
  initialCurrentOrgGuid: React.PropTypes.string
}
Nav.defaultProps = {
  subLinks: [
    { link: '', name: 'Spaces' },
    { link: '/marketplace', name: 'Marketplace' }
  ],
  initialCurrentOrgGuid: '0'
};
