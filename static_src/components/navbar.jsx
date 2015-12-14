
import React from 'react';

import Dropdown from '../components/dropdown.jsx';
import orgActions from '../actions/org_actions.js';
import OrgStore from '../stores/org_store.js';

function getState() {
  var currentOrgGuid = OrgStore.currentOrgGuid,
      currentOrg = OrgStore.get(currentOrgGuid);
  return {
    currentOrg: currentOrg,
    orgs: OrgStore.getAll()
  };
}

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = getState();
    this._onChange = this._onChange.bind(this);
    this._buildNav = this._buildNav.bind(this);
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    orgActions.fetchAll();
  }

  _onChange() {
    this.setState(getState());
  }

  render() {
    var orgEls = [],
        navigation;

    orgEls = this.state.orgs.map((org) => {
      return {
        element: <a href={ '#/org/' + org.guid }>{ org.name }</a>,
        key: org.guid
      }
    });

    if (this.state.currentOrg) {
      navigation = this._buildNav(this.state.currentOrg);
    }

    return (
      <ul className="nav nav-sidebar">
        <li>
          <Dropdown title='Change Organization' classes={ ['test-nav-orgs'] }
            items={ orgEls } />
        </li>
        { navigation }
      </ul>
    );
  }

  _buildNav(org) {
    var navEls = [];

    navEls.push({
      key: 'spaces', 
      element: <a href={ '#/org/' + org.guid }>Spaces</a>
    });

    navEls.push({
      key: 'marketplace', 
      element: <a href={ '#/org/' + org.guid + '/marketplace' }>Marketplace</a>
    });

    navEls.push({
      key: 'manage_org', 
      element: <a href={ '#/org/' + org.guid + '/manage-org' }>Manage Org</a>
    });
    let navigation = (
      <li>
      <Dropdown title={ org.name.toUpperCase() || '' } 
        classes={ ['test-nav-org'] } items={ navEls } />
      </li>
    );

    return navigation;
  }

};
