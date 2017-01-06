
import React from 'react';
import style from 'cloudgov-style/css/cloudgov-style.css';
import createStyler from '../util/create_styler';

const ALIGNS = [
  'left',
  'center',
  'right'
];

const propTypes = {
  children: React.PropTypes.any,
  align: React.PropTypes.oneOf(ALIGNS)
};

const defaultProps = {
  children: [],
  align: null
};

export default class PanelActions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const props = this.props;
    const alignClass = props.align && `panel-actions-${this.props.align}`;

    return (
      <div className={ this.styler('panel-actions', alignClass) }>
        { this.props.children }
      </div>
    );
  }
}

PanelActions.propTypes = propTypes;
PanelActions.defaultProps = defaultProps;
