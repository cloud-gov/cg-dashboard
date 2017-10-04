import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ComplexList from './complex_list.jsx';
import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';

export default class UPSIPanel extends Component {
  renderBoundItems() {
    const { app, upsis } = this.props;

    const serviceGuids = new Set(app.services.map(s => s.guid));
    const bound = upsis.filter(({ guid }) => serviceGuids.has(guid));

    return bound.map(({ guid, name }) => (
      <ElasticLine key={guid}>
        <ElasticLineItem>{name}</ElasticLineItem>
        <ElasticLineItem align="end" />
      </ElasticLine>
    ));
  }

  renderUnboundItems() {
    const { app, upsis } = this.props;

    const serviceGuids = new Set(app.services.map(s => s.guid));
    const unbound = upsis.filter(({ guid }) => !serviceGuids.has(guid));

    return unbound.map(({ guid, name }) => (
      <ElasticLine key={guid}>
        <ElasticLineItem>{name}</ElasticLineItem>
        <ElasticLineItem align="end" />
      </ElasticLine>
    ));
  }

  render() {
    return (
      <div>
        <ComplexList title="Bound to app">
          {this.renderBoundItems()}
        </ComplexList>
        <ComplexList title="Unbound in space">
          {this.renderUnboundItems()}
        </ComplexList>
      </div>
    );
  }
}

UPSIPanel.propTypes = {
  app: PropTypes.shape({
    guid: PropTypes.string.isRequired
  }).isRequired,
  upsis: PropTypes.arrayOf(
    PropTypes.shape({
      guid: PropTypes.string.isRequired
    }).isRequired
  )
};

UPSIPanel.defaultProps = {
  upsis: []
};
