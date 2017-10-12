
import PropTypes from 'prop-types';
import React from 'react';

const ALIGN_STYLES = [
  'start',
  'end'
];

const propTypes = {
  align: PropTypes.oneOf(ALIGN_STYLES),
  children: PropTypes.any
};

const defaultProps = {
  align: ALIGN_STYLES[0]
};

export default class ElasticLineItem extends React.Component {
  render() {
    return (
      <div className={ `elastic_line-item elastic_line-item-${this.props.align}` }>
        { this.props.children }
      </div>
    );
  }
}

ElasticLineItem.propTypes = propTypes;
ElasticLineItem.defaultProps = defaultProps;
