
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

const VALIGNS = [
  'top',
  'center',
  'bottom'
];

const propTypes = {
  children: React.PropTypes.any,
  valign: React.PropTypes.oneOf(VALIGNS),
  gutters: React.PropTypes.bool,
  boxed: React.PropTypes.bool
};

const defaultProps = {
  valign: 'center',
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
    const valignClass = props.valign !== 'center' &&
      `row-${props.valign}`;
    const gutterClass = props.gutters && 'row-gutters';
    const boxedClass = props.boxed && 'row-boxed';

    return (
      <div className={ this.styler(
          'row',
          boxedClass,
          valignClass,
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
