
import React from 'react';

import orgActions from '../actions/org_actions.js';
import OrgStore from '../stores/org_store.js';

function getState() {
  return {
    currentOrg: '',
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
    return (
      <ul className="nav nav-sidebar">
        <li></li>
      </ul>
    );
  }
};
