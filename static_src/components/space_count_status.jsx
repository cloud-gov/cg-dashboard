
import React from 'react';

import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

import CountStatus from './count_status.jsx';

const propTypes = {
  spaces: React.PropTypes.array
};

const defaultProps = {
  spaces: []
};

export default class SpaceCountStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  render() {
    const props = this.props;

    return <CountStatus count={ props.spaces.length} name="spaces" />
  }
}

SpaceCountStatus.propTypes = propTypes;
SpaceCountStatus.defaultProps = defaultProps;
