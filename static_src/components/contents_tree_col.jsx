
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

const propTypes = {
  children: React.PropTypes.any
};

const defaultProps = {
  children: []
};

export default class ContentsTreeCol extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    return (
      <div className={ this.styler('contents-tree-column')}>
        { this.props.children }
      </div>
    );
  }
}

ContentsTreeCol.propTypes = propTypes;
ContentsTreeCol.defaultProps = defaultProps;
