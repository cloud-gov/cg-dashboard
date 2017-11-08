import PropTypes from "prop-types";
import React from "react";
import ComplexList from "./complex_list.jsx";
import ServiceInstance from "./service_instance.jsx";

const propTypes = {
  currentAppGuid: PropTypes.string.isRequired,
  serviceInstances: PropTypes.array,
  bound: PropTypes.bool,
  empty: PropTypes.bool,
  titleElement: PropTypes.element
};

const defaultProps = {
  serviceInstances: [],
  bound: false,
  empty: false
};

export default class ServiceInstanceList extends React.Component {
  render() {
    // TODO, when react implements returning unwraped arrays, move ComplexList
    // to container of this.
    let content = <div />;

    if (this.props.empty) {
      content = (
        <ComplexList
          titleElement={this.props.titleElement}
          emptyMessage={<h4>No services</h4>}
        />
      );
    } else {
      content = (
        <ComplexList titleElement={this.props.titleElement}>
          {this.props.serviceInstances.map(serviceInstance => (
            <ServiceInstance
              key={serviceInstance.guid}
              currentAppGuid={this.props.currentAppGuid}
              serviceInstance={serviceInstance}
              bound={this.props.bound}
            />
          ))}
        </ComplexList>
      );
    }

    return content;
  }
}

ServiceInstanceList.propTypes = propTypes;
ServiceInstanceList.defaultProps = defaultProps;
