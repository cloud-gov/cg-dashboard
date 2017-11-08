import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";
import ComplexListItem from "./complex_list_item.jsx";

const propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  className: PropTypes.string,
  title: PropTypes.string,
  titleElement: PropTypes.element,
  emptyMessage: PropTypes.element
};
const defaultProps = {
  children: [],
  title: null,
  titleElement: null,
  emptyMessage: null
};

export default class ComplexList extends React.Component {
  hasAnyTitle() {
    return !!(this.props.title || this.props.titleElement);
  }

  render() {
    const emptyMessage = this.props.emptyMessage && (
      <div className="complex_list-empty">{this.props.emptyMessage}</div>
    );
    let header;

    if (this.hasAnyTitle()) {
      let title;
      if (this.props.titleElement) {
        title = this.props.titleElement;
      } else {
        title = this.props.title;
      }
      header = (
        <header className="complex_list-header">
          <h4 className="complex_list-title">{title}</h4>
        </header>
      );
    }

    const classes = classNames("complex_list", {
      [this.props.className]: this.props.className
    });

    return (
      <div className={classes}>
        {header}
        {emptyMessage}
        {this.props.children.length > 0 &&
          this.props.children.map((child, i) => {
            if (child.type === ComplexList) {
              return child;
            }
            return <ComplexListItem key={i}>{child}</ComplexListItem>;
          })}
      </div>
    );
  }
}

ComplexList.propTypes = propTypes;
ComplexList.defaultProps = defaultProps;
