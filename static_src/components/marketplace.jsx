/**
 * Renders the marketplace page
 */

import React from 'react';

import ServiceList from './service_list.jsx';
import serviceActions from '../actions/service_actions.js';
import ServiceStore from '../stores/service_store.js';

function stateSetter() {
  return {
    services: ServiceStore.getAll()
  }
}

export default class Marketplace extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentOrgGuid: props.initialOrgGuid,
      services: []
    };
  }

  componentDidMount() {
    ServiceStore.addChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState(stateSetter());
  }

  render() {
    return (
      <div>
      <ServiceList initialServices={ this.state.services } />
      </div>
    );
  }
}

Marketplace.propTypes = {
  initialOrgGuid: React.PropTypes.string.isRequired,
}
