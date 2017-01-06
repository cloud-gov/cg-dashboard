
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

const propTypes = {
  children: React.PropTypes.any,
  gutters: React.PropTypes.bool,
  flex: React.PropTypes.number
};

const defaultProps = {
  gutters: false,
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
    const flexClass = `col-flex-${this.props.flex}`;
    const gutterClass = props.gutters && 'col-gutters';

    return (
      <div className={ this.styler(
        'col',
        flexClass,
        gutterClass
      )}
      >
        { this.props.children }
      </div>
    );
  }
}

Col.propTypes = propTypes;
Col.defaultProps = defaultProps;
