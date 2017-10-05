
import PropTypes from 'prop-types';
import React from 'react';

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
  constructor(props) {
    super(props);
  }

  render() {
    const expandedClass = this.props.isExpanded && 'expandable_box-is_expanded';
    return (
      <div className={[expandable_box, expandedClass, ...this.props.classes].join(' ')}>
        <div className="expandable_box-click" onClick={ this.props.clickHandler }>
          { this.props.clickableContent }
        </div>
        { this.props.children }
      </div>
    );
  }
}

ExpandableBox.propTypes = propTypes;
ExpandableBox.defaultProps = defaultProps;
