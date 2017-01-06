
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

const propTypes = {
  children: React.PropTypes.any,
  gutters: React.PropTypes.bool,
  borders: React.PropTypes.bool,
  flex: React.PropTypes.number
};

const defaultProps = {
  styleClass: 'clean',
  gutters: false,
  borders: false,
  flex: 0
};

export default class Col extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const props = this.props;
    const mainClass = props.styleClass !== 'boxed' && 'col';
    const flexClass = `col-flex-${this.props.flex}`;
    const gutterClass = props.gutters && 'col-gutters';
    const borderClass = props.borders && 'col-bordered';

    return (
      <div className={ this.styler(mainClass, flexClass, gutterClass, borderClass) }>
        { this.props.children }
      </div>
    );
  }
}

Col.propTypes = propTypes;
Col.defaultProps = defaultProps;
