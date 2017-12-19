import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";
import iconImg from "cloudgov-style/img/cloudgov-sprite.svg";

const ICON_TYPES = ["fill", "stroke"];

const ICON_SIZE = ["small", "medium", "large"];

const STYLE_TYPES = ["alt", "ok", "inactive", "error", "default"];

const propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  styleType: PropTypes.oneOf(STYLE_TYPES),
  iconType: PropTypes.oneOf(ICON_TYPES),
  iconSize: PropTypes.oneOf(ICON_SIZE),
  bordered: PropTypes.bool
};

const defaultProps = {
  styleType: "default",
  iconType: "stroke",
  bordered: false
};

export default class Icon extends React.Component {
  getImagePath(iconName) {
    const fill = this.props.iconType === "fill" ? "fill-" : "";
    return `assets/${iconImg}#i-${fill}${iconName}`;
  }

  render() {
    const classes = classNames(`icon-${this.props.styleType}`, {
      [`icon-${this.props.iconSize}`]: this.props.iconSize,
      "icon-bordered": this.props.bordered,
      icon: !this.props.iconType,
      "icon-fill": this.props.iconType
    });

    return (
      <span>
        <svg className={classes}>
          <use xlinkHref={this.getImagePath(this.props.name)} />
        </svg>{" "}
        {this.props.children}
      </span>
    );
  }
}

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;
