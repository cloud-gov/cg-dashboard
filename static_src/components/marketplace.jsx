/**
 * Renders the marketplace page
 */

import React from 'react';

import ServiceList from './service_list.jsx';
import serviceActions from '../actions/service_actions.js';
import ServiceStore from '../stores/service_store.js';

function stateSetter() {
  var services = ServiceStore.getAll();

  return {
    services: services
  };
}

export default class Marketplace extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentOrgGuid: props.initialOrgGuid,
      services: []
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    ServiceStore.addChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="text-center">Marketplace</h3>
        </div>
        <ServiceList initialServices={ this.state.services } />
      </div>
    );
  }
}

Marketplace.propTypes = {
  initialOrgGuid: React.PropTypes.string.isRequired,
}
