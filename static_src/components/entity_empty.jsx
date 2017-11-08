import PropTypes from "prop-types";
import React from "react";
import PanelDocumentation from "./panel_documentation.jsx";

const propTypes = {
  callout: PropTypes.node,
  children: PropTypes.any
};

const defaultProps = {
  children: null
};

export default class EntityEmpty extends React.Component {
  render() {
    const props = this.props;
    return (
      <PanelDocumentation>
        <div className="empty">
          <h4>{props.callout}</h4>
          {props.children}
        </div>
      </PanelDocumentation>
    );
  }
}

EntityEmpty.propTypes = propTypes;
EntityEmpty.defaultProps = defaultProps;
