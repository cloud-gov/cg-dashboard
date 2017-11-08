import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

const propTypes = {
  children: PropTypes.any,
  classes: PropTypes.array,
  clickHandler: PropTypes.func,
  clickableContent: PropTypes.any,
  isExpanded: PropTypes.bool
};
const defaultProps = {
  children: null,
  classes: [],
  clickHandler: () => {},
  clickableContent: null,
  isExpanded: false
};

export default class ExpandableBox extends React.Component {
  render() {
    const classes = classNames("expandable_box", {
      "expandable_box-is_expanded": this.props.isExpanded,
      [`${this.props.classes.join("")}`]: this.props.classes.length
    });

    return (
      <div className={classes}>
        <div className="expandable_box-click" onClick={this.props.clickHandler}>
          {this.props.clickableContent}
        </div>
        {this.props.children}
      </div>
    );
  }
}

ExpandableBox.propTypes = propTypes;
ExpandableBox.defaultProps = defaultProps;
