
import style from 'cloudgov-style';
import React from 'react';

import PanelActions from './panel_actions.jsx';

import createStyler from '../util/create_styler';

const propTypes = {
  serviceInstance: React.PropTypes.object,
  bound: React.PropTypes.bool
};

const defaultProps = {
  serviceInstances: {},
  bound: false
};

export default class ServiceInstanceListPanel extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};

    this.styler = createStyler(style);

    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  _onChange() {
    this.setState(stateSetter());
  }

  render() {

    return (
      <div>
      </div>
    );
  }
}

ServiceInstanceListPanel.propTypes = propTypes;
ServiceInstanceListPanel.defaultProps = defaultProps;
