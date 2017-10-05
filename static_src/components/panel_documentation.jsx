
import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  children: PropTypes.any,
  description: PropTypes.bool
};
const defaultProps = {
  children: null,
  description: false
};

export default class PanelDocumentation extends React.Component {
  render() {
    const descClass = this.props.description && 'panel-documentation-desc';

    return (
      <div className={ `panel-documentation ${descClass}` }>
        { this.props.children }
      </div>
    );
  }
}

PanelDocumentation.propTypes = propTypes;
PanelDocumentation.defaultProps = defaultProps;
