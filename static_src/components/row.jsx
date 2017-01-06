
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

const ALIGNS = [
  'start',
  'middle',
  'end'
];

const TYPES = [
  'panel-row'
];

const TREES = [
  'level-one',
  'level-two'
];

const propTypes = {
  children: React.PropTypes.any,
  type: React.PropTypes.oneOf(TYPES),
  align: React.PropTypes.oneOf(ALIGNS),
  gutters: React.PropTypes.bool,
  boxed: React.PropTypes.bool,
  tree: React.PropTypes.oneOf(TREES)
};

const defaultProps = {
  tree: null,
  type: null,
  align: 'middle',
  boxed: null,
  gutters: false
};

export default class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const props = this.props;
    const treeClass = props.tree && `tree-${props.tree}`;
    const typeClass = props.type;
    const alignClass = props.align !== 'middle' && `row-${props.align}`;
    const gutterClass = props.gutters && 'row-gutters';
    const boxedClass = props.boxed && 'row-boxed';

    return (
      <div className={ this.styler(
          'row',
          boxedClass,
          treeClass,
          typeClass,
          alignClass,
          gutterClass
        )}
      >
        { this.props.children }
      </div>
    );
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;
