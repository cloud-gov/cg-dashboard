
import React from 'react';

import Dropdown from '../components/dropdown.jsx';
import orgActions from '../actions/org_actions.js';
import OrgStore from '../stores/org_store.js';

function getState() {
  return {
    currentOrg: OrgStore.currentOrg,
    orgs: OrgStore.getAll()
  };
}

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = getState();
  }

  componentDidMount() {
    OrgStore.addChangeListener(this._onChange);
    orgActions.fetchAll();
  }

  _onChange = () => {
    this.setState(getState());
  }

  render = () => {
    var orgName = this.state.currentOrg && this.state.currentOrg.name || '',
        orgEls = [];

    orgEls = this.state.orgs.map((org) => {
      return {
        element: <a href="#/org/{ org.guid }">{ org.name }</a>,
        key: org.guid
      }
    });

    return (
      <ul className="nav nav-sidebar">
        <li>
          <Dropdown title={ orgName } items={ orgEls } />
        </li>
      </ul>
    );
  }
};
