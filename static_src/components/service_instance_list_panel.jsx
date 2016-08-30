
import style from 'cloudgov-style';
import React from 'react';

import Panelrow from './panel_row.jsx';

import createStyler from '../util/create_styler';

const propTypes = {
  serviceInstances: React.PropTypes.array,
  bound: React.PropTypes.bool
};

const defaultProps = {
  serviceInstances: [],
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
      { this.props.serviceInstances.map((serviceInstance) => {
        return (
          <PanelRow>
          </PanelRow>
        );
      })}
      </div>
    );
  }
}

ServiceInstanceListPanel.propTypes = propTypes;
ServiceInstanceListPanel.defaultProps = defaultProps;
