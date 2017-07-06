
import PropTypes from 'prop-types';
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const propTypes = {
  children: PropTypes.array
};
const defaultProps = {
  children: null
};

export default class ElasticLine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    return (
      <div className={ this.styler('elastic_line') }>
        { this.props.children }
      </div>
    );
  }
}

ElasticLine.propTypes = propTypes;
ElasticLine.defaultProps = defaultProps;
