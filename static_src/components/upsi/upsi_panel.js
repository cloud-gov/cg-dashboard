import React, { Component } from 'react';

import { appPropType } from '../../stores/app_store';
import { upsisRequestPropType } from '../../stores/upsi_store';
import Loading from '../loading.jsx';
import ErrorMessage from '../error_message.jsx';
import Panel from '../panel.jsx';
import ComplexList from '../complex_list.jsx';
import ElasticLine from '../elastic_line.jsx';
import ElasticLineItem from '../elastic_line_item.jsx';

const propTypes = {
  app: appPropType.isRequired,
  upsisRequest: upsisRequestPropType.isRequired
};

export default class UPSIPanel extends Component {
  renderBound() {
    const { app, upsisRequest } = this.props;
    const { items: upsis } = upsisRequest;

    const serviceGuids = new Set(app.services.map(s => s.guid));
    const bound = upsis.filter(({ guid }) => serviceGuids.has(guid));

    return (
      <ComplexList
        title="Bound to app"
        emptyMessage={!bound.length ? <div>No instances</div> : null}
      >
        {bound.map(({ guid, name }) => (
          <ElasticLine key={guid}>
            <ElasticLineItem title={`ID: ${guid}`}>{name}</ElasticLineItem>
            <ElasticLineItem align="end" />
          </ElasticLine>
        ))}
      </ComplexList>
    );
  }

  renderOthersInSpace() {
    const { app, upsisRequest } = this.props;
    const { items: upsis } = upsisRequest;

    const serviceGuids = new Set(app.services.map(s => s.guid));
    const other = upsis.filter(({ guid }) => !serviceGuids.has(guid));

    return (
      <ComplexList
        title="Other instances in this space"
        emptyMessage={!other.length ? <div>No instances</div> : null}
      >
        {other.map(({ guid, name }) => (
          <ElasticLine key={guid}>
            <ElasticLineItem title={`ID: ${guid}`}>{name}</ElasticLineItem>
            <ElasticLineItem align="end" />
          </ElasticLine>
        ))}
      </ComplexList>
    );
  }

  renderContents() {
    const { upsisRequest } = this.props;
    const { isFetching, error } = upsisRequest;

    if (isFetching) {
      return <Loading style="inline" />;
    }

    if (error) {
      return (
        <ErrorMessage
          error={{ message: 'Could not load user-provided service instances.' }}
        />
      );
    }

    return (
      <div>
        {this.renderBound()}
        {this.renderOthersInSpace()}
      </div>
    );
  }

  render() {
    return (
      <Panel title="User-provided service instances">
        {this.renderContents()}
      </Panel>
    );
  }
}

UPSIPanel.propTypes = propTypes;
