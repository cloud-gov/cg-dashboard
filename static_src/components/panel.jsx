import PropTypes from "prop-types";
import React from "react";

const propTypes = {
  title: PropTypes.string
};

const defaultProps = {
  title: "Default title"
};

export default class Panel extends React.Component {
  render() {
    let panelHed = null;
    if (this.props.title != "") {
      panelHed = <h1 className="panel-title">{this.props.title}</h1>;
    }

    return (
      <div className="panel">
        {panelHed}
        <div className="panel-rows">{this.props.children}</div>
      </div>
    );
  }
}

Panel.propTypes = propTypes;
Panel.defaultProps = defaultProps;
