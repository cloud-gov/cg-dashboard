import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

const STYLES = [
  "bordered",
  "boxed",
  "clean", // TODO this should be reconciled with panel-row and panel-row-bordered
  "none"
];

const propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any,
  styleClass: PropTypes.oneOf(STYLES)
};

const defaultProps = {};

export default class PanelRow extends React.Component {
  render() {
    const { styleClass, id, children, className } = this.props;
    const classes = classNames(className, {
      [`panel-row-${styleClass}`]: styleClass,
      "panel-row": styleClass !== "boxed"
    });

    return (
      <div id={id} className={classes}>
        {children}
      </div>
    );
  }
}

PanelRow.propTypes = propTypes;
PanelRow.defaultProps = defaultProps;
