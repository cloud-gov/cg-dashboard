import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const alignStyles = ['start', 'end'];

const propTypes = {
  children: PropTypes.any,
  align: PropTypes.oneOf(alignStyles),
  title: PropTypes.string.isRequired
};

const defaultProps = {
  align: alignStyles[0],
  title: ''
};

const ElasticLineItem = ({ children, align, title }) => (
  <div
    className={classNames('elastic_line-item', {
      [`elastic_line-item-${align}`]: !!align
    })}
    title={title}
  >
    {children}
  </div>
);

ElasticLineItem.propTypes = propTypes;

ElasticLineItem.defaultProps = defaultProps;

export default ElasticLineItem;
