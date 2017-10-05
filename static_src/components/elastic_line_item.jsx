
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
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const alignClass = `elastic_line-item-${props.align}`;

    return (
      <div className={ `elastic_line-item ${alignClass}`}>
        { this.props.children }
      </div>
    );
  }
}

ElasticLineItem.propTypes = propTypes;
ElasticLineItem.defaultProps = defaultProps;
