
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const ALIGN_STYLES = [
  'start',
  'end'
];

const propTypes = {
  align: React.PropTypes.oneOf(ALIGN_STYLES),
  children: React.PropTypes.any
};

const defaultProps = {
  align: ALIGN_STYLES[0]
};

export default class ElasticLineItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const props = this.props;
    const alignClass = `elastic_line-item-${props.align}`;

    return (
      <div className={ this.styler('elastic_line-item', alignClass) }>
        { this.props.children }
      </div>
    );
  }
}

ElasticLineItem.propTypes = propTypes;
ElasticLineItem.defaultProps = defaultProps;
