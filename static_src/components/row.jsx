
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

const STYLES = [
  'bordered',
  'boxed',
  'clean', // TODO this should be reconciled with panel-row and panel-row-bordered
  'none'
];

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
  styleClass: React.PropTypes.oneOf(STYLES),
  align: React.PropTypes.oneOf(ALIGNS),
  gutters: React.PropTypes.bool,
  borders: React.PropTypes.bool,
  tree: React.PropTypes.oneOf(TREES)
};

const defaultProps = {
  styleClass: null,
  tree: null,
  type: null,
  align: 'middle',
  gutters: false,
  borders: false
};

export default class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const props = this.props;
    const styleClass = props.styleClass && `panel-row-${props.styleClass}`;
    const treeClass = props.tree && `tree-${props.tree}`;
    const typeClass = props.type;
    const mainClass = props.styleClass !== 'boxed' && 'row';
    const alignClass = props.align !== 'middle' && `row-${props.align}`;
    const gutterClass = props.gutters && 'row-gutters';
    const borderClass = props.borders && 'row-bordered';

    return (
      <div className={ this.styler(mainClass, treeClass, typeClass, alignClass, gutterClass, borderClass, styleClass) }>
        { this.props.children }
      </div>
    );
  }
}

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;
