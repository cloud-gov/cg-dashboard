
import PropTypes from 'prop-types';
import React from 'react';

import style from 'cloudgov-style/css/cloudgov-style.css';

import createStyler from '../util/create_styler';

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
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const expandedClass = this.props.isExpanded && 'expandable_box-is_expanded';
    return (
      <div className={ this.styler('expandable_box', expandedClass, ...this.props.classes) }>
        <div className={ this.styler('expandable_box-click') } onClick={ this.props.clickHandler }>
          { this.props.clickableContent }
        </div>
        { this.props.children }
      </div>
    );
  }
}

ExpandableBox.propTypes = propTypes;
ExpandableBox.defaultProps = defaultProps;
